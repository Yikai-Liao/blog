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
draft = false
private = false
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

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

<div class="expressive-code"><pre data-language="text" class="wrap" style="--ecMaxLine:39ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">define foobar() {</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span class="indent">    </span>print &quot;Welcome to flavor country!&quot;;</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">}</div></div></code></pre></div>

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:

<div class="expressive-code"><pre data-language="python" class="wrap" style="--ecMaxLine:27ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">import time</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"># Quick, count to ten!</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">for i in range(10):</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent">    </span># (but not *too* quick)</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span class="indent">    </span>time.sleep(0.5)</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span class="indent">    </span>print i</div></div></code></pre></div>

### An h3 header

Now a nested list:

1. First, get these ingredients:

    - carrots
    - celery
    - lentils

2. Boil some water.

3. Dump everything in the pot and follow
    this algorithm:

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

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
