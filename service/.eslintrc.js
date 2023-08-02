module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 8,
  },
  rules: {
    'prettier/prettier': 'error',
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
};
