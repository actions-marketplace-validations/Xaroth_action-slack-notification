/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

// Packages shipped as ESM only; they need transforming before jest can require them.
const esModules = ['p-limit'].join('|')

module.exports = {
  coverageDirectory: 'test-results/coverage-results',
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    [`(${esModules}).+\\.js$`]: ['ts-jest', { tsconfig: 'tsconfig.json' }],
    '^.+\\.ts?(x)?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
}
