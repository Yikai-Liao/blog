import fs from "node:fs";
import path from "node:path";
import ignore from "ignore";

export const POST_IGNORE_FILE = ".postignore";

function toPosixPath(filePath) {
	return filePath.split(path.sep).join("/");
}

function isMarkdownFile(fileName) {
	return fileName.endsWith(".md") || fileName.endsWith(".mdx");
}

function scopeRule(rule, directory) {
	if (!rule || rule.startsWith("#")) return rule;

	const isNegated = rule.startsWith("!");
	const prefix = isNegated ? "!" : "";
	const pattern = isNegated ? rule.slice(1) : rule;
	const relativeDirectory = directory ? `${directory}/` : "";
	const anchored = pattern.startsWith("/");
	const unanchoredPattern = anchored ? pattern.slice(1) : pattern;
	const hasDirectorySeparator = unanchoredPattern.slice(0, -1).includes("/");

	if (anchored || hasDirectorySeparator) {
		return `${prefix}${relativeDirectory}${unanchoredPattern}`;
	}

	return `${prefix}${relativeDirectory}${directory ? "**/" : ""}${unanchoredPattern}`;
}

function readScopedRules(directory, relativeDirectory) {
	const ignoreFile = path.join(directory, POST_IGNORE_FILE);
	if (!fs.existsSync(ignoreFile)) return [];

	const rules = fs.readFileSync(ignoreFile, "utf8").split(/\r?\n/);
	return rules.map((rule) => scopeRule(rule, relativeDirectory));
}

function isIgnored(rules, relativePath) {
	if (rules.length === 0) return false;
	return ignore().add(rules).ignores(relativePath);
}

/**
 * Finds Markdown and MDX files that are not excluded by `.postignore` files.
 * Each `.postignore` applies to its own directory and descendants, matching
 * `.gitignore` scoping and rule precedence.
 */
export function findPostFiles(rootDirectory) {
	if (!fs.existsSync(rootDirectory)) return [];

	const files = [];
	const visitDirectory = (directory, relativeDirectory, inheritedRules) => {
		const rules = [
			...inheritedRules,
			...readScopedRules(directory, relativeDirectory),
		];

		for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
			if (entry.name === POST_IGNORE_FILE) continue;

			const filePath = path.join(directory, entry.name);
			const relativePath = toPosixPath(
				relativeDirectory
					? path.join(relativeDirectory, entry.name)
					: entry.name,
			);

			if (entry.isDirectory()) {
				if (!isIgnored(rules, `${relativePath}/`)) {
					visitDirectory(filePath, relativePath, rules);
				}
				continue;
			}

			if (entry.isFile() && isMarkdownFile(entry.name) && !isIgnored(rules, relativePath)) {
				files.push(relativePath);
			}
		}
	};

	visitDirectory(rootDirectory, "", []);
	return files.sort();
}

export function isPostSourcePath(filePath, rootDirectory) {
	const relativePath = path.relative(rootDirectory, filePath);
	if (!relativePath || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
		return false;
	}

	const fileName = path.basename(filePath);
	return fileName === POST_IGNORE_FILE || isMarkdownFile(fileName);
}
