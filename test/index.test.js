'use strict'
// 3rd
const assert = require('chai').assert
// 1st
const cloudflareIp = require('..')

describe('falsey values', () => {
  it('is false', () => {
    assert.isFalse(cloudflareIp())
    assert.isFalse(cloudflareIp(''))
    assert.isFalse(cloudflareIp(0))
  })
})

describe('garbage string values', () => {
  it('is false', () => {
    assert.isFalse(cloudflareIp('chicken'))
    assert.isFalse(cloudflareIp('2400:cb00::0000::0000'))
  })
})

describe('non-cloudflare IPs', () => {
  it('is false', () => {
    assert.isFalse(cloudflareIp('66.249.66.1'))
    assert.isFalse(cloudflareIp('1.1.1.1'))
  })
})

describe('localhost', () => {
  it('is false', () => {
    assert.isFalse(cloudflareIp('127.0.0.1'))
    assert.isFalse(cloudflareIp('::1'))
  })
})

describe('cloudflare IPs', () => {
  it('is true', () => {
    assert.isTrue(cloudflareIp('103.21.244.0'))
    assert.isTrue(cloudflareIp('2400:cb00:0000::0000'))
    assert.isTrue(cloudflareIp('108.162.212.58'))
  })
  it('handles whitespace', () => {
    assert.isTrue(cloudflareIp(' 103.21.244.0 '))
  })
})
