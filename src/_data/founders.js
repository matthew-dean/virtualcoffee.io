const fetch = require('node-fetch');
var glob = require('glob');
var fs = require('fs');
const path = require('path');
const Cache = require('@11ty/eleventy-cache-assets');

module.exports = async function () {
  console.log('Fetching github users');
  const founders = [];
  const files = glob.sync(`${path.resolve(__dirname, 'founders')}/*.json`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      const data = fs.readFileSync(file, 'utf8');

      var obj = JSON.parse(data);

      const response = await Cache(
        `https://api.github.com/users/${obj.username}`,
        {
          duration: '5d', // 1 day
          type: 'json', // also supports "text" or "buffer"
        }
      );

      founders.push(response);
    } catch (e) {
      console.warn(`Unable to read ${file}, skipping and moving on!`);
    }
  }

  return founders;
};
