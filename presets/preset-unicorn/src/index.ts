import { transformCss2Js } from '@icestack/shared'
import type { ComponentsOptions, Preset } from '@icestack/types'

const components: ComponentsOptions = {}

const preset: () => Preset = () => {
  return {
    components
  }
}

export default preset
