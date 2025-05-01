
import { TextDecoder, TextEncoder } from 'util';

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;


// setup google maps mock 
import './src/__mocks__/google-maps.js';


// setup fetch mock
import 'jest-fetch-mock';

import '@testing-library/jest-dom'

import dotenv from 'dotenv';

dotenv.config({ path: ".env.local" });

