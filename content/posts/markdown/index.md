+++
title = "Markdown Example"
description = "A simple example of a Markdown blog post."
date = 2023-10-01
draft = false
slug = "markdown"
path = "posts/markdown"
[taxonomies]
tags = ["Markdown", "Blogging", "Demo"]
categories = ["Examples"]
[extra]
published = "2023-10-01"
updated = ""
image = ""
category = "Examples"
tags = ["Markdown", "Blogging", "Demo"]
draft = false
words = 536
minutes = 3
prev_slug = "video"
prev_title = "Include Video in the Posts"
next_slug = "guide"
next_title = "Simple Guides for Fuwari"
+++

# An h1 header

Paragraphs are separated by a blank line.

2nd paragraph. _Italic_, **bold**, and `monospace`. Itemized lists
look like:

- this one
- that one
- the other one

Note that --- not considering the asterisk --- the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all
in chapters 12--14"). Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺

<a id="an-h2-header"></a>

## An h2 header

Here's a numbered list:

1. first item
2. second item
3. third item

Note again how the actual text starts at 4 columns in (4 characters
from the left side). Here's a code sample:

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="text" class="wrap" style="--ecMaxLine:36ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8"># Let me re-iterate ...</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">for i in 1 .. 10 { do-something(i) }</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="text" class="wrap" style="--ecMaxLine:39ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">define foobar() {</span></div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8">    </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">print &quot;Welcome to flavor country!&quot;;</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#e1e4e8;--1:#e1e4e8">}</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:

<div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="python" class="wrap" style="--ecMaxLine:27ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span style="--0:#F97583;--1:#F97583">import</span><span style="--0:#E1E4E8;--1:#E1E4E8"> time</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span style="--0:#99A0A6;--1:#99A0A6"># Quick, count to ten!</span></div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span style="--0:#F97583;--1:#F97583">for</span><span style="--0:#E1E4E8;--1:#E1E4E8"> i </span><span style="--0:#F97583;--1:#F97583">in</span><span style="--0:#E1E4E8;--1:#E1E4E8"> </span><span style="--0:#79B8FF;--1:#79B8FF">range</span><span style="--0:#E1E4E8;--1:#E1E4E8">(</span><span style="--0:#79B8FF;--1:#79B8FF">10</span><span style="--0:#E1E4E8;--1:#E1E4E8">):</span></div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent">    </span><span style="--0:#99A0A6;--1:#99A0A6"># (but not *too* quick)</span></div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span class="indent"><span style="--0:#E1E4E8;--1:#E1E4E8">    </span></span><span style="--0:#E1E4E8;--1:#E1E4E8">time.sleep(</span><span style="--0:#79B8FF;--1:#79B8FF">0.5</span><span style="--0:#E1E4E8;--1:#E1E4E8">)</span></div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span class="indent">    </span><span style="--0:#79B8FF;--1:#79B8FF">print</span><span style="--0:#E1E4E8;--1:#E1E4E8"> i</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

### An h3 header

Now a nested list:

1. First, get these ingredients:

    - carrots
    - celery
    - lentils

2. Boil some water.

3. Dump everything in the pot and follow
    this algorithm:

    <div class="expressive-code"><figure class="frame"><figcaption class="header"></figcaption><pre data-language="text" class="wrap" style="--ecMaxLine:48ch"><code><div class="ec-line" style="--ecIndent:1ch"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8"> </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">find wooden spoon</span></div></div><div class="ec-line" style="--ecIndent:1ch"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8"> </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">uncover pot</span></div></div><div class="ec-line" style="--ecIndent:1ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8"> </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">stir</span></div></div><div class="ec-line" style="--ecIndent:1ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8"> </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">cover pot</span></div></div><div class="ec-line" style="--ecIndent:1ch"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8"> </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">balance wooden spoon precariously on pot handle</span></div></div><div class="ec-line" style="--ecIndent:1ch"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8"> </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">wait 10 minutes</span></div></div><div class="ec-line" style="--ecIndent:1ch"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code"><span class="indent"><span style="--0:#e1e4e8;--1:#e1e4e8"> </span></span><span style="--0:#e1e4e8;--1:#e1e4e8">goto first step (or shut off burner when done)</span></div></div></code><button class="copy-btn" aria-label="Copy code"><div class="copy-btn-icon"><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon copy-icon"><path d="M368.37-237.37q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-474.26q0-34.48 24.26-58.74 24.26-24.26 58.74-24.26h378.26q34.48 0 58.74 24.26 24.26 24.26 24.26 58.74v474.26q0 34.48-24.26 58.74-24.26 24.26-58.74 24.26H368.37Zm0-83h378.26v-474.26H368.37v474.26Zm-155 238q-34.48 0-58.74-24.26-24.26-24.26-24.26-58.74v-515.76q0-17.45 11.96-29.48 11.97-12.02 29.33-12.02t29.54 12.02q12.17 12.03 12.17 29.48v515.76h419.76q17.45 0 29.48 11.96 12.02 11.97 12.02 29.33t-12.02 29.54q-12.03 12.17-29.48 12.17H213.37Zm155-238v-474.26 474.26Z"></path></svg><svg viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg" class="copy-btn-icon success-icon"><path d="m389-377.13 294.7-294.7q12.58-12.67 29.52-12.67 16.93 0 29.61 12.67 12.67 12.68 12.67 29.53 0 16.86-12.28 29.14L419.07-288.41q-12.59 12.67-29.52 12.67-16.94 0-29.62-12.67L217.41-430.93q-12.67-12.68-12.79-29.45-.12-16.77 12.55-29.45 12.68-12.67 29.62-12.67 16.93 0 29.28 12.67L389-377.13Z"></path></svg></div></button></pre></figure></div>

    Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header). Here's a footnote [^1].

[^1]: Footnote text goes here.

Tables can look like this:

size material color

---

9 leather brown
10 hemp canvas natural
11 glass transparent

Table: Shoes, their sizes, and what they're made of

(The above is the caption for the table.) Pandoc also supports
multi-line tables:

---

keyword text

---

red Sunsets, apples, and
other red or reddish
things.

green Leaves, grass, frogs
and other things it's
not easy being.

---

A horizontal rule follows.

---

Here's a definition list:

apples
: Good for making applesauce.
oranges
: Citrus!
tomatoes
: There's no "e" in tomatoe.

Again, text is indented 4 spaces. (Put a blank line between each
term/definition pair to spread things out more.)

Here's a "line block":

| Line one
| Line too
| Line tree

and images can be specified like so:

[//]: # (![example image]&#40;./demo-banner.png "An exemplary image"&#41;)

Inline math equations go in like so: $\omega = d\phi / dt$. Display
math should get its own line and be put in in double-dollarsigns:

$$I = \int \rho R^{2} dV$$

$$
\begin{equation*}
\pi
=3.1415926535
 \;8979323846\;2643383279\;5028841971\;6939937510\;5820974944
 \;5923078164\;0628620899\;8628034825\;3421170679\;\ldots
\end{equation*}
$$

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.
