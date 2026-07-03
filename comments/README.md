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

## GitHub Actions / Cloudflare permissions

The existing `CLOUDFLARE_API_TOKEN` must be able to deploy Workers and read the
account. For first-time setup and schema migration, the token or local Wrangler
login also needs D1 edit access.

Minimum practical token permissions:

- Account: Cloudflare Workers Scripts Edit
- Account: D1 Edit
- Account: Account Settings Read

No R2 permission is needed for this setup.
