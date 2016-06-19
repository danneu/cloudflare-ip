'use strict';
// Node
const fs = require('fs');
const nodePath = require('path');
// 3rd
const nodeIp = require('ipaddr.js');

const listPath = nodePath.join(__dirname, 'ips.json');
const cloudflareIps = JSON.parse(fs.readFileSync(listPath, 'utf8'));

module.exports = function (testIp) {
  if (!testIp) return false;
  if (typeof testIp === 'string' && testIp.trim().length === 0) return false;
 // if (nodeIp.isPrivate(testIp)) return false;
  if (!nodeIp.IPv4.isValid(testIp) && !nodeIp.IPv6.isValid(testIp)) return false;
testIp = nodeIp.process(testIp);
  return cloudflareIps.some((cfIp) => {
      return testIp.match(nodeIp.parseCIDR(cfIp));
  });
};
