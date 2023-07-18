#!/usr/bin/env node
const mdLinks = require('./index');

const path = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
};

mdLinks(path, options)
  .then((result) => {
    if (options.stats) {
      const totalLinks = result.length;
      const uniqueLinks = new Set(result.map((link) => link.href)).size;
      const brokenLinks = result.filter((link) => link.status >= 400).length;
      console.log('Total:', totalLinks);
      console.log('Unique:', uniqueLinks);
      console.log('Broken:', brokenLinks);
    } else {
      result.forEach((link) => {
        const {
          href, text, file, status, statusText,
        } = link;
        console.log(text);
        console.log(`File: ${file}\nLink: ${href}\nText: ${text}`);
        if (status !== undefined && statusText !== undefined) {
          console.log(`Status: ${status} \n ${statusText}`);
        }
        console.log('------------');
      });
    }
  })
  .catch((error) => {
    console.error('\nError in the path of directory or file: \n', error);
  });
