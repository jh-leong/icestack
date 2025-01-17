import fs from 'node:fs'
import path from 'node:path'
import { set, get, pick } from 'lodash'
import * as sass from 'sass'
import type { Value } from 'sass'
import type { Root, AcceptedPlugin } from 'postcss'
import cliProgress from 'cli-progress'
import kleur from 'kleur'
import { transformJsToSass } from '@/sass'
import { createDefaultTailwindcssExtends } from '@/defaults'
import { logger } from '@/log'
import { clearLine, JSONStringify, ensureDirSync } from '@/utils'
import { generateIndexCode } from '@/js'
import type { CodegenOptions, ILayer, CssInJs, CreatePresetOptions } from '@/types'
import { defu } from '@/shared'
import { getCodegenOptions } from '@/options'
import { resolveJsDir, getCssPath, getJsPath, getCssResolvedPath, scssTemplate } from '@/dirs'
import { stages } from '@/constants'
import { handleOptions } from '@/components/utils'
import { utilitiesNames, utilitiesMap } from '@/utilities'
import { calcBase } from '@/base'
import { getPrefixerPlugin, getCssVarsPrefixerPlugin, resolveTailwindcss, initTailwindcssConfig, objectify, process, resolvePrefixOption, resolveVarPrefixOption } from '@/postcss'
function makeDefaultPath(layer: ILayer, ...suffixes: string[]) {
  return `${layer}.${suffixes.join('.')}`
}

