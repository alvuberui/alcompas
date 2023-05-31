

// En caso de tener variables de entorno y aún no soporta el import.meta.env
// yarn add -D dotenv
require('dotenv').config({
    path: '.env.test'
});

// Realizar el mock completo de las variables de entorno
jest.mock('./src/helpers/getEnvVariables', () => ({
    getEnvVariables: () => ({ ...process.env })
}));

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
