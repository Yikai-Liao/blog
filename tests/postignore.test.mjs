import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { findPostFiles } from "../src/utils/postignore.mjs";

function writeFile(root, relativePath, contents = "---\ntitle: Test\n---\n") {
	const filePath = path.join(root, relativePath);
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, contents);
}

test(".postignore follows gitignore scoping and does not special-case index.md", (t) => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), "postignore-"));
	t.after(() => fs.rmSync(root, { recursive: true, force: true }));

	writeFile(root, ".postignore", "README.md\nignored/\n*.md\n!published.md\n");
	writeFile(root, "README.md");
	writeFile(root, "published.md");
	writeFile(root, "article.mdx");
	writeFile(root, "ignored/post.md");
	writeFile(root, "notes/.postignore", "*.md\n!index.md\n");
	writeFile(root, "notes/index.md");
	writeFile(root, "notes/working.md");

	assert.deepEqual(findPostFiles(root), [
		"article.mdx",
		"notes/index.md",
		"published.md",
	]);
});
