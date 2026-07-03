import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const databaseId = process.env.TWIKOO_D1_DATABASE_ID?.trim();

if (!databaseId) {
	console.error(
		"TWIKOO_D1_DATABASE_ID is required. Run `pnpm d1:create`, then export the returned database_id.",
	);
	process.exit(1);
}

const template = readFileSync(
	path.join(root, "wrangler.template.jsonc"),
	"utf8",
);
writeFileSync(
	path.join(root, "wrangler.generated.jsonc"),
	template.replace("__TWIKOO_D1_DATABASE_ID__", databaseId),
	"utf8",
);
