import { defineConfig, presetUno, presetAttributify } from 'unocss'
import presetIcons from '@unocss/preset-icons'

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
    })
  ],
  theme: {
    colors: {
      'primary-100': '#D5FAFB',
      'primary-200': '#AEF0F8',
      'primary-300': '#81D8EA',
      'primary-400': '#5DB9D5',
      'primary-500': '#2F90B9',
      'primary-600': '#22719F',
      'primary-700': '#175585',
      'primary-800': '#0E3D6B',
      'primary-900': '#092B58',
      'success-100': '#EDFBD1',
      'success-200': '#D7F8A4',
      'success-300': '#B5EC73',
      'success-400': '#92D94E',
      'success-500': '#64C11D',
      'success-600': '#4BA515',
      'success-700': '#368A0E',
      'success-800': '#246F09',
      'success-900': '#175C05',
      'info-100': '#CFE9FD',
      'info-200': '#A0D0FC',
      'info-300': '#6FB1F7',
      'info-400': '#4B94EF',
      'info-500': '#1468E5',
      'info-600': '#0E50C4',
      'info-700': '#0A3BA4',
      'info-800': '#062984',
      'info-900': '#031D6D',
      'warning-100': '#FFF4CC',
      'warning-200': '#FFE799',
      'warning-300': '#FFD666',
      'warning-400': '#FFC53F',
      'warning-500': '#FFAA00',
      'warning-600': '#DB8A00',
      'warning-700': '#B76D00',
      'warning-800': '#935300',
      'warning-900': '#7A4000',
      'danger-100': '#FDE6D1',
      'danger-200': '#FBC7A4',
      'danger-300': '#F49E75',
      'danger-400': '#E97752',
      'danger-500': '#DB3E1E',
      'danger-600': '#BC2515',
      'danger-700': '#9D110F',
      'danger-800': '#7F0910',
      'danger-900': '#690513'
    }
  },
  rules: [
    [
      /^text-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { color: theme.colors[c] }
      }
    ],
    [
      /^bg-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { 'background-color': theme.colors[c] }
      }
    ],
    [
      /^border-c-(.*)$/,
      ([, c], { theme }) => {
        if (theme.colors[c]) return { 'border-color': theme.colors[c] }
      }
    ]
  ]
})
