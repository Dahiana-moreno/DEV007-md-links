const fetch = require('node-fetch');
const fs = require('fs');
const mdLinks = require('../index');

jest.mock('fs');
jest.mock('node-fetch');

describe('mdLinks', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Encuentra los enlaces correctamente', () => {
    fs.readdir.mockImplementation((callback, directory) => {
      const files = ['hola.txt', 'logomd.md', 'node.md'];
      directory(null, files);
    });

    fs.stat.mockImplementation((callback, filePath) => {
      const stats = {
        isFile: () => true,
        isDirectory: () => false,
      };
      filePath(null, stats);
    });

    fs.readFile.mockImplementation((options, callback, filePath) => {
      const data = 'Example [logo mdlinks](../thumb.png)';
      filePath(null, data);
    });

    const options = {
      validate: false,
    };

    return mdLinks('../DEV007-md-links/filesMarkdown/prueba', options).then((links) => {
      expect(links).toHaveLength(3);
      expect(links[0].href).toBe('../thumb.png');
      expect(links[0].text).toBe('logo mdlinks');
      expect(links[0].file).toBe('D:\\Laboratoria\\Proyectos\\md-links\\DEV007-md-links\\filesMarkdown\\prueba\\logomd.md');
    });
  });

  test('Valida los enlaces correctamente', () => {
    fs.readdir.mockImplementation((callback, directory) => {
      const files = ['firebase.md', 'pruebatexto.md', 'texto1.md'];
      directory(null, files);
    });

    fs.stat.mockImplementation((callback, filePath) => {
      const stats = {
        isFile: () => true,
        isDirectory: () => false,
      };
      filePath(null, stats);
    });

    fs.readFile.mockImplementation((options, callback, filePath) => {
      const data = 'Example Firebase [hosting firebase](https://social-neteork-pets-friends.firebaseapp.com)';
      filePath(null, data);
    });

    fetch.mockResolvedValue({
      status: 200,
      statusText: 'OK',
    });

    const options = {
      validate: true,
    };

    return mdLinks('/Laboratoria/Proyectos/md-links/DEV007-md-links/filesMarkdown', options).then((links) => {
      expect(links).toHaveLength(3);
      expect(links[0].href).toBe('https://social-neteork-pets-friends.firebaseapp.com');
      expect(links[0].text).toBe('hosting firebase');
      // expect(links[0].file).toBe('D:\\path\\to\\filesMardoe\\firebase.md');
      expect(links[0].file).toBe('D:\\Laboratoria\\Proyectos\\md-links\\DEV007-md-links\\filesMarkdown\\firebase.md');

      expect(links[0].status).toBe(200);
      expect(links[0].statusText).toBe('OK');
    });
  });
});
