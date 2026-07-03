# 🍥Fuwari

基于 [Astro](https://astro.build) 开发的静态博客模板。

[**🖥️在线预览（Vercel）**](https://fuwari.vercel.app)

![Preview Image](https://raw.githubusercontent.com/saicaca/resource/main/fuwari/home.png)

## ✨ 功能特性

- [x] 基于 Astro 和 Tailwind CSS 开发
- [x] 流畅的动画和页面过渡
- [x] 亮色 / 暗色模式
- [x] 自定义主题色和横幅图片
- [x] 响应式设计
- [ ] 评论
- [x] 搜索
- [x] 文内目录

## 👀 要求

- Node.js <= 22
- pnpm <= 9

## 🚀 使用方法 1

使用 [create-fuwari](https://github.com/L4Ph/create-fuwari) 在本地初始化项目。

```sh
# npm
npm create fuwari@latest

# yarn
yarn create fuwari

# pnpm
pnpm create fuwari@latest

# bun
bun create fuwari@latest

# deno
deno run -A npm:create-fuwari@latest
```

1. 通过配置文件 `src/config.ts` 自定义博客
2. 执行 `pnpm new-post <filename>` 创建新文章，并在 `src/content/posts/` 目录中编辑
3. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel、Netlify、GitHub Pages、Cloudflare Pages 等；本仓库已内置通过 GitHub Actions 同时部署到 GitHub Pages 和 Cloudflare Pages 的 workflow。

## 🚀 使用方法 2

1. 使用此模板[生成新仓库](https://github.com/saicaca/fuwari/generate)或 Fork 此仓库
2. 进行本地开发，Clone 新的仓库，执行 `pnpm install` 和 `pnpm add sharp` 以安装依赖  
   - 若未安装 [pnpm](https://pnpm.io)，执行 `npm install -g pnpm`
3. 通过配置文件 `src/config.ts` 自定义博客
4. 执行 `pnpm new-post <filename>` 创建新文章，并在 `src/content/posts/` 目录中编辑
5. 参考[官方指南](https://docs.astro.build/zh-cn/guides/deploy/)将博客部署至 Vercel、Netlify、GitHub Pages、Cloudflare Pages 等；本仓库已内置通过 GitHub Actions 同时部署到 GitHub Pages 和 Cloudflare Pages 的 workflow。

## ⚙️ 文章 Frontmatter

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Astro blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
lang: jp      # 仅当文章语言与 `config.ts` 中的网站语言不同时需要设置
---
```

## 🧞 指令

下列指令均需要在项目根目录执行：

| Command                           | Action                            |
|:----------------------------------|:----------------------------------|
| `pnpm install` 并 `pnpm add sharp` | 安装依赖                              |
| `pnpm dev`                        | 在 `localhost:4321` 启动本地开发服务器      |
| `pnpm build`                      | 构建网站至 `./dist/`                   |
| `pnpm preview`                    | 本地预览已构建的网站                        |
| `pnpm new-post <filename>`        | 创建新文章                             |
| `pnpm astro ...`                  | 执行 `astro add`, `astro check` 等指令 |
| `pnpm astro --help`               | 显示 Astro CLI 帮助                   |

## 双部署

仓库内的 [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) 会在每次推送到 `main` 时，同时部署到 GitHub Pages 和 Cloudflare Pages。

启用前需要先完成以下配置：

1. 在 GitHub 仓库设置中，将 Pages 的构建来源切换为 **GitHub Actions**。
2. 配置 Cloudflare 相关 GitHub Secrets：
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
3. 配置 Cloudflare 相关 GitHub Repository Variable：
   - `CLOUDFLARE_PAGES_PROJECT_NAME`
4. 可选的 Repository Variables：
   - `GITHUB_PAGES_SITE_URL`：覆盖默认的 GitHub Pages 站点 URL。
   - `GITHUB_PAGES_BASE_PATH`：覆盖默认的 GitHub Pages 基础路径。默认规则是 `<owner>.github.io` 仓库用 `/`，项目页仓库用 `/<repo>`。
   - `CLOUDFLARE_PAGES_SITE_URL`：覆盖默认的 Cloudflare Pages URL（`https://<project>.pages.dev`）。

之所以在 workflow 里分别构建两次，是因为 Astro 的 `site` 和 `base` 会影响 sitemap、RSS、canonical URL 等产物。现在 `astro.config.mjs` 会读取 `PUBLIC_SITE_URL` 和 `PUBLIC_BASE_PATH`，从而为两个部署目标生成各自正确的静态文件。
