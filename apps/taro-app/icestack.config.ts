import { defineConfig } from '@icestack/ui'
import { getCodegenDefaults } from '@icestack/ui/defaults'
import { miniprogramPreset } from '@icestack/ui/presets'

export default defineConfig({
  outdir: './my-ui',
  presets: [miniprogramPreset(), getCodegenDefaults()],
  base: {
    selector: {
      // light: 'page',
      dark: '.dark'
    }
  }
})