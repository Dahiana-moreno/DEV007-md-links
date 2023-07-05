const fs = require('fs'); // Handling (manipulacion) system of files
const fetch = require('node-fetch');  // Requests HTTP

function mdLinks(directory, options) { // The function receives the directory and options
  return new Promise((resolve, reject) => {  // retorna la nueva promesa
    fs.readdir(directory, (error, files) => { //
      if (error) { 
        reject(error); // operation failed we reject la promise.  The result is an error object
        return; //
      }

      const links = []; // store all links
      const validLinks = [];
      const invalidLinks = []; 
     
      
      function readFile(index) {
        if (index >= files.length) {
          resolve(links);
          return;
        }

        const file = files[index];
        if (file.endsWith('.md')) {
          fs.readFile(`${directory}/${file}`, 'utf8', (error, data) => {
            if (error) {
              reject(error);
              return;
            }

            const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
            const matches = data.matchAll(linkRegex);

            for (const match of matches) {
              const [, text, url] = match;
              const link = { text, url, file };

              if (options.validate) { // 
                fetch(url, { method: 'HEAD' })
                .then((response) => {
                  if (response.ok) {
                    link.valid = true;
                    validLinks.push(link);
                  } else {
                    link.valid = false;
                    invalidLinks.push(link);
                  }
                  links.push(link);
                  readFile(index + 1);
                })
                .catch((error) => {
                  console.error('Error:', error);
                  link.valid = false;
                  invalidLinks.push(link);
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
        } else {
          readFile(index + 1);
        }
      }

      readFile(0);
    });
  });
}

module.exports = {mdLinks};
