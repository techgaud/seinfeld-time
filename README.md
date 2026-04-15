# Seinfeld Time

A clock that counts seconds since the first public airing of *The Seinfeld Chronicles* (1989-07-06 01,00,00 UTC, which was 1989-07-05 9,00 PM EDT on NBC).

Live at https://seinfeldtime.com

Two eras.

- **BS** Before Seinfeld
- **ASS** After Seinfeld

## API

Static site with two Cloudflare Pages Functions endpoints, modeled on the TCP handshake. `hello,newman` is the SYN. `hello,jerry` is the ACK.

### `GET /api/hello,newman`

Returns the current moment in Seinfeld time.

```json
{
  "handshake": "hello,newman",
  "pilot_iso": "1989-07-06T01:00:00.000Z",
  "pilot_epoch_seconds": 615690000,
  "gregorian_iso": "2026-04-15T12:00:00.000Z",
  "epoch_seconds": 1776556800,
  "era": "ASS",
  "seinfeld_seconds": 1160866800
}
```

### `GET /api/hello,jerry?iso=...` or `?epoch=...`

Converts a provided moment.

```bash
curl 'https://seinfeldtime.com/api/hello,jerry?iso=2000-01-01T00:00:00Z'
curl 'https://seinfeldtime.com/api/hello,jerry?epoch=946684800'
```

Both query forms produce the same shape as `hello,newman` plus the input echoed in `gregorian_iso` and `epoch_seconds`.

## Stack

- Static HTML, CSS, vanilla JS for the clock
- Cloudflare Pages for hosting
- Cloudflare Pages Functions (TypeScript on the Workers runtime) for the API
- No build step

## Local dev

```bash
npx wrangler pages dev public
```

The Functions in `functions/` are picked up automatically.

## License

AGPL-3.0. See [LICENSE](./LICENSE).
