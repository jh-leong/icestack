import { fixturesResolve, defaultTailwindConfig } from './utils'
import { createContext } from '@/core'
import { unwrapThemeFunctionArg } from '@/core/generator'
describe('generator', () => {
  let ctx: ReturnType<typeof createContext>
  let twCtx: ReturnType<typeof createContext>
  beforeEach(() => {
    ctx = createContext()
    twCtx = createContext({
      tailwindcssConfig: defaultTailwindConfig
    })
  })

  it('unwrapThemeFunctionArg', () => {
    expect(unwrapThemeFunctionArg('spacing.12')).toBe('spacing.12')
    expect(unwrapThemeFunctionArg('spacing[2.5]')).toBe('spacing[2.5]')
    expect(unwrapThemeFunctionArg('colors.blue.500')).toBe('colors.blue.500')
    expect(unwrapThemeFunctionArg('colors.blue.500 / 75%')).toBe('colors.blue.500 / 75%')
    expect(unwrapThemeFunctionArg("'colors.white'")).toBe('colors.white')
  })

  it('generate', () => {
    expect(ctx.generate()).toMatchSnapshot()
  })

  it('generate case 0', async () => {
    await ctx.process(fixturesResolve('common.scss'))
    expect(ctx.generate()).toMatchSnapshot()
  })

  it('generate case 1', async () => {
    await ctx.process(fixturesResolve('theme.css'))
    expect(ctx.generate()).toMatchSnapshot()
  })

  it('theme case 0', async () => {
    await ctx.process(fixturesResolve('theme-compose.css'))
    expect(ctx.generate()).toMatchSnapshot()
  })

  it('theme case 1', async () => {
    await ctx.process(fixturesResolve('theme-mutiple.css'))
    expect(ctx.generate()).toMatchSnapshot()
  })

  it('import case 0', async () => {
    await ctx.process(fixturesResolve('import-case.css'))
    expect(ctx.generate()).toMatchSnapshot()
  })

  it('import case 0 with tailwindcss config', async () => {
    await twCtx.process(fixturesResolve('import-case.css'))
    expect(ctx.generate()).toMatchSnapshot()
  })
})
