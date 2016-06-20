
# cloudflare-ip [![NPM version](https://badge.fury.io/js/cloudflare-ip.svg)](http://badge.fury.io/js/cloudflare-ip) [![Build Status](https://travis-ci.org/danneu/cloudflare-ip.svg?branch=master)](https://travis-ci.org/danneu/cloudflare-ip) [![Dependency Status](https://david-dm.org/danneu/cloudflare-ip.svg)](https://david-dm.org/danneu/cloudflare-ip)

Check if an IP address is in Cloudflare's IP address range.

Cloudflare's IP addresses are [pubicly available](https://www.cloudflare.com/ips/).

----

**Why:** If your app is behind a reverse proxy like Cloudflare, then
you generally don't want to handle requests that bypass it. At the very
least, you'll want to ensure that the user cannot spoof their IP address
by setting headers that you thought you could depend on like X-Forwarded-For.

Chuck this library into some upstream middleware to short-circuit on
requests that aren't coming from Cloudflare.

Scroll down to the [Enforcing X-Forwarded-For](#enforcing-x-forwarded-for) 
section for some further thoughts.

## Install

    npm install --save cloudflare-ip

## Usage

``` javascript
const cloudflareIp = require('cloudflare-ip');

// non-cloudflare ips should be false
cloudflareIp('66.249.66.1')                // false
cloudflareIp('1.1.1.1')                    // false
// localhost should be false
cloudflareIp('127.0.0.1')                 // false
cloudflareIp('::1')                       // false
// garbage should be false
cloudflareIp()                             // false
cloudflareIp('')                           // false
cloudflareIp(0)                            // false
cloudflareIp('chicken')                    // false
// cloudflare ips should pass
cloudflareIp('103.21.244.0')              // true
cloudflareIp('2400:cb00::0000::0000')     // false
```

## Syncing with Cloudflare

Scrape Cloudflare's list and update the `ips.json` file:

    npm run update-list

If this produces a change, then this library needs to be updated.

## Enforcing X-Forwarded-For

The X-Forwarded-For request header is an array of IP addresses ordered from
upstream to downstream. When a proxy forwards a request, it typically appends
the connecting IP address to this list before sending it on.

You only trust a given index of X-Forwarded-For when it's a length that you
expect. For example, if you're using Nginx and you configure it to never
relay the upstream header, then you'll know an honest request would always
have an X-Forwarded-For of length one.

If your reverse proxy relays and appends to this header,
then the user can spoof their own X-Forwarded-For header if you're
not careful.

Here are some examples to think about when validating requests.

### Example 1: App <- Heroku <- Cloudflare

If your app is running on Heroku behind Cloudflare, then 
an honest request will look like:

    ip: herokuLoadBalancer
    x-forwarded-for: [realUser, cloudflare]

If you assert that the 2nd value of X-Forwarded-For is a Cloudflare IP
address in the naive attempt to ensure that requests are coming through
Cloudflare, then a dishonest user can connect directly to your Heroku
server with a spoofed X-Forwarded-For `[spoofUser, spoofCloudflare]`
and your app will see this:

    ip: herokuLoadBalancer
    x-forwarded-for: [spoofUser, spoofCloudflare, realUser]

So by checking the 2nd value of X-Forwarded-For, you would be
validating a spoofable IP address.

The simplest solution in this example would be to validate the 2nd 
X-Forwarded-For IP address but also ensure that X-Forwarded-For has 
exactly two IP addresses.

### Example 2: App <- Cloudflare

If your app is running on port 80 and is only behind Cloudflare, then 
an honest request will look like:

    ip: cloudflare
    x-forwarded-for: [realUser]

You could validate that the connecting IP address is Cloudflare's and
that X-Forwarded-For has a length of one before trusting the
first value of X-Forwarded-For to be the user's IP address.

## Development

    npm test

## License

MIT
