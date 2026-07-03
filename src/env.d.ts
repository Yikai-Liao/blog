/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module "twikoo/dist/twikoo.min.js" {
	type TwikooInit = (options: {
		envId: string;
		el: string;
		path: string;
		title: string;
		lang?: string;
	}) => Promise<void> | void;

	const twikoo:
		| TwikooInit
		| {
				init: TwikooInit;
		  };

	export default twikoo;
}
