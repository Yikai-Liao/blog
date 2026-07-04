import twikooWorker from "twikoo-cloudflare/src/index.js";
import { parseComment } from "twikoo-func/utils";
import { getMd5 } from "twikoo-func/utils/lib";

const md5 = getMd5();
const MAX_TIMESTAMP_MILLIS = 41025312000000;
const MAX_QUERY_LIMIT = 500;
const PUBLIC_COMMENT_CACHE_TTL_SECONDS = 60 * 60 * 24;
const PUBLIC_COMMENT_CACHE_SORTS = ["latest", "oldest", "popular"];

function json(data, request, status = 200) {
	const headers = {
		"content-type": "application/json;charset=UTF-8",
	};
	const origin = request.headers.get("origin");
	if (origin) {
		headers["Access-Control-Allow-Credentials"] = "true";
		headers["Access-Control-Allow-Origin"] = origin;
		headers["Access-Control-Allow-Methods"] = "POST";
		headers["Access-Control-Allow-Headers"] =
			"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version";
		headers["Access-Control-Max-Age"] = "600";
	}
	return new Response(JSON.stringify(data), { status, headers });
}

function uuid() {
	return crypto.randomUUID().replaceAll("-", "");
}

function getUrlVariants(url) {
	return [...new Set([url, url.endsWith("/") ? url.slice(0, -1) : `${url}/`])];
}

async function readConfig(DB) {
	const row = await DB.prepare("SELECT value FROM config LIMIT 1").first();
	if (!row?.value) return {};

	try {
		return JSON.parse(row.value);
	} catch {
		return {};
	}
}

function parseLike(comment) {
	return {
		...comment,
		like: JSON.parse(comment.like || "[]"),
	};
}

function formatIpRegion(region) {
	if (!region) return "";

	const [country, , province] = region.split("|");
	const parts = [];
	if (country?.trim() && country !== "0") parts.push(country.trim());
	if (province?.trim() && province !== "0") {
		parts.push(province.trim().replace(/(省|市)$/, ""));
	}
	return parts.join(" ");
}

function sortClause(sort) {
	if (sort === "oldest") return "created ASC";
	if (sort === "popular") return "json_array_length(like) DESC, created DESC";
	return "created DESC";
}

function getPublicCommentCacheKey(event) {
	const cacheUrl = new URL("https://twikoo-comment-cache.local/comment-get");
	cacheUrl.searchParams.set("url", event.url);
	cacheUrl.searchParams.set("sort", event.sort || "latest");
	return new Request(cacheUrl.toString(), { method: "GET" });
}

function isPublicCommentGet(event) {
	return !event.accessToken && !event.before;
}

async function readPublicCommentCache(event) {
	if (!isPublicCommentGet(event) || typeof caches === "undefined")
		return undefined;

	const cached = await caches.default.match(getPublicCommentCacheKey(event));
	if (!cached) return undefined;

	try {
		return await cached.json();
	} catch {
		return undefined;
	}
}

async function writePublicCommentCache(event, data, ctx) {
	if (!ctx || !isPublicCommentGet(event) || typeof caches === "undefined")
		return;

	const response = new Response(JSON.stringify(data), {
		headers: {
			"cache-control": `public, max-age=${PUBLIC_COMMENT_CACHE_TTL_SECONDS}`,
			"content-type": "application/json;charset=UTF-8",
		},
	});
	ctx.waitUntil(caches.default.put(getPublicCommentCacheKey(event), response));
}

function publicCommentCacheEvents(url) {
	return getUrlVariants(url).flatMap((urlVariant) =>
		PUBLIC_COMMENT_CACHE_SORTS.map((sort) => ({ url: urlVariant, sort })),
	);
}

async function deletePublicCommentCache(url) {
	if (!url || typeof caches === "undefined") return;

	await Promise.all(
		publicCommentCacheEvents(url).map((event) =>
			caches.default.delete(getPublicCommentCacheKey(event)),
		),
	);
}

async function refreshPublicCommentCache(url, request, env, ctx) {
	if (!url || typeof caches === "undefined") return;

	await Promise.all(
		publicCommentCacheEvents(url).map((event) =>
			commentGet({ event: "COMMENT_GET", ...event }, request, env, ctx),
		),
	);
}

function isSuccessfulTwikooResponse(response, data) {
	return response.ok && !data?.code;
}

async function readResponseJson(response) {
	try {
		return await response.clone().json();
	} catch {
		return undefined;
	}
}

async function getCommentUrlById(DB, id) {
	if (!id) return undefined;
	return queryFirst(DB, "SELECT url FROM comment WHERE _id = ?", "url", [id]);
}

async function resolveMutatedCommentUrl(event, env) {
	if (event.url) return event.url;
	return getCommentUrlById(env.DB, event.id);
}

async function handleCommentMutation(event, request, env, ctx) {
	const mutatedUrl = await resolveMutatedCommentUrl(event, env);
	const response = await twikooWorker.fetch(request, env, ctx);
	const data = await readResponseJson(response);

	if (isSuccessfulTwikooResponse(response, data) && mutatedUrl) {
		ctx.waitUntil(
			(async () => {
				await deletePublicCommentCache(mutatedUrl);
				await refreshPublicCommentCache(mutatedUrl, request, env, ctx);
			})(),
		);
	}

	return response;
}

