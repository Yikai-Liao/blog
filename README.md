# Yikai Liao 的博客

这是 `Yikai-Liao/blog` 的源码仓库。站点基于 Astro 和 Fuwari 改造，内容放在 `contents/`，评论后端放在 `comments/`。

## 技术栈

- Astro 7 + Svelte 5
- Tailwind CSS 4
- Pagefind 本地搜索
- Twikoo + Cloudflare Worker + D1 评论后端
- pnpm 9

## 本地开发

```sh
pnpm install
pnpm dev
```

默认开发地址是 `http://localhost:4321`。

常用命令：

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动本地站点 |
| `pnpm build` | 构建生产产物到 `dist/` |
| `pnpm preview` | 预览生产构建 |
| `pnpm check` | 运行 Astro 检查 |
| `pnpm type-check` | 运行 TypeScript 检查 |
| `pnpm new-post <slug>` | 在 `contents/` 下创建文章 |

## 写文章

文章使用 Markdown 或 MDX，路径规则是 `contents/**/*.md` 和 `contents/**/*.mdx`。以下划线开头的文件不会被收录。

最小 frontmatter：

```yaml
---
title: 文章标题
slug: article-slug
published: 2026-07-06
description: 简短摘要
tags: []
category: ''
draft: false
private: true
---
```

字段说明：

- `draft: true`：不发布。
- `private: true`：作为私有文章处理。当前 schema 默认值也是 `true`，公开文章需要显式写 `private: false`。
- `image`：封面图，可用 URL、`public/` 下的绝对路径，或相对文章文件的路径。
- `toc.depth`：单篇文章目录深度，可设为 `1`、`2`、`3`。

## 评论后端

评论服务在 `comments/` 目录，是一个 Twikoo Cloudflare Worker。

本地调试：

```sh
cd comments
pnpm install
TWIKOO_D1_DATABASE_ID=local-twikoo pnpm d1:schema:local
TWIKOO_D1_DATABASE_ID=local-twikoo pnpm dev
```

另开一个终端启动站点：

```sh
PUBLIC_TWIKOO_ENV_ID=http://127.0.0.1:8787 pnpm dev --host 127.0.0.1
```

更完整的 Worker 部署和权限说明见 [comments/README.md](comments/README.md)。

## 部署

站点部署由 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) 处理：

- `GITHUB_PAGES_ENABLED=true` 时部署 GitHub Pages。
- 配置 `CLOUDFLARE_PAGES_PROJECT_NAME` 时部署 Cloudflare Pages。
- `TWIKOO_WORKER_ENABLED=true` 且配置 `TWIKOO_D1_DATABASE_ID` 时部署评论 Worker。

构建时可用变量：

| 名称 | 用途 |
| --- | --- |
| `PUBLIC_SITE_URL` | 站点 canonical URL |
| `PUBLIC_BASE_PATH` | 子路径部署前缀 |
| `PUBLIC_TWIKOO_ENV_ID` | Twikoo Worker 地址 |

GitHub Actions 中还需要按实际部署目标配置 Cloudflare 的 `CLOUDFLARE_ACCOUNT_ID` 和 `CLOUDFLARE_API_TOKEN`。

## 目录

| 路径 | 用途 |
| --- | --- |
| `contents/` | 博客文章 |
| `src/` | 站点组件、样式、配置和插件 |
| `comments/` | Twikoo Worker |
| `scripts/` | 构建和发文脚本 |
| `docs/` | 上游模板文档，主要作参考 |
