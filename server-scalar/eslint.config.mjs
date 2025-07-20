import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app',
  typescript: true,
  formatters: true,
  ignores: ['node_modules'],
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'double',
  },
})
