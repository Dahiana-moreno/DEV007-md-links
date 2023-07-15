module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  // eslint-disable-next-line linebreak-style
  extends: 'airbnb-base',
  overrides: [
    {
      files: ['test/**/*.js'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': 0,
    'no-console': 'off',
  },
};
