declare module "@utils/postignore.mjs" {
	export const POST_IGNORE_FILE: ".postignore";

	/** Returns root-relative POSIX paths for Markdown and MDX files included as posts. */
	export function findPostFiles(rootDirectory: string): string[];

	/** Returns whether a watched path can affect the set of loaded posts. */
	export function isPostSourcePath(
		filePath: string,
		rootDirectory: string,
	): boolean;
}
