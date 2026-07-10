<script lang="ts">
	import { onMount } from "svelte";
	import ForceGraph from "force-graph";

	export type GraphNode = {
		slug: string;
		title: string;
		category: string | null;
		tags: string[];
		private: boolean;
		url: string;
		x?: number;
		y?: number;
	};

	export type GraphData = {
		nodes: GraphNode[];
		edges: { from: string; to: string }[];
	};

	type GraphLink = { source: string; target: string };

	export let graph: GraphData;
	export let privateContext = false;

	let container: HTMLDivElement;
	let tags: string[] = [];
	let categories: string[] = [];
	let uncategorized = false;
	let graphRenderer: ReturnType<typeof ForceGraph<GraphNode, GraphLink>> | undefined;

	$: filteredNodes = graph.nodes.filter((node) => {
		if (tags.length > 0 && !node.tags.some((tag) => tags.includes(tag))) return false;
		if (categories.length > 0 && (!node.category || !categories.includes(node.category))) return false;
		return !uncategorized || !node.category;
	});
	$: visibleSlugs = new Set(filteredNodes.map((node) => node.slug));
	$: filteredEdges = graph.edges.filter((edge) =>
		visibleSlugs.has(edge.from) && visibleSlugs.has(edge.to),
	);

	function graphData() {
		const radius = Math.max(100, Math.sqrt(filteredNodes.length) * 72);
		return {
			nodes: filteredNodes.map((node, index) => {
				const angle = (Math.PI * 2 * index) / Math.max(filteredNodes.length, 1);
				return { ...node, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
			}),
			links: filteredEdges.map((edge) => ({ source: edge.from, target: edge.to })),
		};
	}

	function applyFilters() {
		const params = new URLSearchParams(window.location.search);
		tags = params.getAll("tag");
		categories = params.getAll("category");
		uncategorized = params.has("uncategorized");
		requestAnimationFrame(() => graphRenderer?.graphData(graphData()).d3ReheatSimulation());
	}

	function themeColor(name: string, fallback: string) {
		return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
	}

	onMount(() => {
		const primary = themeColor("--primary", "#8969c4");
		const card = themeColor("--card-bg", "#29292e");
		const line = themeColor("--line-color", "rgba(255,255,255,.16)");
		const text = document.documentElement.classList.contains("dark")
			? "rgba(255, 255, 255, 0.72)"
			: themeColor("--deep-text", "#2f2f35");
		let hovered: GraphNode | null = null;
		let lastWidth = 0;
		let lastHeight = 0;
		const nodeSlug = (node: string | GraphNode) => typeof node === "string" ? node : node.slug;
		const linkedToHovered = (node: GraphNode) =>
			hovered !== null && filteredEdges.some((edge) =>
				(edge.from === node.slug && edge.to === hovered?.slug) ||
				(edge.to === node.slug && edge.from === hovered?.slug),
			);

		const forceGraph = ForceGraph<GraphNode, GraphLink>()
			(container)
			.graphData(graphData())
			.nodeId("slug")
			.backgroundColor(card)
			.nodeLabel((node) => node.private ? `${node.title} · private` : node.title)
			.nodeCanvasObjectMode(() => "replace")
			.nodeCanvasObject((node, context, globalScale) => {
				const highlighted = node === hovered || linkedToHovered(node);
				const radius = (node === hovered ? 7.2 : 5.2) / globalScale;
				context.beginPath();
				context.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI);
				context.fillStyle = node.private ? card : primary;
				context.fill();
				context.lineWidth = (node.private ? 1.4 : highlighted ? 1 : 0) / globalScale;
				context.strokeStyle = primary;
				context.stroke();
				if (filteredNodes.length <= 30 || globalScale > 1.05 || node === hovered) {
					const fontSize = 11 / globalScale;
					context.font = `500 ${fontSize}px Roboto, sans-serif`;
					context.textAlign = "left";
					context.textBaseline = "middle";
					context.fillStyle = text;
					context.fillText(node.title, (node.x ?? 0) + radius + 3 / globalScale, node.y ?? 0);
				}
			})
			.nodePointerAreaPaint((node, color, context, globalScale) => {
				context.fillStyle = color;
				context.beginPath();
				context.arc(node.x ?? 0, node.y ?? 0, 7 / globalScale, 0, 2 * Math.PI);
				context.fill();
			})
			.linkColor((link) =>
				hovered && (nodeSlug(link.source) === hovered.slug || nodeSlug(link.target) === hovered.slug) ? primary : line,
			)
			.linkWidth((link) =>
				hovered && (nodeSlug(link.source) === hovered.slug || nodeSlug(link.target) === hovered.slug) ? 1.4 : 0.65,
			)
			.d3VelocityDecay(0.28)
			.d3AlphaDecay(0.035)
			.onNodeHover((node) => {
				hovered = node;
				container.style.cursor = node ? "pointer" : "grab";
			})
			.onNodeClick((node) => window.location.assign(node.url));

		forceGraph.d3Force("charge")?.strength(-120);
		forceGraph.d3Force("link")?.distance(105);
		graphRenderer = forceGraph;

		const zoomToGraph = () => forceGraph.zoomToFit(0, 44);
		const resizeGraph = () => {
			const { width, height } = container.getBoundingClientRect();
			if (width <= 0 || height <= 0 || (width === lastWidth && height === lastHeight)) return;
			lastWidth = width;
			lastHeight = height;
			forceGraph.width(width).height(height);
			requestAnimationFrame(zoomToGraph);
		};
		const resizeObserver = new ResizeObserver(resizeGraph);
		resizeObserver.observe(container);
		forceGraph.onEngineStop(() => requestAnimationFrame(zoomToGraph));
		requestAnimationFrame(() => {
			resizeGraph();
			applyFilters();
		});
		window.addEventListener("resize", resizeGraph);
		window.addEventListener("archive-filter-change", applyFilters);
		window.addEventListener("popstate", applyFilters);

		return () => {
			window.removeEventListener("resize", resizeGraph);
			window.removeEventListener("archive-filter-change", applyFilters);
			window.removeEventListener("popstate", applyFilters);
			resizeObserver.disconnect();
			forceGraph._destructor();
			graphRenderer = undefined;
		};
	});
