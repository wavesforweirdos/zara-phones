const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Stub so jest.spyOn(global, 'fetch') can wrap it — individual tests replace it via mockResolvedValue
global.fetch = () => Promise.reject(new Error('fetch not mocked in this test'));
