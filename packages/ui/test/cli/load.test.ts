import path from 'node:path'
import { load } from '@/cli'
describe('load config', () => {
  it('load ts config', async () => {
    const config = await load(path.resolve(__dirname, 'ts'))
    expect(config?.log).toBe(false)
    expect(config).toMatchSnapshot()
  })

  it('load js config', async () => {
    const config = await load(path.resolve(__dirname, 'js'))
    expect(config?.log).toBe(false)
    expect(config).toMatchSnapshot()
  })

  it('load cjs config', async () => {
    const config = await load(path.resolve(__dirname, 'cjs'))
    expect(config?.log).toBe(false)
    expect(config).toMatchSnapshot()
  })
})