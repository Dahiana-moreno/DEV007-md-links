/* eslint-disable no-shadow */
/* eslint-disable no-cond-assign */
/* eslint-disable no-param-reassign */
const axios = require('axios');
const fs = require('fs');
const path = require('path');

function fetchUrl(link) {
  return axios
    .head(link.href)
    .then((response) => {
      link.status = response.status;
      link.statusText = response.statusText;
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
    const searchLinks = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    console.log(options);

    fs.stat(resolvedPath, (error, stats) => {
      if (error) {
        reject(error);
        return;
      }

      const links = [];

      if (stats.isFile()) {
        fs.readFile(resolvedPath, 'utf8', (error, data) => {
          if (error) {
            reject(error);
            return;
          }

          while ((match = searchLinks.exec(data)) !== null) { // archivos individuales
            const [, text, href] = match;
            const link = { href, text, file: resolvedPath };

            if (options.validate) {
              fetchUrl(link)
                .then(() => {
                  links.push(link);
                  resolve(links);
                })
                .catch(() => {
                  console.log('Error:', error);
                  links.push(link);
                  resolve(links);
                });
            } else {
              links.push(link);
              resolve(links);
            }
          }

          if (!options.validate) {
            resolve(links);
          }
        });
      } else if (stats.isDirectory()) {
        fs.readdir(resolvedPath, (error, files) => {
          if (error) {
            reject(error);
            return;
          }

          function processFiles(filePaths, index) {
            if (index >= filePaths.length) {
              resolve(links);
              return;
            }

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

                  while ((match = searchLinks.exec(data)) !== null) {
                    const [, text, href] = match;
                    const link = { href, text, file: filePath };

                    if (options.validate) {
                      fetchUrl(link)
                        .then(() => {
                          links.push(link);
                          processFiles(filePaths, index + 1);
                        })
                        .catch(() => {
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
