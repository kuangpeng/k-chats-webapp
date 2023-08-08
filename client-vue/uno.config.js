import { defineConfig, presetUno, presetAttributify } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import presetChinese from 'unocss-preset-chinese'
import transformerDirectives from '@unocss/transformer-directives'

import { colors, shortcuts, rules } from './src/theme'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'inline-flex',
        'vertical-align': 'middle',
        'line-height': 1
      }
    }),
    presetScrollbar(),
    presetChinese()
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors
  },
  rules,
  shortcuts,
  safelist: [...'k-btn-primary k-btn-success k-btn-info k-btn-warning k-btn-danger'.split(' ')]
})
