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
  // include: [
  //   'sections/**/*.liquid',
  //   'sections/*.liquid',
  //   './sections/**/*.liquid',
  //   './sections/*.liquid',
  //   'snippets/**/*.liquid',
  //   'snippets/*.liquid',
  //   './snippets/**/*.liquid',
  //   './snippets/*.liquid',
  //   '**/*.liquid',
  //   '**.liquid',
  //   '*.liquid',
  // ],
  content: {
    filesystem: [
      '**/*.liquid',
    ],
    // pipeline: {
    //   include: [
    //     'sections/**/*.liquid',
    //     'sections/*.liquid',
    //     './sections/**/*.liquid',
    //     './sections/*.liquid',
    //     'snippets/**/*.liquid',
    //     'snippets/*.liquid',
    //     './snippets/**/*.liquid',
    //     './snippets/*.liquid',
    //     '**/*.liquid',
    //     '**.liquid',
    //     '*.liquid',
    //   ],
    // },
  },
})