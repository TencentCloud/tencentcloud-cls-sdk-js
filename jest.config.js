/* eslint-disable @typescript-eslint/no-require-imports */
const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig');

module.exports = {
  // reporters: ['default'],
  preset: 'ts-jest/presets/js-with-ts',
  rootDir: './',
  testEnvironment: 'jsdom',
  watchPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['<rootDir>/**/*[-.]test.[jt]s?(x)'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  transformIgnorePatterns: [
     '<rootDir>/node_modules',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  }
};
