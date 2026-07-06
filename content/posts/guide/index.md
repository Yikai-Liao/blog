+++
title = "Simple Guides for Fuwari"
description = "How to use this blog template."
date = 2024-04-01
draft = false
slug = "guide"
path = "posts/guide"
[taxonomies]
tags = ["Fuwari", "Blogging", "Customization"]
categories = ["Guides"]
[extra]
published = "2024-04-01"
updated = ""
image = "https://blog-img.lyk-ai.com/1783153969920_舔手指的小女孩.webp"
category = "Guides"
tags = ["Fuwari", "Blogging", "Customization"]
draft = false
words = 241
minutes = 1
prev_slug = "markdown"
prev_title = "Markdown Example"
next_slug = "expressive-code"
next_title = "Expressive Code Example"
+++

> Cover image source: [Source](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

This blog template is built with [Astro](https://astro.build/). For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).

## Front-matter of Posts

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="yaml" class="wrap" style="--ecMaxLine:57ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#B392F0;--1:#B392F0">---</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">title</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">My First Blog Post</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">slug</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">my-first-post</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">published</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#79B8FF;--1:#79B8FF">2023-09-09</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">description</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">This is the first post of my new Astro blog.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">image</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">./cover.jpg</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">tags</span><span style="--0:#E1E4E8;--1:#E1E4E8">: [</span><span style="--0:#9ECBFF;--1:#9ECBFF">Foo</span><span style="--0:#E1E4E8;--1:#E1E4E8">, </span><span style="--0:#9ECBFF;--1:#9ECBFF">Bar</span><span style="--0:#E1E4E8;--1:#E1E4E8">]</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">8</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">category</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">Front-end</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">9</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">draft</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#79B8FF;--1:#79B8FF">false</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">10</div></div><div class="code"><span style="--0:#B392F0;--1:#B392F0">---</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

| Attribute     | Description                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`       | The title of the post.                                                                                                                                                                                      |
| `published`   | The date the post was published.                                                                                                                                                                            |
| `description` | A short description of the post. Displayed on index page.                                                                                                                                                   |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post.                                                                                                                                                                                       |
| `category`    | The category of the post.                                                                                                                                                                                   |
| `draft`        | If this post is still a draft, which won't be displayed.                                                                                                                                                    |
| `slug`         | Required. Defines the post URL independently from the file path.                                                                                                      |

## Where to Place the Post Files



Your post files should be placed in `contents/` directory. You can create arbitrary sub-directories to organize posts and assets. The URL is controlled by the frontmatter `slug`, not by the file path.

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="text" class="wrap" style="--ecMaxLine:17ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">contents/</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">├── post-1.md</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">└── post-2/</span></div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8">    </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">├── cover.png</span></div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8">    </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">└── index.md</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>
