# Yikai Liao 的博客

这是 `Yikai-Liao/blog` 的源码仓库。站点基于 Astro 和 Fuwari 改造，文章通过 `contents/` submodule 关联到 private 仓库 `Yikai-Liao/blog-posts`，评论后端放在 `comments/`。

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
| `pnpm new-post <slug>` | 在 `contents/<当前年份>/` 下创建文章 |

## 写文章

文章使用 Markdown 或 MDX，路径规则是 `contents/<年份>/**/*.md` 和 `contents/<年份>/**/*.mdx`。以下划线开头的文件不会被收录，`contents/README.md` 也不会被收录。

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
- `slug`：文章 URL，必须在全部文章里唯一；年份目录不会进入 URL。只允许小写字母、数字、短横线，例如 `tidb-vs-tikv`。
- `image`：封面图，可用 URL、`public/` 下的绝对路径，或相对文章文件的路径。
- `toc.depth`：单篇文章目录深度，可设为 `1`、`2`、`3`。

## 站内引用与关系图

站内文章引用统一使用 Obsidian 风格的 wiki link，并以 `slug` 作为稳定标识：

```markdown
[[tidb-vs-tikv]]
[[tidb-vs-tikv#架构|跳到架构说明]]
```

每篇文章底部会显示反向链接。`/graph/` 只展示公开文章及公开文章之间的引用；`/private/graph/` 展示完整图谱。构建会拒绝不存在的 slug，以及公开文章指向私有文章的引用，防止私有文章信息泄露到公开页面。

推荐的 private 仓结构：

```text
README.md
2024/
  post.md
  topic/
    index.md
2025/
  another-post.md
```

把文章迁移成 submodule：

```sh
git rm -r contents
git submodule add https://github.com/Yikai-Liao/blog-posts.git contents
git commit -m "Move blog posts to submodule"
```

GitHub Actions 需要一个 `BLOG_POSTS_TOKEN` secret。它需要能读取 `Yikai-Liao/blog-posts`；如果要让 private 仓更新后自动推进 public 仓的 submodule 指针并触发 public 仓构建，也需要能写 `Yikai-Liao/blog`。

在 `Yikai-Liao/blog-posts` 里加一个 workflow 触发 public 仓更新：

```yaml
name: Notify Blog

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Dispatch public blog update
        run: |
          curl -fsS -X POST \
            -H "Accept: application/vnd.github+json" \
            -H "Authorization: Bearer ${{ secrets.BLOG_POSTS_TOKEN }}" \
            https://api.github.com/repos/Yikai-Liao/blog/dispatches \
            -d '{"event_type":"blog-posts-updated"}'
```

## 评论后端

评论服务在 `comments/` 目录，是一个 Twikoo Cloudflare Worker。

本地调试：

```sh
pnpm install
TWIKOO_D1_DATABASE_ID=local-twikoo pnpm --dir comments d1:schema:local
pnpm dev
```

`pnpm dev` 会默认用 `local-twikoo` 启动本地评论 Worker，并把前端评论地址指向 `http://127.0.0.1:8787`。

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
