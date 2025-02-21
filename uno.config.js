import presetWind from '@unocss/preset-wind'
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetWind(),
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