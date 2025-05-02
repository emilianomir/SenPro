
// export default {
//   testEnvironment: 'jsdom',
//   moduleDirectories: ['node_modules', '<rootDir>/src'],

//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

//     '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
//   },

//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

//   testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

//   transform: {
//     '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
//   },
// };

import nextJest from 'next/jest.js'
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)

