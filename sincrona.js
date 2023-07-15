const fs = require('fs');

function extractMdLinks(directory) {
  const files = fs.readdirSync(directory); // version síncrona de la función para leer directorios, readdirSync.
  const links = []; // array vacio links

  //iterar sobre los files of directory
  for (const file of files) {
    // verifica file end .md
    if (file.endsWith('.md')) {
      // With readFileSync read cont of directory especefic por "directory"
      // se agrega "file" para indicar el file al que pertenece cada enlace
      const data = fs.readFileSync(`${directory}/${file}`, 'utf8'); 
      // buscar enlaces dentro del contenido del archivo
      const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
      // Buscamos los enlaces en el contenido del archivo
      const matches = data.matchAll(linkRegex);
      
      for (const match of matches) {
        const [, text, url] = match;
         // Creamos un objeto con el texto, la URL y el archivo al que pertenece el enlace
        links.push({ text, url, file });  //se tiene el text, la url y el nombre del archivo
      }
    }
  }

  console.log(links);
}

// se especifica el directorio donde se encuentre
const directory = './filesMarkdown';
extractMdLinks(directory);

/*
module.exports = () => {
  // ...
};
*/
