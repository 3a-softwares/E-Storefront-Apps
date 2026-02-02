/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@3asoftwares/utils$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/utils/client$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/utils/server$': '<rootDir>/tests/__mocks__/utils.ts',
    '^@3asoftwares/ui$': '<rootDir>/tests/__mocks__/ui-library.tsx',
    '^@3asoftwares/types$': '<rootDir>/tests/__mocks__/types.ts',
    '^@fortawesome/react-fontawesome$': '<rootDir>/tests/__mocks__/fontawesome.tsx',
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(zustand|@fortawesome)/)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/bootstrap.tsx',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testTimeout: 10000,
  verbose: true,
};