async function queryAll(DB, sql, params = []) {
	return (
		(
			await DB.prepare(sql)
				.bind(...params)
				.all()
		).results ?? []
	);
}

async function queryFirst(DB, sql, field, params = []) {
	const row = await DB.prepare(sql)
		.bind(...params)
		.first();
	return field ? row?.[field] : row;
}

async function getCommentReplies(DB, event, spamMarker, uid, main) {
	if (!main.length) return [];

	const placeholders = main.map(() => "?").join(", ");
	return queryAll(
		DB,
		`
SELECT * FROM comment
WHERE
  url IN (${getUrlVariants(event.url)
		.map(() => "?")
		.join(", ")}) AND
  (isSpam != ? OR uid = ?) AND
  rid IN (${placeholders})
`.trim(),
		[
			...getUrlVariants(event.url),
			spamMarker,
			uid,
			...main.map((item) => item._id),
		],
	);
}

function applyStoredIpRegion(parsedComments, rawComments, config) {
	const showRegion = !!config.SHOW_REGION && config.SHOW_REGION !== "false";
	if (!showRegion) return parsedComments;

	for (const comment of parsedComments) {
		const raw = rawComments.find((item) => item._id === comment.id);
		if (raw?.ipRegion) comment.ipRegion = formatIpRegion(raw.ipRegion);

		for (const reply of comment.replies || []) {
			const rawReply = rawComments.find((item) => item._id === reply.id);
			if (rawReply?.ipRegion)
				reply.ipRegion = formatIpRegion(rawReply.ipRegion);
		}
	}

	return parsedComments;
}

async function commentGet(event, request, env, ctx) {
	if (!event.url) {
		return json(
			{ data: [], message: "Missing required parameter: url" },
			request,
		);
	}

	const cached = await readPublicCommentCache(event);
	const uid = event.accessToken || uuid();
	if (cached) return json({ ...cached, accessToken: uid }, request);

	const config = await readConfig(env.DB);
	const isAdmin = !!config.ADMIN_PASS && config.ADMIN_PASS === md5(uid);
	const spamMarker = isAdmin ? 2 : 1;
	const limit = Number.parseInt(config.COMMENT_PAGE_SIZE, 10) || 8;
	const before = event.before ?? MAX_TIMESTAMP_MILLIS;
	const urls = getUrlVariants(event.url);
	const urlPlaceholders = urls.map(() => "?").join(", ");
	const visibilityParams = [spamMarker, uid];
	let more = false;

	const count = await queryFirst(
		env.DB,
		`
SELECT COUNT(*) AS count FROM comment
WHERE
  url IN (${urlPlaceholders}) AND
  rid = "" AND
  (isSpam != ? OR uid = ?)
`.trim(),
		"count",
		[...urls, ...visibilityParams],
	);

	let main = await queryAll(
		env.DB,
		`
SELECT * FROM comment
WHERE
  url IN (${urlPlaceholders}) AND
  (isSpam != ? OR uid = ?) AND
  created < ? AND
  top = 0 AND
  rid = ""
ORDER BY ${sortClause(event.sort)}
LIMIT ?
`.trim(),
		[...urls, ...visibilityParams, before, limit + 1],
	);

	if (main.length > limit) {
		more = true;
		main.splice(limit, 1);
	}

	if (!config.TOP_DISABLED && !event.before) {
		const top = await queryAll(
			env.DB,
			`
SELECT * FROM comment
WHERE
  url IN (${urlPlaceholders}) AND
  (isSpam != ? OR uid = ?) AND
  top = 1 AND
  rid = ""
ORDER BY updated DESC
LIMIT ?
`.trim(),
			[...urls, ...visibilityParams, MAX_QUERY_LIMIT],
		);
		main = [...top, ...main];
	}

	const reply = await getCommentReplies(env.DB, event, spamMarker, uid, main);
	const rawComments = [...main, ...reply];
	const data = applyStoredIpRegion(
		parseComment(rawComments.map(parseLike), uid, config),
		rawComments,
		config,
	);
	const response = { data, more, count };
	await writePublicCommentCache(event, response, ctx);
	if (!event.accessToken) response.accessToken = uid;

	return json(response, request);
}

export default {
	async fetch(request, env, ctx) {
		if (request.method !== "OPTIONS") {
			let event = {};
			try {
				event = await request.clone().json();
			} catch {}

			if (event?.event === "UPLOAD_IMAGE") {
				return json(
					{
						code: 1,
						message: "Image uploading is disabled for this site.",
					},
					request,
					403,
				);
			}

			if (event?.event === "COMMENT_GET") {
				return commentGet(event, request, env, ctx);
			}

			if (
				[
					"COMMENT_SUBMIT",
					"COMMENT_LIKE",
					"COMMENT_SET_FOR_ADMIN",
					"COMMENT_DELETE_FOR_ADMIN",
				].includes(event?.event)
			) {
				return handleCommentMutation(event, request, env, ctx);
			}
		}

		return twikooWorker.fetch(request, env, ctx);
	},
};
