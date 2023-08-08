export default [
  {
    'screen-full': 'w-screen h-screen'
  },
  [
    /^scrollbar-(x|y)$/,
    ([, c]) => {
      // TODO: theme color set
      const com =
        'scrollbar scrollbar-rounded scrollbar-track-color-gray-300 scrollbar-thumb-color-text'
      if (c === 'x') {
        return `${com} scrollbar-h-4px`
      } else if (c === 'y') {
        return `${com} scrollbar-w-4px`
      } else {
        return ''
      }
    }
  ],
  {
    'k-btn':
      'inline-flex justify-center items-center lh-none bg-transparent border-text transition-colors text-sm c-text py-2 px-4 rounded border-1 border-solid hover:shadow-md hover:bg-primary hover:border-primary hover:c-white'
  },
  [
    /^k-btn-(.*)$/,
    ([, c]) =>
      `bg-${c} border-${c} text-white hover:bg-${c}-400 hover:border-${c}-400 hover:shadow-${c}-400`
  ]
]
