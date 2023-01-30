module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: [
    './src/test/setup.ts'
  ],
  testEnvironment: "node"
};