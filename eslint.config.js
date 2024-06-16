import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    vue: false,
    typescript: true,
  },
)
  .overrideRules({
    'import/order': ['error', {
      alphabetize: {
        order: 'asc',
      },
    }],
  })
