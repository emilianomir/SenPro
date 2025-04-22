// // babel is a compiler that turn nou js into js so jest can understand it
// module.exports = {
//     testEnvironment: 'jsdom', // simulate a browser to test stuff
//     moduleNameMapper: {
//       // this is for stuff that is not js or things jest doesn't understand, 
//       // this checks and replaces things that aren't js to js so that jest doesnt crash
//       '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // for css files
//       '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // for images
//     },
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // this is for setup files that need to be run before the tests    
//     testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'], // this is for paths for jest to ignore, kinda like gitignore
//     transform: { // stepping outside of nextjs env and throwing it to babel
//       '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }], // this is for turning js into js for JEST
//     },
//   };

//   // now need only a file to handle the mock files in lieu of the actual files
//   // create a file called fileMock.js in the src folder and add the following:
//   module.exports = 'test-file-stub';

export default {
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',

    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};