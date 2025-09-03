module.exports = {
  extends: ['eslint-config-tencent', 'eslint-config-tencent/ts', 'eslint-config-tencent/prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: '.',
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};
