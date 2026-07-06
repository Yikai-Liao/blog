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
private = false
private_fallback = false
canonical_path = "posts/markdown-extended/"
words = 230
minutes = 1
prev_slug = "expressive-code"
prev_title = "Expressive Code Example"
prev_private = false
next_slug = "tidb-vs-tikv"
next_title = "TiDB vs TiKV 区别"
next_private = true
+++

## GitHub Repository Cards
You can add dynamic cards that link to GitHub repositories, on page load, the repository information is pulled from the GitHub API. 

{{ github(repo="Fabrizz/MMM-OnSpotify") }}
Create a GitHub repository card with the code `::github{repo="<owner>/<repo>"}`.

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="markdown" class="wrap" style="--ecMaxLine:32ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">::github{repo=&quot;Yikai-Liao/blog&quot;}</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

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

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="markdown" class="wrap" style="--ecMaxLine:79ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::note</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">Highlights information that users should take into account, even when skimming.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::tip</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">Optional information to help a user be more successful.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

### Custom Titles

The title of the admonition can be customized.

<blockquote class="admonition bdm-note">
<p class="bdm-title">MY CUSTOM TITLE</p>

This is a note with a custom title.
</blockquote>

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="markdown" class="wrap" style="--ecMaxLine:35ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::note[MY CUSTOM TITLE]</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">This is a note with a custom title.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">:::</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

### GitHub Syntax

<blockquote class="admonition bdm-tip">
<p class="bdm-title">TIP</p>

[The GitHub syntax](https://github.com/orgs/community/discussions/16925) is also supported.
</blockquote>
<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="text" class="wrap" style="--ecMaxLine:38ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">&gt; [!NOTE]</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">&gt; The GitHub syntax is also supported.</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">&gt; [!TIP]</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">&gt; The GitHub syntax is also supported.</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

### Spoiler

You can add spoilers to your text. The text also supports **Markdown** syntax.

The content <spoiler>is hidden **ayyy**</spoiler>!

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="markdown" class="wrap" style="--ecMaxLine:41ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#E1E4E8;--1:#E1E4E8">The content <spoiler>is hidden </span><span style="--0:#E1E4E8;--0fw:bold;--1:#E1E4E8;--1fw:bold">**ayyy**</span><span style="--0:#E1E4E8;--1:#E1E4E8"></spoiler>!</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>
