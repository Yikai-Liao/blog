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
draft = false
private = false
+++

> Cover image source: [Source](https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg)

This blog template is built with [Astro](https://astro.build/). For the things that are not mentioned in this guide, you may find the answers in the [Astro Docs](https://docs.astro.build/).

## Front-matter of Posts

<div class="expressive-code"><pre data-language="yaml" class="wrap" style="--ecMaxLine:57ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">---</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">title: My First Blog Post</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">slug: my-first-post</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">published: 2023-09-09</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">description: This is the first post of my new Astro blog.</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code">image: ./cover.jpg</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code">tags: [Foo, Bar]</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">8</div></div><div class="code">category: Front-end</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">9</div></div><div class="code">draft: false</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">10</div></div><div class="code">private: true</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">11</div></div><div class="code">---</div></div></code></pre></div>

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
| `private`      | If true, the canonical URL is `/posts/private/my-post/`. The original `/posts/my-post/` redirects to the canonical URL.                                             |

## Where to Place the Post Files



Your post files should be placed in `contents/` directory. You can create arbitrary sub-directories to organize posts and assets. The URL is controlled by the frontmatter `slug`, not by the file path.

<div class="expressive-code"><pre data-language="text" class="wrap" style="--ecMaxLine:17ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">contents/</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">├── post-1.md</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">└── post-2/</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent">    </span>├── cover.png</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span class="indent">    </span>└── index.md</div></div></code></pre></div>
