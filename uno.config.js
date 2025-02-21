import presetWind from '@unocss/preset-wind'
import presetRemToPx from '@unocss/preset-rem-to-px'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(),
    presetRemToPx({
      baseFontSize: 16,
    }),
  ],
  content: {
    filesystem: [
      '**/*.liquid',
    ],
  },
})