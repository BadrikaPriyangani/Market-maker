module.exports = {
    roots: ['<rootDir>'],
    transform: {
      '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testMatch: ['**/__tests__/**/*.test.[jt]s'],
    collectCoverageFrom: [
        '!**/index.ts',
        '!**/index.js',
        '!**/__tests__/**',
        '!**/jest.config.ts',
        '!./types/**',
        '!**/node_modules/**',
      ],
      
  };