/* eslint-disable import/no-extraneous-dependencies */

const axios = require('axios');

const promises = [];

promises.push(axios.get('https://www.laboratoria.la'));

Promise.all(promises).then((res) => {
  console.log(res);
});
