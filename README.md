
# cloudflare-ip

Check if an IP address is in Cloudflare's IP address range.

Cloudflare's IP addresses are [pubicly available](https://www.cloudflare.com/ips/).

## Install

    npm install --save cloudflare-ip

## Usage

``` javascript
const cloudflareIp = require('cloudflare-ip');

// non-cloudflare ips should be false
cloudflareIp('66.249.66.1')                // false
cloudflareIp('1.1.1.1')                    // false
// localhost should be false
cloudflareIp('127.0.0.1'))                 // false
cloudflareIp('::1'))                       // false
// garbage should be false
cloudflareIp()                             // false
cloudflareIp('')                           // false
cloudflareIp(0)                            // false
cloudflareIp('chicken')                    // false
// cloudflare ips should pass
cloudflareIp('103.21.244.0'))              // true
cloudflareIp('2400:cb00::0000::0000'))     // true
```

## Syncing with Cloudflare

Scrape Cloudflare's list and update the `ips.json` file:

    npm run update-list

If this produces a change, then this library needs to be updated.

## Development

    npm test

## License

MIT
