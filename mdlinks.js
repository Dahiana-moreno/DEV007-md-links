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
/*
  mdLinks(directory, cat)
  .then((links) => {
    console.log('\nLinks found false:', links);
  })
  .catch((error) => {
    console.error('\nError in the route of directory: \n', error);
  });
  */
