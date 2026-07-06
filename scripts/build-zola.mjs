import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";

function run(command, args, options = {}) {
	const result = spawnSync(command, args, { stdio: "inherit", ...options });
	if (result.status !== 0) process.exit(result.status || 1);
}

const site = (process.env.PUBLIC_SITE_URL || "http://127.0.0.1:1111").replace(
	/\/+$/,
	"",
);
const base = process.env.PUBLIC_BASE_PATH || "/";
const normalizedBase = base === "/" ? "" : `/${base.replace(/^\/+|\/+$/g, "")}`;
const baseUrl = `${site}${normalizedBase}`;

run("node", ["scripts/preprocess-zola-content.mjs"]);
run("node", ["scripts/generate-icon-macros.mjs"]);
run("zola", [
	"build",
	"--base-url",
	baseUrl,
	"--output-dir",
	"dist",
	"--force",
]);
await fs.cp("public", "dist", { recursive: true, force: true });
run("pnpm", ["exec", "pagefind", "--site", "dist"]);
