const axios = require('axios');
const fs = require('fs');
const path = require('path');

function fetchUrl(link) { // fetchUrl para utilizar axios y hacer solicitud HTTP
  /* la función fetchUrl() que utiliza axios para hacer
   una solicitud HTTP HEAD a un enlace y obtener el estado 
   de la respuesta. Si la solicitud es exitosa, asignamos el
    estado y el texto del estado al objeto link. Si hay un error,
     verificamos si existe una respuesta en el objeto de error y,
      de ser así, asignamos el estado y el texto del estado al objeto link
      . Finalmente, devolvemos el objeto link actualizado.
      */
  return axios
    .head(link.href)
    .then((response) => {
      link.status = response.status;
      link.statusText = response.statusText;
      // console.log(href)

      return link;
    })
    .catch((error) => {
      if (error.response) {
        link.status = error.response.status;
        link.statusText = error.response.statusText;
      }
      return link;
    });
}

function mdLinks(directory, options) {
  return new Promise((resolve, reject) => {
    const resolvedPath = path.resolve(directory);
    // console.log(directory)
    console.log(options); // status de validate y stats

    // Verificamos el tipo de archivo o directorio
    fs.stat(resolvedPath, (error, stats) => {
      if (error) {
        reject(error);
        return;
      }
      // console.log(resolvedPath) //ruta absoluta del archivo

      if (stats.isFile()) {
        const link = { href: resolvedPath, text: '', file: resolvedPath };
        resolve(options.validate ? [fetchUrl(link)] : [link]);
      // console.log(link)
      } else if (stats.isDirectory()) {
        fs.readdir(resolvedPath, (error, files) => {
          // console.log(files) // archivos md principal y las carpetas
          if (error) {
            reject(error);
            return;
          }
          // console.log(stats.isFile())

          function processFiles(filePaths, index) {
            if (index >= filePaths.length) {
              resolve(links);
              return;
            }
            // console.log(links) extrae link con href, text,file


            const filePath = filePaths[index];

            fs.stat(filePath, (error, fileStats) => {
              if (error) {
                reject(error);
                return;
              }

              if (fileStats.isFile() && filePath.endsWith('.md')) {
                fs.readFile(filePath, 'utf8', (error, data) => {
                  if (error) {
                    reject(error);
                    return;
                  }
                  // console.log(filePath) 
                  const searchLinks = /\[([^\]]+)\]\(([^)]+)\)/g;
                  let match;

                  while ((match = searchLinks.exec(data)) !== null) {
                    const [, text, href] = match;
                    const link = { href, text, file: filePath };
                    //  console.log(text)
                    if (options.validate) {
                      fetchUrl(link)
                        .then((link) => {
                          links.push(link);
                          processFiles(filePaths, index + 1);
                        })
                        .catch((error) => {
                          console.log('Error:', error);
                          links.push(link);
                          processFiles(filePaths, index + 1);
                        });
                    } else {
                      links.push(link);
                      processFiles(filePaths, index + 1);
                    }
                  }

                  if (!options.validate) {
                    processFiles(filePaths, index + 1);
                  }
                });
              } else if (fileStats.isDirectory()) {
                fs.readdir(filePath, (error, nestedFiles) => {
                  if (error) {
                    reject(error);
                    return;
                  }

                  const nestedFilePaths = nestedFiles.map((file) => path.join(filePath, file));
                  processFiles(nestedFilePaths, 0);
                });
              } else {
                processFiles(filePaths, index + 1);
              }
            });
          }

          const filePaths = files.map((file) => path.join(resolvedPath, file));
          processFiles(filePaths, 0);
        });
      } else {
        reject(new Error('El directorio o archivo especificado no es válido.'));
      }
    });
  });
}

module.exports = mdLinks;
