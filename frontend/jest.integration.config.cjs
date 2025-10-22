module.exports = {
  // Only run tests inside integration-tests folder
  testMatch: ['**/integration-tests/**/*.test.js'],
  testEnvironment: 'node',
  // Do not transform files (keep it simple for E2E HTTP tests)
  transform: {},
  // Increase timeout for slow CI environments
  testTimeout: 30000,
};
