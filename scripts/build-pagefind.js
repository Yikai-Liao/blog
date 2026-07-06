import fs from "node:fs";
import path from "node:path";
import { close, createIndex } from "pagefind";

const root = process.cwd();
const dist = path.join(root, "dist");
const publicDist = path.join(root, ".pagefind-public");

function getHtmlFiles(dir) {
	const files = [];
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const entryPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...getHtmlFiles(entryPath));
		} else if (entry.name.endsWith(".html")) {
			files.push(entryPath);
		}
	}
	return files;
}

function getUrl(sourceDir, filePath) {
	const relativePath = path.relative(sourceDir, filePath).split(path.sep).join("/");
	if (relativePath === "index.html") return "/";
	if (relativePath.endsWith("/index.html")) {
		return `/${relativePath.slice(0, -"index.html".length)}`;
	}
	return `/${relativePath.replace(/\.html$/, "/")}`;
}

function assertNoErrors(errors) {
	if (errors?.length) throw new Error(errors.join("\n"));
}

async function buildIndex(sourceDir, outputPath) {
	const { errors, index } = await createIndex();
	assertNoErrors(errors);
	if (!index) throw new Error("Failed to create Pagefind index");

	let pageCount = 0;
	for (const filePath of getHtmlFiles(sourceDir)) {
		const content = fs.readFileSync(filePath, "utf8");
		if (!content.includes("data-pagefind-body")) continue;

		const { errors: fileErrors, file } = await index.addHTMLFile({
			sourcePath: path.relative(root, filePath),
			url: getUrl(sourceDir, filePath),
			content,
		});
		assertNoErrors(fileErrors);
		if (file) pageCount++;
	}

	const { errors: writeErrors } = await index.writeFiles({ outputPath });
	assertNoErrors(writeErrors);
	await index.deleteIndex();
	console.log(`Indexed ${pageCount} pages -> ${path.relative(root, outputPath)}`);
}

fs.rmSync(publicDist, { recursive: true, force: true });
fs.cpSync(dist, publicDist, { recursive: true });
fs.rmSync(path.join(publicDist, "private"), { recursive: true, force: true });

await buildIndex(publicDist, path.join(dist, "pagefind"));
await buildIndex(dist, path.join(dist, "private/pagefind"));
await close();

fs.rmSync(publicDist, { recursive: true, force: true });
