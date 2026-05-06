module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverage: false,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
  ,
  reporters: [
    'default',
    [ 'jest-junit', { outputDirectory: 'artifacts/junit', outputName: 'server-junit.xml' } ]
  ]
};
