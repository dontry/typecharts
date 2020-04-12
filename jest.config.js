/* eslint-disable no-undef */
//jest-environment-jsdom is browser env containing a window object
module.exports = {
  globals: {
    "ts-jest": {
      diagnostics: false,
    },
  },
  preset: "ts-jest",
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@/types/(.*)$": "<rootDir>/src/types/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
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
