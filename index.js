'use strict';
// Node
const fs = require('fs');
const nodePath = require('path');
// 3rd
const nodeIp = require('ip');

const listPath = nodePath.join(__dirname, 'ips.json');
const cloudflareIps = JSON.parse(fs.readFileSync(listPath, 'utf8'));

module.exports = function (testIp) {
  if (!testIp) return false;
  if (typeof testIp === 'string' && testIp.trim().length === 0) return false;
  if (nodeIp.isPrivate(testIp)) return false;
  if (!nodeIp.isV4Format(testIp) && !nodeIp.isV6Format(testIp)) return false;
  return cloudflareIps.some((cfIp) => {
    return nodeIp.cidrSubnet(cfIp).contains(testIp);
  });
};
