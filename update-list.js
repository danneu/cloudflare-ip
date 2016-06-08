'use strict';
// Node
const fs = require('fs');
const nodePath = require('path');
// 3rd
const fetch = require('node-fetch');

const urls = {
  ipv4: 'https://www.cloudflare.com/ips-v4',
  ipv6: 'https://www.cloudflare.com/ips-v6'
}

function writeFile (path, text) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, text, (err) => err ? reject(err) : resolve());
  });
}

function fetchIps (url) {
  return fetch(url)
    .then(res => res.text())
    .then(text => text.split('\n').filter(Boolean));
}

Promise.all([fetchIps(urls.ipv4), fetchIps(urls.ipv6)])
  .then((ips) => { 
    const [ipv4, ipv6] = ips;
    if (ipv4.length === 0 || ipv6.length === 0) {
      throw new Error('a list was empty');
    }
    const outPath = nodePath.join(__dirname, 'ips.json');
    const json = JSON.stringify([...ipv4, ...ipv6], null, '  ')
    console.log('writing ips.json', json);
    return writeFile(outPath, json);
  })
  .catch((err) => console.error(err.stack));
