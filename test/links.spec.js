const axios = require('axios');
const mdLinks = require('../src/index');

// Mock de axios
jest.mock('axios');

describe('mdLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('busca las URL y develve los enlaces con estado cuando options.validate es verdadero', () => {
    // Mock de los datos de respuesta de axios
    const response = {
      status: 200,
      statusText: 'OK',
    };

    // Mock de la función head de axios
    axios.head.mockResolvedValue(response);

    const directory = './filesMarkdown'; // Reemplaza con tu directorio de prueba
    const options = { validate: true };

    return mdLinks(directory, options).then((links) => {
      // Verificar el resultado esperado
      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).toHaveProperty('status', response.status);
      expect(links[0]).toHaveProperty('statusText', response.statusText);
    }).catch((error) => {
      throw error;
    });
  });

  test('devuelve los enlaces sin estado cuando options.validate es falso', () => {
    const directory = './filesMarkdown';
    const options = { validate: false };

    return mdLinks(directory, options).then((links) => {
      // Verificar el resultado esperado
      expect(Array.isArray(links)).toBe(true);
      expect(links.length).toBeGreaterThan(0);
      expect(links[0]).not.toHaveProperty('status');
      expect(links[0]).not.toHaveProperty('statusText');
    }).catch((error) => {
      // Manejar el rechazo (reject) en caso de error
      throw error;
    });
  });

  test('debe manejar los errores y rechazar la promesa', () => {
    const error = new Error('error');

    // Mock de la función head de axios para que devuelva un error
    axios.head.mockRejectedValue(error);

    const directory = './filesMarkdown';
    const options = { validate: true };

    return mdLinks(directory, options).then(() => {
      // La promesa debería rechazarse, así que fallará si se resuelve
      throw error;
    }).catch((err) => {
      // Verificar el error esperado
      expect(err).toBe(error);
    });
  });
});
