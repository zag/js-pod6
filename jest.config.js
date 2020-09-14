module.exports = {
//  preset: "ts-jest",
  setupFilesAfterEnv: ["jest-extended"],
  testEnvironment: "node",
  "testPathIgnorePatterns": ["/src/"],
  "modulePathIgnorePatterns": [
    "<rootDir>/src"
  ]
//  transform: {
//    "^.+\\.tsx?$": "ts-jest",
//  },
};
