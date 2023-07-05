const { mdLinks } = require('./index.js');

const directory = './filesMarkdown';
const options = { validate: true }; // Cambiar a false si no se desea validar los links

mdLinks(directory, options)
  .then((links) => {
    const validLinks = links.filter((link) => link.valid);
    const invalidLinks = links.filter((link) => !link.valid);

    console.log('Enlaces válidos:');
    console.log(validLinks);

    console.log('Enlaces inválidos:');
    console.log(invalidLinks);
  })
  .catch((error) => {
    console.error('Error:', error);
  });