import { TinyColor } from '@ctrl/tinycolor'
import { generateColorVars, makeRgbaValue, sharedExtraColors, sharedExtraVars } from './colors'
import { CodegenOptions } from '@/types'
import { mapCss2JsArray } from '@/utils'
import { mergeR, mergeRClone } from '@/shared'

export const composeVarsObject = (colorsMap: Record<string, string>, shareVars: Record<string, string>, shareVars1: Record<string, string>) => {
  return Object.entries({
    ...colorsMap,
    ...shareVars,
    ...shareVars1
  }).reduce<Record<string, string>>((acc, [key, value]) => {
    const k = '--' + key
    const color = new TinyColor(value)
    let str = value
    if (color.isValid) {
      str = color.a < 1 && color.a > 0 ? `${color.r} ${color.g} ${color.b} / ${color.a}` : `${color.r} ${color.g} ${color.b}`
    }
    acc[k] = str
    return acc
  }, {})
}

export const calcBase = (options: CodegenOptions) => {
  const { base, varPrefix: varPrefixOptions } = options
  const { varPrefix } = varPrefixOptions
  const colors: Record<string, string> = {
    transparent: 'transparent',
    current: 'currentColor'
  }
  const { themes, extraCss: globalExtraCss, themeSelectorTemplate, mediaDarkTheme } = base ?? {}

  // @media (prefers-color-scheme: dark)
  // ??
  //   ((theme: string) => {
  //     return `[data-mode="${theme}"]`
  //   })
  const typesSet = new Set<string>()
  function addColors(obj: Record<string, string>) {
    for (const x of Object.keys(obj)) {
      const key = varPrefix + x
      colors[x] = makeRgbaValue(key)
    }
  }
  const presets = Object.entries(themes).reduce<Record<string, any>>((acc, [theme, { selector, extraColors, extraVars, extraCss, types }]) => {
    if (selector === undefined) {
      selector = themeSelectorTemplate(theme) // `[data-mode="${theme}"]`
    }
    if (typeof selector === 'string' && selector) {
      const entries = Object.entries(types ?? {})
      const typesColors = entries.reduce<Record<string, string>>((acc, [type, value]) => {
        typesSet.add(type)
        let obj = value
        switch (true) {
          case typeof value === 'string': {
            obj = generateColorVars(type, value, theme === 'dark')
            break
          }
          case Array.isArray(value): {
            obj = generateColorVars(type, value[0], value[1])
            break
          }
        }
        addColors(obj as Record<string, string>)
        return {
          ...acc,
          ...(obj as Record<string, string>)
        }
      }, {})
      const css = mergeRClone(composeVarsObject(typesColors, extraColors ?? sharedExtraColors.light, extraVars ?? sharedExtraVars), ...mapCss2JsArray(extraCss))
      acc[selector] = {
        css
      }
      if (mediaDarkTheme === theme) {
        acc['@media (prefers-color-scheme: dark)'] = {
          css
        }
      }
    }

    if (extraColors) {
      for (const x of Object.keys(extraColors)) {
        const key = varPrefix + x
        colors[x] = makeRgbaValue(key)
      }
    }

    return acc
  }, {})
  if (globalExtraCss) {
    mergeR(presets, ...mapCss2JsArray(globalExtraCss))
  }

  return {
    presets,
    types: [...typesSet],
    colors
  }
}