export function createContext(opts?: CodegenOptions) {
  const options = getCodegenOptions(opts)
  const { outdir, dryRun, prefix: _globalPrefix, varPrefix: _globalVarPrefix, mode: globalMode, components = {}, log, tailwindcssConfig, utilities } = options
  const globalPrefix = resolvePrefixOption(_globalPrefix)
  const globalVarPrefix = resolveVarPrefixOption(_globalVarPrefix)
  if (typeof log === 'boolean') {
    logger.logFlag = log
  }

  const { types, presets: basePresets, colors } = calcBase(options)

  function writeFile(file: string, data: string) {
    !dryRun && fs.writeFileSync(file, data, 'utf8')
  }

  function getPaths(relPath: string) {
    const cssPath = getCssPath(relPath, outdir)
    const jsPath = getJsPath(relPath, outdir)
    const cssResolvedPath = getCssResolvedPath(relPath, outdir)

    if (!dryRun) {
      ensureDirSync(path.dirname(cssPath))
      ensureDirSync(path.dirname(jsPath))
      ensureDirSync(path.dirname(cssResolvedPath))
    }
    return {
      cssPath,
      jsPath,
      cssResolvedPath
    }
  }

  function createPreset(opts: CreatePresetOptions): Record<string, object> {
    return Object.entries(components).reduce<Record<string, object>>((acc, [name, comOpt]) => {
      if (comOpt === false) {
        return acc
      }

      if (comOpt.mode === undefined) {
        comOpt.mode = globalMode
      }

      if (!comOpt.disabled) {
        acc[name] = handleOptions(comOpt, opts)
      }

      return acc
    }, {})
  }

  const presets = createPreset({
    types
  })

  const allComponentsNames = Object.keys(presets)
  const twConfig = initTailwindcssConfig(tailwindcssConfig, {
    theme: {
      extend: {
        ...createDefaultTailwindcssExtends({ varPrefix: globalVarPrefix!.varPrefix }),
        colors
      }
    }
  })

  function compileScss(defaultPath?: string) {
    const sassOptions: sass.Options<'sync'> = {
      functions: {
        "inject($path:'')": (args: Value[]) => {
          const p = (args[0].assertString().text || defaultPath) ?? ''
          const idx = p.indexOf('.')
          const layer = p.slice(0, Math.max(0, idx))
          const suffix = p.slice(Math.max(0, idx + 1))
          let res = null
          switch (layer) {
            case 'components': {
              res = get(presets, suffix, {})
              break
            }
            case 'base': {
              res = basePresets
              break
            }
            case 'utilities': {
              const fn = get(utilitiesMap, suffix, () => {})
              // @ts-ignore
              res = suffix === 'custom' ? fn?.(utilities?.extraCss) : fn?.()

              break
            }
            default:
          }
          return transformJsToSass(res)
        }
      }
    }

    return sass.compile(scssTemplate, sassOptions)
  }

  function preprocessCss(css: string, layer?: ILayer, name?: string) {
    const plugins: AcceptedPlugin[] = []

    if (layer === 'components' && name) {
      const t = components[name]

      if (typeof t === 'object') {
        const varPrefixOptions = resolveVarPrefixOption(t.varPrefix)
        const varPrefixerPlugin = getCssVarsPrefixerPlugin(defu(varPrefixOptions, globalVarPrefix))
        varPrefixerPlugin && plugins.push(varPrefixerPlugin)
        const prefixOptions = resolvePrefixOption(t.prefix)
        const prefixerPlugin = getPrefixerPlugin(defu(prefixOptions, globalPrefix))
        prefixerPlugin && plugins.push(prefixerPlugin)
      }
    } else {
      const varPrefixerPlugin = getCssVarsPrefixerPlugin(globalVarPrefix!)
      varPrefixerPlugin && plugins.push(varPrefixerPlugin)
      const prefixerPlugin = getPrefixerPlugin(globalPrefix)
      prefixerPlugin && plugins.push(prefixerPlugin)
    }

    return process(plugins, css)
  }

  async function internalBuild(opts: { layer: ILayer; suffixes: string[]; relPath: string }) {
    const { layer, suffixes, relPath } = opts
    const defaultPath = makeDefaultPath(layer, ...suffixes)
    const { css } = compileScss(defaultPath)
    const { css: cssOutput } = preprocessCss(css, layer, suffixes[0])
    const { cssPath, cssResolvedPath, jsPath } = getPaths(relPath)

    // scss -> css
    writeFile(cssPath, cssOutput)

    const { root, css: resolvedCss } = await resolveTailwindcss({
      css: cssOutput,
      config: twConfig,
      options
    })

    writeFile(cssResolvedPath, resolvedCss)

    const cssInJs = objectify(root as Root)

    const data = 'module.exports = ' + JSONStringify(cssInJs)
    // css -> js
    writeFile(jsPath, data)

    return {
      css,
      resolvedCss,
      cssInJs
    }
  }

  function buildBase() {
    const layer: ILayer = 'base'
    return internalBuild({
      layer,
      suffixes: ['index'],
      relPath: `${layer}/index.scss`
    })
  }

  async function buildUtilities() {
    const layer: ILayer = 'utilities'
    const res: Record<string, Record<string, CssInJs>> = {}
    for (const utilityName of utilitiesNames) {
      const result = await internalBuild({
        layer,
        suffixes: [utilityName],
        relPath: `${layer}/${utilityName}.scss`
      })

      set(res, utilityName, result)
    }

    if (!dryRun) {
      const outputPath = path.resolve(resolveJsDir(outdir), 'utilities')
      const code = generateIndexCode(utilitiesNames, 'utilities')
      fs.writeFileSync(path.resolve(outputPath, 'index.cjs'), code, 'utf8')
    }

    return res
  }

  async function buildComponents() {
    const b1 = new cliProgress.SingleBar(
      {
        format: 'building components: [{bar}] | {componentName} | {value}/{total}'
        // barCompleteChar: '\u2588',
        // barIncompleteChar: '\u2591'
        // hideCursor: true
      },
      cliProgress.Presets.shades_classic
    )
    b1.start(allComponentsNames.length, 0)
    const layer: ILayer = 'components'
    const res: Record<string, Record<string, CssInJs>> = {}
    let idx = 0
    for (const componentName of allComponentsNames) {
      // const start = performance.now()
      for (const stage of stages) {
        const result = await internalBuild({
          layer,
          suffixes: [componentName, 'defaults', stage],
          relPath: `${layer}/${componentName}/${stage}.scss`
        })

        set(res, `${componentName}.${stage}`, result)
        // res[componentName][stage] = cssJsObj
      }
      b1.update(++idx, {
        componentName
      })
      // const end = performance.now()
      // logger.success(`build component [${componentName}] finished! ` + `${end - start}ms`)
    }

    if (!dryRun) {
      const componentsJsOutputPath = path.resolve(resolveJsDir(outdir), 'components')
      const code = generateIndexCode(allComponentsNames, 'components')
      fs.writeFileSync(path.resolve(componentsJsOutputPath, 'index.cjs'), code, 'utf8')
    }
    b1.stop()
    clearLine()

    return res
  }

  function buildTailwindcssConfig() {
    if (!dryRun) {
      const code = 'module.exports = ' + JSONStringify(pick(twConfig, ['theme']))
      const outputDir = path.resolve(resolveJsDir(outdir), 'tailwindcss')
      ensureDirSync(outputDir)
      const outputPath = path.resolve(outputDir, 'config.cjs')
      fs.writeFileSync(outputPath, code, 'utf8')
    }

    return twConfig
  }

  async function build() {
    performance.mark('buildBase-start')
    const base = await buildBase()
    performance.mark('buildBase-end')
    const buildBaseMeasure = performance.measure('buildBase', 'buildBase-start', 'buildBase-end')
    logger.success('build base finished! ' + kleur.green(`${buildBaseMeasure.duration.toFixed(2)}ms`))
    performance.mark('buildUtilities-start')
    const utilities = await buildUtilities()
    performance.mark('buildUtilities-end')
    const buildUtilitiesMeasure = performance.measure('buildUtilities', 'buildUtilities-start', 'buildUtilities-end')
    logger.success('build utilities finished! ' + kleur.green(`${buildUtilitiesMeasure.duration.toFixed(2)}ms`))
    performance.mark('buildComponents-start')
    const components = await buildComponents()
    performance.mark('buildComponents-end')
    const buildComponentsMeasure = performance.measure('buildComponents', 'buildComponents-start', 'buildComponents-end')
    logger.success('build components finished! ' + kleur.green(`${buildComponentsMeasure.duration.toFixed(2)}ms`))
    performance.mark('buildTailwindcssConfig-start')
    const tailwindcssConfig = await buildTailwindcssConfig()
    performance.mark('buildTailwindcssConfig-end')
    const buildTailwindcssConfigMeasure = performance.measure('buildTailwindcssConfig', 'buildTailwindcssConfig-start', 'buildTailwindcssConfig-end')
    logger.success('build tailwindcss config finished! ' + kleur.green(`${buildTailwindcssConfigMeasure.duration.toFixed(2)}ms`))
    performance.clearMarks()
    performance.clearMeasures()
    return {
      base,
      components,
      utilities,
      tailwindcssConfig
    }
  }

  return {
    tailwindcssConfig: twConfig,
    buildBase,
    buildUtilities,
    buildComponents,
    buildTailwindcssConfig,
    presets,
    options,
    build,
    compileScss,
    createPreset,
    preprocessCss
  }
}

export type IContext = ReturnType<typeof createContext>
