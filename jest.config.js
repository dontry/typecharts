/* eslint-disable no-undef */
//jest-environment-jsdom is browser env containing a window object
module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: ["<rootDir>/lib/**/*.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@/types/(.*)$": "<rootDir>/lib/types/$1",
    "^@/components/(.*)$": "<rootDir>/lib/components/$1",
    "^@/utils/(.*)$": "<rootDir>/lib/utils/$1",
  },
  coverageThreshold: {
    global: {
      statements: 10,
      branches: 4,
      lines: 10,
      functions: 10,
    },
  },
};
