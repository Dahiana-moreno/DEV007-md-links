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

    const links = [];

    function processFile(filePath) {
      return new Promise((resolve, reject) => {
        fs.stat(filePath, (error, stats) => {
          if (error) {
            reject(error);

            return;
          }

          if (stats.isFile() && filePath.endsWith('.md')) {
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
                      resolve(links);
                    })
                    .catch(() => {
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
            fs.readdir(filePath, (error, files) => {
              if (error) {
                reject(error);
                return;
              }

              const filePromises = files.map((file) => processFile(path.join(filePath, file)));

              Promise.all(filePromises)
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  reject(error);
                });
            });
          } else {
            resolve();
            //   console.log('verifica que el archivo sea de extencion .md');
          }
        });
      });
    }

    function validateLinks() {
      const linkPromises = links.map((link) => fetchUrl(link));

      Promise.all(linkPromises)
        .then(() => {
          resolve(links);
        })
        .catch((error) => {
          reject(error);
        });
    }

    processFile(resolvedPath)
      .then(() => {
        if (options.validate) {
          validateLinks();
        } else {
          resolve(links);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = mdLinks;
