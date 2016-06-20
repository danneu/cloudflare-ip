'use strict';
// Node
const fs = require('fs');
const nodePath = require('path');
// 3rd
const nodeIp = require('ipaddr.js');

const listPathv4 = nodePath.join(__dirname, 'ipsv4.json');
const listPathv6 = nodePath.join(__dirname, 'ipsv6.json');
const cloudflareIpsv4 = JSON.parse(fs.readFileSync(listPathv4, 'utf8'));
const cloudflareIpsv6 = JSON.parse(fs.readFileSync(listPathv6, 'utf8'))

module.exports = function (testIp) {
  if (!testIp) return false;
  if (typeof testIp === 'string' && testIp.trim().length === 0) return false;
 // if (nodeIp.isPrivate(testIp)) return false;
  if (!nodeIp.IPv4.isValid(testIp) && !nodeIp.IPv6.isValid(testIp)) return false;
testIp = nodeIp.process(testIp);
if(testIp.kind() === 'ipv4'){
  return cloudflareIpsv4.some((cfIp) => {
      return testIp.match(nodeIp.parseCIDR(cfIp));
  });
}else if (testIp.kind() === 'ipv6'){
 return cloudflareIpsv6.some((cfIp) => {
      return testIp.match(nodeIp.parseCIDR(cfIp));
  });
}
};
