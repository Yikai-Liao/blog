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

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="yaml" class="wrap" style="--ecMaxLine:57ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#B392F0;--1:#B392F0">---</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">title</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">My First Blog Post</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">slug</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">my-first-post</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">published</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#79B8FF;--1:#79B8FF">2023-09-09</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">description</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">This is the first post of my new Astro blog.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">image</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">./cover.jpg</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">tags</span><span style="--0:#E1E4E8;--1:#E1E4E8">: [</span><span style="--0:#9ECBFF;--1:#9ECBFF">Foo</span><span style="--0:#E1E4E8;--1:#E1E4E8">, </span><span style="--0:#9ECBFF;--1:#9ECBFF">Bar</span><span style="--0:#E1E4E8;--1:#E1E4E8">]</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">8</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">category</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#9ECBFF;--1:#9ECBFF">Front-end</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">9</div></div><div class="code"><span style="--0:#85E89D;--1:#85E89D">draft</span><span style="--0:#E1E4E8;--1:#E1E4E8">: </span><span style="--0:#79B8FF;--1:#79B8FF">false</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">10</div></div><div class="code"><span style="--0:#B392F0;--1:#B392F0">---</span></div></div></code></pre><div class="copy"><div aria-live="polite"></div><button title="Copy to clipboard" data-copied="Copied!" data-code="---title: My First Blog Postslug: my-first-postpublished: 2023-09-09description: This is the first post of my new Astro blog.image: ./cover.jpgtags: [Foo, Bar]category: Front-enddraft: false---"><div></div></button></div></figure></div>

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

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="text" class="wrap" style="--ecMaxLine:17ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">contents/</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">├── post-1.md</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">└── post-2/</span></div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8">    </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">├── cover.png</span></div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8">    </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">└── index.md</span></div></div></code></pre><div class="copy"><div aria-live="polite"></div><button title="Copy to clipboard" data-copied="Copied!" data-code="contents/├── post-1.md└── post-2/    ├── cover.png    └── index.md"><div></div></button></div></figure></div>
