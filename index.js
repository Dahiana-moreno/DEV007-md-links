const fs = require('fs');  // Handling (manipulacion) system of files
const fetch = require('node-fetch');  // Requests HTTP
const path = require('path');

function mdLinks(directory, options) {  // The function receives (recibe) the directory and options
  return new Promise((resolve, reject) => {   // return the new promise
    const resolvedDirectory = path.resolve(directory); 
    // readdir read de forma asincrona el contenido de un directorio detreminado
    //funciona mediante 3 parametros url, options, devolucion de llamada
    fs.readdir(resolvedDirectory, (error, files) => {  //callback read files in the directory
      if (error) {
        reject(error);  // operation failed we reject la promise.  The result is an error object
       return;
      } else {
      console.log("\nCurrent directory: ");   // get the current directory and the files 
             } 
      files.forEach(filess => {
      console.log(filess)  //print  name of the files of directory
      })

      const links = [];  // store all links
      const validLinks = [];
      const invalidLinks = []; 
    //  function readFile(index) {  //redafile import require(fs)
        function processFile(index) { //  se utiliza para procesar cada archivo de forma recursiva. Comienza con el primer archivo en el índice 0.
        if (index >= files.length) {   // Si se ha procesado todos los archivos, resolver la promesa
          resolve(links);
          return;
        }

        const file = files[index];
        const filePath = path.join(resolvedDirectory, file); // unir los segmentos de las rutas encontradas

        fs.stat(filePath , (error, stats) => {     //devuelve la info sobre el directorio
          if (error) {
            reject(error);
            return;
          }
          // Si es un archivo y tiene extensión .md
          if (stats.isFile() && file.endsWith('.md')) {
            fs.readFile(filePath, 'utf8', (error, data) => {  // busca los enlaces utilizando una expresión regular.
              if (error) {
                reject(error);
                return;
              }

              const searchLinks = /\[([^\]]+)\]\(([^\)]+)\)/g;
              let unite; // match all links
              while ((unite = searchLinks.exec(data)) !== null) {  //bucle encontara all the link
                const [, text, href] = unite;
                const link = { href, text, file: filePath };  // all the links and propiediedades
                if (options.validate) {
       // Si se requiere validación, realizar una petición HTTP HEAD al enlace
                  fetch(href, { method: 'HEAD' })   // fetch para realizar solicitudes HTTP 
                    .then((response) => {
 // Asignar el estado de la respuesta y determinar si el enlace es válido
                     link.status = response.status;
                    link.statusText = response.statusText;
                    if (response.ok || response.redirected) {
                    link.ok = true;
                    } else {
                    link.ok = false;
                     }
                    links.push(link);
                     processFile(index + 1);
                     })
                    .catch((error) => {
                      console.error('Error:', error);
                      links.push(link);
                      processFile(index + 1);
                    });
                } else {
                  links.push(link);
                  processFile(index + 1);
                }
              }

              if (!options.validate) {
                processFile(index + 1);
              }
            });
          } else {
            processFile(index + 1);
          }
        });
      }

      processFile(0);
    });
  });
}

module.exports = mdLinks;
