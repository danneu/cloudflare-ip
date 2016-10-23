'use strict'
// Node
const fs = require('fs')
const nodePath = require('path')
// 3rd
const {Address4, Address6} = require('ip-address')

const listPath = nodePath.join(__dirname, 'ips.json')
const cloudflareIps = JSON.parse(fs.readFileSync(listPath, 'utf8'))
  .map(intoAddress)

// returns undefined | Address4 | Address6
function intoAddress (str) {
  if (typeof str === 'string') str = str.trim()
  let ip = new Address6(str)
  if (ip.v4 && !ip.valid) {
    ip = new Address4(str)
  }
  if (!ip.valid) return
  return ip
}

// returns bool
module.exports = function (testIpString) {
  if (!testIpString) return false
  const testIp = intoAddress(testIpString)
  if (!testIp) return false
  return cloudflareIps.some((cf) => testIp.isInSubnet(cf))
}
