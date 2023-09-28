module.exports = {
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    "/node_modules/",
    ".module.ts",
    "config.ts",
    "main.ts"
  ],
  moduleNameMapper: {
    '^@app/lb-base64$': '<rootDir>/libs/lb-base64/src',
    '^@app/lb-email$': '<rootDir>/libs/lb-email/src',
    '^@app/lb-jwt$': '<rootDir>/libs/lb-jwt/src',
    '^@app/lb-keys$': '<rootDir>/libs/lb-keys/src',
    '^@app/lb-crypto$': '<rootDir>/libs/lb-crypto/src',
  }
}