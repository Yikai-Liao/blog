import fs from "node:fs";
import path from "node:path";

const contentDir = "src/content";
const outputFile = ".cache/github-card-data.json";
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

function walk(dir) {
	if (!fs.existsSync(dir)) {
		return [];
	}

	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const file = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(file) : [file];
	});
}

function findRepos() {
	const repos = new Set();
	const repoPattern = /::+github\{[^}]*repo=(["'])([^"']+)\1[^}]*\}/g;

	for (const file of walk(contentDir)) {
		if (!/\.(md|mdx)$/.test(file)) {
			continue;
		}

		const content = fs.readFileSync(file, "utf8");
		for (const match of content.matchAll(repoPattern)) {
			if (/^[^/<>\s]+\/[^/<>\s]+$/.test(match[2])) {
				repos.add(match[2]);
			}
		}
	}

	return [...repos].sort();
}

function readPreviousData() {
	if (!fs.existsSync(outputFile)) {
		return {};
	}

	try {
		return JSON.parse(fs.readFileSync(outputFile, "utf8"));
	} catch {
		return {};
	}
}

async function fetchRepo(repo) {
	const [owner, name] = repo.split("/");
	const headers = {
		Accept: "application/vnd.github+json",
		"User-Agent": "fuwari-github-card-build",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
		headers["X-GitHub-Api-Version"] = "2022-11-28";
	}

	const response = await fetch(
		`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
		{ headers },
	);
	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new Error(data.message || `GitHub API error: ${response.status}`);
	}

	return {
		description: data.description || "Description not set",
		language: data.language || "",
		forks: data.forks_count ?? data.forks ?? 0,
		stars: data.stargazers_count ?? 0,
		license: data.license?.spdx_id || "no-license",
		avatarUrl: data.owner?.avatar_url || "",
	};
}

const previousData = readPreviousData();
const nextData = {};
const missingRepos = [];

for (const repo of findRepos()) {
	try {
		nextData[repo] = await fetchRepo(repo);
		console.log(`Fetched GitHub card data for ${repo}`);
	} catch (error) {
		if (previousData[repo]) {
			nextData[repo] = previousData[repo];
			console.warn(
				`Using cached GitHub card data for ${repo}: ${error.message}`,
			);
		} else {
			missingRepos.push(repo);
			console.warn(`Skipping GitHub card data for ${repo}: ${error.message}`);
		}
	}
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(`${outputFile}`, `${JSON.stringify(nextData, null, 2)}\n`);

// Astro does not track this generated JSON as a content dependency.
fs.rmSync("node_modules/.astro", { recursive: true, force: true });

if (token && missingRepos.length > 0) {
	console.error(`Missing GitHub card data for: ${missingRepos.join(", ")}`);
	process.exit(1);
}
