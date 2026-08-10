const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const importPlugin = require('eslint-plugin-import')
const jest = require('eslint-plugin-jest')
const prettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts'],
          moduleDirectory: ['node_modules', 'src/'],
        },
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
  {
    files: ['**/*.test.ts'],
    ...jest.configs['flat/recommended'],
  },
)
