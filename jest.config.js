module.exports = {
  projects: [
    {
      displayName: 'backend api',
      testEnvironment: 'node',
      testMatch: ['**/src/api/**/?(*.)+(spec|test).js'],
      setupFiles: ['./src/api/tests/setup-tests.js'],
      restoreMocks: true,
      coveragePathIgnorePatterns: ['./node_modules'],
      coverageReporters: ['text', 'lcov', 'clover', 'html'],
    },
    {
      displayName: 'frontend public',
      testEnvironment: 'jsdom',
      testMatch: ['**/src/public/**/?(*.)+(spec|test).js'],
      moduleFileExtensions: ['js', 'json'],
      restoreMocks: true,
      coveragePathIgnorePatterns: ['./node_modules'],
      coverageReporters: ['text', 'lcov', 'clover', 'html'],
    },
  ],
};
