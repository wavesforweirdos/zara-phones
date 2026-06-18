const pluginReact = require('eslint-plugin-react');
const pluginA11y = require('eslint-plugin-jsx-a11y');
const configPrettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      react: pluginReact,
      'jsx-a11y': pluginA11y,
    },
    languageOptions: {
      ecmaVersion: 2021,
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
      'react/prop-types': 'warn',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/alt-text': 'error',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
    },
  },
  configPrettier,
];
