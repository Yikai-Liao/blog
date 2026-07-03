import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const optionalNodeEntrypoints = [
	"jsdom/lib/api.js",
	"tencentcloud-sdk-nodejs/tencentcloud/index.js",
	"nodemailer/lib/nodemailer.js",
];

function resolveEntrypoint(entrypoint) {
	try {
		return require.resolve(entrypoint);
	} catch {}

	const pnpmStore = path.join(root, "node_modules", ".pnpm");
	if (!existsSync(pnpmStore)) return null;

	for (const packageDir of readdirSync(pnpmStore)) {
		const candidate = path.join(
			pnpmStore,
			packageDir,
			"node_modules",
			entrypoint,
		);
		if (existsSync(candidate)) return candidate;
	}

	return null;
}

for (const entrypoint of optionalNodeEntrypoints) {
	const resolved = resolveEntrypoint(entrypoint);
	if (resolved) {
		writeFileSync(resolved, "", "utf8");
		console.log(`Prepared Cloudflare bundle stub: ${entrypoint}`);
	} else {
		console.warn(`Skipped missing optional dependency: ${entrypoint}`);
	}
}
