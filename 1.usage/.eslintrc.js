module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-param-reassign': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'linebreak-style': 'off',
  },
};
