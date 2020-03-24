//jest-environment-jsdom is browser env containing a window object
module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: ["**/lib/**/*.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  coverageThreshold: {
    global: {
      statements: 10,
      branches: 4,
      lines: 10,
      functions: 10
    }
  }
};
