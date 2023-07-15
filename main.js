/* const fs = require('fs');

function extractMdLinks(directory) {
  fs.readdir(directory, (error, files) => {
    if (error) {
      console.error('Error:', error);
      return;
    }

    const links = [];

    function readFile(index) {
      if (index >= files.length) {
        console.log(links);
        return;
      }

      const file = files[index];
      if (file.endsWith('.md')) {
        fs.readFile(`${directory}/${file}`, 'utf8', (error, data) => {
          if (error) {
            console.error('Error:', error);
            return;
          }

          const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
          const matches = data.matchAll(linkRegex);

          for (const match of matches) {
          const [, text, url] = match;
            links.push({ text, url, file });
          }

          readFile(index + 1);
        });
      } else {
        readFile(index + 1);
      }
    }

    readFile(0);
  });
}

const directory = './filesMarkdown';
extractMdLinks(directory);
*/
