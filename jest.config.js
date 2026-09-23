module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.env.js', '<rootDir>/jest.setup.polyfills.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(scss|css|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/'],
  testMatch: ['**/__tests__/**/*.{ts,tsx,js,jsx}', '**/*.{spec,test}.{ts,tsx,js,jsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/index.{ts,tsx,js}',
    '!src/**/*.d.ts',
    '!src/types/**',
  ],
};
