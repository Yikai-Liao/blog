+++
title = "Markdown Extended Features"
description = "Read more about Markdown features in Fuwari"
date = 2024-05-01
draft = false
slug = "markdown-extended"
path = "posts/markdown-extended"
[taxonomies]
tags = ["Demo", "Example", "Markdown", "Fuwari"]
categories = ["Examples"]
[extra]
published = "2024-05-01"
updated = "2024-11-29"
image = ""
category = "Examples"
draft = false
private = false
+++

## GitHub Repository Cards
You can add dynamic cards that link to GitHub repositories, on page load, the repository information is pulled from the GitHub API. 

{{ github(repo="Fabrizz/MMM-OnSpotify") }}
Create a GitHub repository card with the code `::github{repo="<owner>/<repo>"}`.

<div class="expressive-code"><pre data-language="markdown" class="wrap" style="--ecMaxLine:32ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">::github{repo=&quot;Yikai-Liao/blog&quot;}</div></div></code></pre></div>

## Admonitions

Following types of admonitions are supported: `note` `tip` `important` `warning` `caution`

<blockquote class="admonition bdm-note">
<p class="bdm-title">Note</p>

Highlights information that users should take into account, even when skimming.
</blockquote>

<blockquote class="admonition bdm-tip">
<p class="bdm-title">Tip</p>

Optional information to help a user be more successful.
</blockquote>

<blockquote class="admonition bdm-important">
<p class="bdm-title">Important</p>

Crucial information necessary for users to succeed.
</blockquote>

<blockquote class="admonition bdm-warning">
<p class="bdm-title">Warning</p>

Critical content demanding immediate user attention due to potential risks.
</blockquote>

<blockquote class="admonition bdm-caution">
<p class="bdm-title">Caution</p>

Negative potential consequences of an action.
</blockquote>

### Basic Syntax

<div class="expressive-code"><pre data-language="markdown" class="wrap" style="--ecMaxLine:79ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">:::note</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">Highlights information that users should take into account, even when skimming.</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">:::</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">:::tip</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code">Optional information to help a user be more successful.</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code">:::</div></div></code></pre></div>

### Custom Titles

The title of the admonition can be customized.

<blockquote class="admonition bdm-note">
<p class="bdm-title">MY CUSTOM TITLE</p>

This is a note with a custom title.
</blockquote>

<div class="expressive-code"><pre data-language="markdown" class="wrap" style="--ecMaxLine:35ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">:::note[MY CUSTOM TITLE]</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">This is a note with a custom title.</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">:::</div></div></code></pre></div>

### GitHub Syntax

<blockquote class="admonition bdm-tip">
<p class="bdm-title">TIP</p>

[The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.
</blockquote>
<div class="expressive-code"><pre data-language="text" class="wrap" style="--ecMaxLine:38ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">&gt; [!NOTE]</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">&gt; The GitHub syntax is also supported.</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">&gt; [!TIP]</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">&gt; The GitHub syntax is also supported.</div></div></code></pre></div>

### Spoiler

You can add spoilers to your text. The text also supports **Markdown** syntax.

The content <spoiler>is hidden **ayyy**</spoiler>!

<div class="expressive-code"><pre data-language="markdown" class="wrap" style="--ecMaxLine:41ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">The content <spoiler>is hidden **ayyy**</spoiler>!</div></div></code></pre></div>
