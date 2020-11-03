module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  plugins: ['prettier'],
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'error',
    'prettier/prettier': 'error',
    'class-mehtods-use-this': 'off',
    'lines-between-class-members': 'off'
  }
};
