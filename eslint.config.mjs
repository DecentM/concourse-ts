import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends('eslint-config-prettier'),
  {
    rules: {
      'camelcase': 'off',
      'lines-between-class-members': 'off',
      'spaced-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  { ignores: ['node_modules', '**/node_modules/', '**/dist/'] }
)
