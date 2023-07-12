/* eslint-disable no-shadow */
// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

function mdLinks(directory, options) {
  return new Promise((resolve, reject) => {
    const resolvedDirectory = path.resolve(directory);
    fs.readdir(resolvedDirectory, (error, files) => {
      if (error) {
        reject(error);
        return;
      }

      const links = [];

      function readFile(index) {
        if (index >= files.length) {
          resolve(links);
          return;
        }

        const file = files[index];
        const filePath = path.join(resolvedDirectory, file);

        fs.stat(filePath, (error, stats) => {
          if (error) {
            reject(error);
            return;
          }

          if (stats.isFile() && file.endsWith('.md')) {
            fs.readFile(filePath, 'utf8', (error, data) => {
              if (error) {
                reject(error);
                return;
              }

              const searchLinks = /\[([^\]]+)\]\(([^)]+)\)/g;
              let match;
              // eslint-disable-next-line no-cond-assign
              while ((match = searchLinks.exec(data)) !== null) {
                const [, text, href] = match;
                const link = { href, text, file: filePath };

                if (options.validate) {
                  fetch(href, { method: 'HEAD' })
                    .then((response) => {
                      link.status = response.status;
                      link.statusText = response.statusText;
                      links.push(link);
                      readFile(index + 1);
                    })
                    .catch((error) => {
                      console.log('Error:', error);
                      links.push(link);
                      readFile(index + 1);
                    });
                } else {
                  links.push(link);
                  readFile(index + 1);
                }
              }

              if (!options.validate) {
                readFile(index + 1);
              }
            });
          } else if (stats && stats.isDirectory()) {
            mdLinks(filePath, options)
              .then((subLinks) => {
                links.push(...subLinks);
                readFile(index + 1);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            readFile(index + 1);
          }
        });
      }

      readFile(0);
    });
  });
}

module.exports = mdLinks;
