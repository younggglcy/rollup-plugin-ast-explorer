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
    // TODO: throws TypeError: context.getSource is not a function
    // should enable this rule when it's fixed by update deps
    'react-hooks/exhaustive-deps': 'off',
  })
