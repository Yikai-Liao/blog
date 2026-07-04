# Twikoo Worker

This directory deploys the Twikoo backend as a Cloudflare Worker with D1 storage.
R2 is intentionally not configured. The wrapper in `src/index.js` also rejects
`UPLOAD_IMAGE` requests so image uploads stay disabled even if a client bypasses
the blog UI.

## Local setup

```sh
cd comments
pnpm install
pnpm d1:create
export TWIKOO_D1_DATABASE_ID="<database_id from wrangler d1 create>"
pnpm d1:schema:local
pnpm dev
```

Set the blog frontend to the local Worker when testing:

```sh
PUBLIC_TWIKOO_ENV_ID=http://localhost:8787 pnpm dev
```

## Deploy

```sh
cd comments
export TWIKOO_D1_DATABASE_ID="<database_id>"
pnpm d1:schema:remote
pnpm deploy
```

Use the deployed Worker URL as `PUBLIC_TWIKOO_ENV_ID` for the blog build.

## Admin password

Do not configure the Twikoo admin password as a GitHub Actions secret. In this
Cloudflare Worker deployment, Twikoo stores `ADMIN_PASS` in the D1 `config`
table after the first Management Panel registration.

After the remote Worker is deployed and the remote D1 schema is initialized:

1. Open any deployed post page.
2. Open the Twikoo management panel from the comment widget.
3. Register the admin password once.

Local Wrangler D1 and remote Cloudflare D1 are separate stores. A password
registered while running `pnpm dev` only applies to the local development
database.

## Public comment caching

`src/index.js` caches public first-page `COMMENT_GET` results with the
Cloudflare Workers Cache API. This is intentionally implemented in the Worker
instead of as a Cloudflare Cache Rule because Twikoo sends comment reads as
`POST` requests to the Worker. A normal CDN/cache-rule setup is a better fit for
cacheable `GET` URLs, while this wrapper needs to cache a safe read operation
that arrives as a Twikoo `POST` event.

In this context, "public" or "anonymous" means a comment read request that does
not include a Twikoo `accessToken`; it does not mean commenters can submit
without a nickname or email. Submit requests still go through Twikoo validation.
The cache stores only the shared comment list payload and generates a fresh
`accessToken` per uncached visitor response, so visitor tokens are not shared
through the cache.

The Workers Cache API is per Cloudflare data center. A cache hit in one region
does not guarantee the same object is already warm in every other region. This
is acceptable for this low-traffic blog because the first request in a region can
still fall back to D1, and subsequent local requests benefit from the cache. If
we need one globally shared cache later, consider adding Workers KV as a global
read-through cache; that would require an additional KV namespace binding and
corresponding Cloudflare token permissions.

## GitHub Actions / Cloudflare permissions

The existing `CLOUDFLARE_API_TOKEN` must be able to deploy Workers and read the
account. For first-time setup and schema migration, the token or local Wrangler
login also needs D1 edit access.

Minimum practical token permissions:

- Account: Cloudflare Workers Scripts Edit
- Account: D1 Edit
- Account: Account Settings Read

No R2 permission is needed for this setup.
