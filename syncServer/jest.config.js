export default {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
  ],
  rootDir: '.',
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
    '#middleware/*': '<rootDir>/src/middleware/$1',
    '#utils/*': '<rootDir>/src/utils/$1',
    '#config/*': '<rootDir>/src/config/$1',
    '#api/*': '<rootDir>/src/api/$1/$1',
    '#db/*': '<rootDir>/src/database/models/$1/$1',
  },
};
