module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "./test-results", outputName: "junit.xml" }]
  ]
};
