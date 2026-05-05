module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
  ,
  reporters: [
    'default',
    [ 'jest-junit', { outputDirectory: 'artifacts/junit', outputName: 'client-junit.xml' } ]
  ]
};
