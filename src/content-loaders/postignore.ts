import { fileURLToPath } from "node:url";
import { basename, resolve } from "node:path";
import { glob, type Loader } from "astro/loaders";
import {
	findPostFiles,
	isPostSourcePath,
	POST_IGNORE_FILE,
} from "@utils/postignore.mjs";

type PostignoreLoaderOptions = {
	base: string;
};

/**
 * Wraps Astro's glob loader so that `.postignore` files decide which Markdown
 * and MDX files are eligible for the posts collection.
 */
export function postignoreGlob({ base }: PostignoreLoaderOptions): Loader {
	const patterns: string[] = [];
	const delegate = glob({ base, pattern: patterns });
	let watcherRegistered = false;
	let refreshPromise: Promise<void> | undefined;

	return {
		name: "postignore-loader",
		async load(context) {
			const baseDirectory = resolve(fileURLToPath(context.config.root), base);
			const updatePatterns = () => {
				patterns.splice(0, patterns.length, ...findPostFiles(baseDirectory));
			};
			const sync = async (loaderContext: Parameters<Loader["load"]>[0]) => {
				updatePatterns();
				if (patterns.length === 0) {
					loaderContext.store.clear();
					return;
				}
				await delegate.load(loaderContext);
			};

			await sync(context);

			if (!context.watcher || watcherRegistered) return;
			watcherRegistered = true;

			const scheduleRefresh = () => {
				if (refreshPromise) return;
				refreshPromise = (async () => {
					try {
						await sync({ ...context, watcher: undefined });
						context.logger.info("Reloaded posts after .postignore source changes.");
					} catch (error) {
						context.logger.error(
							`Failed to reload posts after .postignore source changes: ${
								error instanceof Error ? error.message : String(error)
							}`,
						);
					} finally {
						refreshPromise = undefined;
					}
				})();
			};

			context.watcher.on("change", (filePath) => {
				if (
					basename(filePath) === POST_IGNORE_FILE &&
					isPostSourcePath(filePath, baseDirectory)
				) {
					scheduleRefresh();
				}
			});
			for (const event of ["add", "unlink"] as const) {
				context.watcher.on(event, (filePath) => {
					if (isPostSourcePath(filePath, baseDirectory)) scheduleRefresh();
				});
			}
		},
	};
}
