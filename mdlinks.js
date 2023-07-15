/*
const mdLinks = require('./index');
// get the directory desde la línea de comandos

const path = process.argv[2]; // Obtener el argumento <path-to-file>
const options = {
  validate: process.argv.includes('--validate'), // Verificar si se proporciona la opción --validate
  stats: process.argv.includes('--stats'), // Verificar si se proporciona la opción --stats
};

mdLinks(path, options)
  .then((result) => {
    if (options.stats) {
      // Mostrar estadísticas básicas
      console.log('Total:', result.total);
      console.log('Unique:', result.unique);
      if (options.validate) {
        console.log('Broken:', result.broken);
      }
    } else {
      // Mostrar los enlaces encontrados si hay enlaces válidos
      console.log(result);
      if (result.links) {
        result.links.forEach((link) => {
          const { href, text, file } = link;
          const status = options.validate ? `${link.status} ${link.statusText}` : '';
          console.log(file, href, status, text.substring(0, 50));
        });
      } else {
        console.log('No se encontraron enlaces.');
      }
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
*/
/*
  // const path = require('path');
  const mdLinks = require('./index');

  const directoryPath = process.argv[3]; // get directory proporcionado en la linea de comandos
  const options = {
    validate: true,
    stats: true,
  };

  mdLinks(directoryPath, options)
    .then((result) => {
      result.forEach((link) => {
        const { href, text, file, status, statusText } = link;
        console.log(`File: ${file}\nLink: ${href}\nText: ${text}`);
        if (status !== undefined && statusText !== undefined) {
          console.log(`Status: ${status} ${statusText}`);
        }
        console.log('------------');
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
*/
/*
const mdLinks = require('./index');
// get the directory desde la línea de comandos
const directory = process.argv[2]; // get directory proporcionado en la linea de comandos
const options = { validate: true };
// const cat = { validate: false };
mdLinks(directory, options)
  .then((links) => {
    console.log('\nLinks found:', links);
  })
  .catch((error) => {
    console.error('\nError in the route of directory: \n', error);
  });
  */

const mdLinks = require('./index');

  const path = process.argv[2];
  const options = {
    validate: process.argv.includes('--validate'),
    stats: process.argv.includes('--stats'),
  };
  
  mdLinks(path, options)
    .then((result) => {
      if (options.stats) {
        const totalLinks = result.length;
        const uniqueLinks = new Set(result.map((link) => link.href)).size;
        const brokenLinks = result.filter((link) => link.status >= 400).length;
        console.log('Total:', totalLinks);
        console.log('Unique:', uniqueLinks);
        console.log('Broken:', brokenLinks);
      } else {
        result.forEach((link) => {
          const { href, text, file, status, statusText } = link;
          console.log(text)
         console.log(`File: ${file}\nLink: ${href}\nText: ${text}`);
         if (status !== undefined && statusText !== undefined) {
          console.log(`Status: ${status} ${statusText}`);
        }
        console.log('------------');
      });
    } })
    .catch((error) => {
      console.error('Error:', error);
    });

