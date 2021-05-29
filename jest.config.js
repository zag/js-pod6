module.exports = {
//   preset: "ts-jest",
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node",
  "testPathIgnorePatterns": ["/src/"],
  "modulePathIgnorePatterns": [
    "<rootDir>/src"
  ],
  globals: {
    "ts-jest": {
      "tsconfig": '<rootDir>/tsconfig.json'
    }
  },
 transform: {
   "^.+\\.tsx?$": "ts-jest",
 },
};
