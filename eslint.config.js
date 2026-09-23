const pluginReact = require('eslint-plugin-react');
const pluginA11y = require('eslint-plugin-jsx-a11y');
const pluginReactHooks = require('eslint-plugin-react-hooks');
const configPrettier = require('eslint-config-prettier');
const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = [
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react: pluginReact,
      'jsx-a11y': pluginA11y,
      'react-hooks': pluginReactHooks,
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginA11y.configs.recommended.rules,
      ...tseslint.configs.eslintRecommended.rules,
      // Props are typed with TypeScript interfaces instead of PropTypes
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/alt-text': 'error',
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  configPrettier,
];