</script>

<section class="graph-shell card-base px-8 py-6 onload-animation" aria-labelledby="graph-title">
	<header class="graph-header">
		<div>
			<h1 id="graph-title">文档关系图</h1>
			<p>{filteredNodes.length} 篇文章 · {filteredEdges.length} 条引用{privateContext ? " · 私有视图" : ""}</p>
		</div>
		<div class="graph-hint" aria-hidden="true">左侧分类与标签可多选筛选 · 拖动探索 · 点击打开</div>
	</header>
	<div bind:this={container} class="graph-canvas" role="application" aria-label="可交互的文档关系图"></div>
</section>

<style>
	.graph-shell { overflow: hidden; min-height: min(68vh, 48rem); }
	.graph-header { display: flex; align-items: end; justify-content: space-between; gap: 1rem; padding: 0 0 1.15rem; }
	h1 { margin: 0; color: color-mix(in oklch, var(--deep-text) 90%, var(--primary)); font-size: 1.55rem; font-weight: 700; }
	p { margin: .35rem 0 0; color: color-mix(in oklch, var(--deep-text) 48%, transparent); font-size: .875rem; }
	.graph-hint { color: color-mix(in oklch, var(--deep-text) 42%, transparent); font-size: .75rem; white-space: nowrap; }
	.graph-canvas { height: clamp(27rem, 63vh, 43rem); overflow: hidden; outline: none; border-top: 1px solid var(--line-divider); }
	:global(.dark) h1 { color: color-mix(in oklch, white 88%, var(--primary)); }
	:global(.dark) p, :global(.dark) .graph-hint { color: color-mix(in oklch, white 50%, transparent); }
	@media (max-width: 640px) { .graph-header { align-items: start; } .graph-hint { display: none; } .graph-canvas { height: 62vh; min-height: 26rem; } }
</style>
