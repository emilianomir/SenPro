import { TextDecoder, TextEncoder } from 'util';

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;


// import { ReadableStream } from 'web-streams-polyfill/ponyfill';
// if (typeof global.ReadableStream === 'undefined') {
//     global.ReadableStream = ReadableStream;
//   }
// allow jest to use @testing-library/jest-dom matchers
// import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

// setup google maps mock 
// import './src/__mocks__/google-maps.js';
import './src/__mocks__/google-maps.js';

// setup fetch mock
import 'jest-fetch-mock';