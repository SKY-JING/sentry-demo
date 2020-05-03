module.exports = {
  root: true,
  env: {
    node: true
  },
  'globals': {
    'AMap': false
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'generator-star-spacing': 'off',
    'space-before-function-paren': 0,
    'one-var': 0,
    'eol-last': 0,
    'semi': ['error', 'always'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
