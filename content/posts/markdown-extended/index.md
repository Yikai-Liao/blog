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
tags = ["Demo", "Example", "Markdown", "Fuwari"]
draft = false
words = 230
minutes = 1
prev_slug = "expressive-code"
prev_title = "Expressive Code Example"
next_slug = "tidb-vs-tikv"
next_title = "TiDB vs TiKV 区别"
+++

## GitHub Repository Cards
You can add dynamic cards that link to GitHub repositories, on page load, the repository information is pulled from the GitHub API. 

{{ github(repo="Fabrizz/MMM-OnSpotify") }}
Create a GitHub repository card with the code `::github{repo="<owner>/<repo>"}`.

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="markdown" class="wrap" style="--ecMaxLine:32ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">::github{repo="Yikai-Liao/blog"}</span></div></div></code></pre><div class="copy"><div aria-live="polite"></div><button title="Copy to clipboard" data-copied="Copied!" data-code="::github{repo=&#x22;Yikai-Liao/blog&#x22;}"><div></div></button></div></figure></div>

## Admonitions

Following types of admonitions are supported: `note` `tip` `important` `warning` `caution`

<blockquote class="admonition bdm-note">
<p class="bdm-title">NOTE</p>

Highlights information that users should take into account, even when skimming.
</blockquote>

<blockquote class="admonition bdm-tip">
<p class="bdm-title">TIP</p>

Optional information to help a user be more successful.
</blockquote>

<blockquote class="admonition bdm-important">
<p class="bdm-title">IMPORTANT</p>

Crucial information necessary for users to succeed.
</blockquote>

<blockquote class="admonition bdm-warning">
<p class="bdm-title">WARNING</p>

Critical content demanding immediate user attention due to potential risks.
</blockquote>

<blockquote class="admonition bdm-caution">
<p class="bdm-title">CAUTION</p>

Negative potential consequences of an action.
</blockquote>

### Basic Syntax

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="markdown" class="wrap" style="--ecMaxLine:79ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::note</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">Highlights information that users should take into account, even when skimming.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::tip</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">Optional information to help a user be more successful.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::</span></div></div></code></pre><div class="copy"><div aria-live="polite"></div><button title="Copy to clipboard" data-copied="Copied!" data-code=":::noteHighlights information that users should take into account, even when skimming.::::::tipOptional information to help a user be more successful.:::"><div></div></button></div></figure></div>

### Custom Titles

The title of the admonition can be customized.

<blockquote class="admonition bdm-note">
<p class="bdm-title">MY CUSTOM TITLE</p>

This is a note with a custom title.
</blockquote>

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="markdown" class="wrap" style="--ecMaxLine:35ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::note[MY CUSTOM TITLE]</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">This is a note with a custom title.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::</span></div></div></code></pre><div class="copy"><div aria-live="polite"></div><button title="Copy to clipboard" data-copied="Copied!" data-code=":::note[MY CUSTOM TITLE]This is a note with a custom title.:::"><div></div></button></div></figure></div>

### GitHub Syntax

<blockquote class="admonition bdm-tip">
<p class="bdm-title">TIP</p>

[The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.
</blockquote>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="text" class="wrap" style="--ecMaxLine:38ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">> [!NOTE]</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">> The GitHub syntax is also supported.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">> [!TIP]</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">> The GitHub syntax is also supported.</span></div></div></code></pre><div class="copy"><div aria-live="polite"></div><button title="Copy to clipboard" data-copied="Copied!" data-code="> [!NOTE]> The GitHub syntax is also supported.> [!TIP]> The GitHub syntax is also supported."><div></div></button></div></figure></div>

### Spoiler

You can add spoilers to your text. The text also supports **Markdown** syntax.

The content <spoiler>is hidden **ayyy**</spoiler>!

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="markdown" class="wrap" style="--ecMaxLine:41ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">The content <spoiler>is hidden </span><span style="--0:#E1E4E8;--0fw:bold;--1:#E1E4E8;--1fw:bold">**ayyy**</span><span style="--0:#E1E4E8;--1:#E1E4E8"></spoiler>!</span></div></div></code></pre><div class="copy"><div aria-live="polite"></div><button title="Copy to clipboard" data-copied="Copied!" data-code="The content <spoiler>is hidden **ayyy**</spoiler>!"><div></div></button></div></figure></div>
