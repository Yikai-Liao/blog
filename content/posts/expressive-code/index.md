+++
title = "Expressive Code Example"
description = "How code blocks look in Markdown using Expressive Code."
date = 2024-04-10
draft = false
slug = "expressive-code"
path = "posts/expressive-code"
[taxonomies]
tags = ["Markdown", "Blogging", "Demo"]
categories = ["Examples"]
[extra]
published = "2024-04-10"
updated = ""
image = ""
category = "Examples"
draft = false
private = false
+++

Here, we'll explore how code blocks look using [Expressive Code](https://expressive-code.com/). The provided examples are based on the official documentation, which you can refer to for further details.

## Expressive Code

### Syntax Highlighting

[Syntax Highlighting](https://expressive-code.com/key-features/syntax-highlighting/)

#### Regular syntax highlighting

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:47ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">console.log('This code is syntax highlighted!')</div></div></code></pre></div>

#### Rendering ANSI escape sequences

<div class="expressive-code"><pre data-language="ansi" class="wrap" style="--ecMaxLine:111ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">ANSI colors:</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">- Regular: [31mRed[0m [32mGreen[0m [33mYellow[0m [34mBlue[0m [35mMagenta[0m [36mCyan[0m</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">- Bold:    [1;31mRed[0m [1;32mGreen[0m [1;33mYellow[0m [1;34mBlue[0m [1;35mMagenta[0m [1;36mCyan[0m</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">- Dimmed:  [2;31mRed[0m [2;32mGreen[0m [2;33mYellow[0m [2;34mBlue[0m [2;35mMagenta[0m [2;36mCyan[0m</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code">256 colors (showing colors 160-177):</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code">[38;5;160m160 [38;5;161m161 [38;5;162m162 [38;5;163m163 [38;5;164m164 [38;5;165m165[0m</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">8</div></div><div class="code">[38;5;166m166 [38;5;167m167 [38;5;168m168 [38;5;169m169 [38;5;170m170 [38;5;171m171[0m</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">9</div></div><div class="code">[38;5;172m172 [38;5;173m173 [38;5;174m174 [38;5;175m175 [38;5;176m176 [38;5;177m177[0m</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">10</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">11</div></div><div class="code">Full RGB colors:</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">12</div></div><div class="code">[38;2;34;139;34mForestGreen - RGB(34, 139, 34)[0m</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">13</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">14</div></div><div class="code">Text formatting: [1mBold[0m [2mDimmed[0m [3mItalic[0m [4mUnderline[0m</div></div></code></pre></div>

### Editor & Terminal Frames

[Editor & Terminal Frames](https://expressive-code.com/key-features/frames/)

#### Code editor frames

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:38ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">console.log('Title attribute example')</div></div></code></pre></div>

---

<div class="expressive-code"><pre data-language="html" class="wrap" style="--ecMaxLine:36ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">&lt;!-- src/content/index.html --&gt;</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">&lt;div&gt;File name comment example&lt;/div&gt;</div></div></code></pre></div>

#### Terminal frames

<div class="expressive-code"><pre data-language="bash" class="wrap" style="--ecMaxLine:39ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">echo &quot;This terminal frame has no title&quot;</div></div></code></pre></div>

---

<div class="expressive-code"><pre data-language="powershell" class="wrap" style="--ecMaxLine:36ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">Write-Output &quot;This one has a title!&quot;</div></div></code></pre></div>

#### Overriding frame types

<div class="expressive-code"><pre data-language="sh" class="wrap" style="--ecMaxLine:25ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">echo &quot;Look ma, no frame!&quot;</div></div></code></pre></div>

---

<div class="expressive-code"><pre data-language="ps" class="wrap" style="--ecMaxLine:56ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"># Without overriding, this would be a terminal frame</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">function Watch-Tail { Get-Content -Tail 20 -Wait $args }</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">New-Alias tail Watch-Tail</div></div></code></pre></div>

### Text & Line Markers

[Text & Line Markers](https://expressive-code.com/key-features/text-markers/)

#### Marking full lines & line ranges

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:35ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// Line 1 - targeted by line number</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">// Line 2</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">// Line 3</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">// Line 4 - targeted by line number</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">// Line 5</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code">// Line 6</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code">// Line 7 - targeted by range &quot;7-8&quot;</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">8</div></div><div class="code">// Line 8 - targeted by range &quot;7-8&quot;</div></div></code></pre></div>

#### Selecting line marker types (mark, ins, del)

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:57ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">function demo() {</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span class="indent">  </span>console.log('this line is marked as deleted')</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>// This line and the next one are marked as inserted</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent">  </span>console.log('this is the second inserted line')</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">
</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span class="indent">  </span>return 'this line uses the neutral default marker type'</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code">}</div></div></code></pre></div>

#### Adding labels to line markers

<div class="expressive-code"><pre data-language="jsx" class="wrap" style="--ecMaxLine:72ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// labeled-line-markers.jsx</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">&lt;button</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>role=&quot;button&quot;</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent">  </span>{...props}</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code"><span class="indent">  </span>value={value}</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span class="indent">  </span>className={buttonClassName}</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code"><span class="indent">  </span>disabled={disabled}</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">8</div></div><div class="code"><span class="indent">  </span>active={active}</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">9</div></div><div class="code">&gt;</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">10</div></div><div class="code"><span class="indent">  </span>{children &amp;&amp;</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">11</div></div><div class="code"><span class="indent">    </span>!active &amp;&amp;</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">12</div></div><div class="code"><span class="indent">    </span>(typeof children === 'string' ? &lt;span&gt;{children}&lt;/span&gt; : children)}</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">13</div></div><div class="code">&lt;/button&gt;</div></div></code></pre></div>

#### Adding long labels on their own lines

<div class="expressive-code"><pre data-language="jsx" class="wrap" style="--ecMaxLine:72ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// labeled-line-markers.jsx</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">&lt;button</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>role=&quot;button&quot;</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent">  </span>{...props}</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">
</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span class="indent">  </span>value={value}</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code"><span class="indent">  </span>className={buttonClassName}</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">8</div></div><div class="code">
</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">9</div></div><div class="code"><span class="indent">  </span>disabled={disabled}</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">10</div></div><div class="code"><span class="indent">  </span>active={active}</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">11</div></div><div class="code">&gt;</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">12</div></div><div class="code">
</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">13</div></div><div class="code"><span class="indent">  </span>{children &amp;&amp;</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">14</div></div><div class="code"><span class="indent">    </span>!active &amp;&amp;</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">15</div></div><div class="code"><span class="indent">    </span>(typeof children === 'string' ? &lt;span&gt;{children}&lt;/span&gt; : children)}</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">16</div></div><div class="code">&lt;/button&gt;</div></div></code></pre></div>

#### Using diff-like syntax

<div class="expressive-code"><pre data-language="diff" class="wrap" style="--ecMaxLine:37ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">+this line will be marked as inserted</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">-this line will be marked as deleted</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">this is a regular line</div></div></code></pre></div>

---

<div class="expressive-code"><pre data-language="diff" class="wrap" style="--ecMaxLine:37ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">--- a/README.md</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">+++ b/README.md</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">@@ -1,3 +1,4 @@</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">+this is an actual diff file</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">-all contents will remain unmodified</div></div><div class="ec-line" style="--ecIndent:1ch"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span class="indent"> </span>no whitespace will be removed either</div></div></code></pre></div>

#### Combining syntax highlighting with diff-like syntax

<div class="expressive-code"><pre data-language="diff" class="wrap" style="--ecMaxLine:56ch"><code><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code"><span class="indent">  </span>function thisIsJavaScript() {</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span class="indent">    </span>// This entire block gets highlighted as JavaScript,</div></div><div class="ec-line" style="--ecIndent:4ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">    </span>// and we can still add diff markers to it!</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">-   console.log('Old code to be removed')</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">+   console.log('New and shiny code!')</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code"><span class="indent">  </span>}</div></div></code></pre></div>

#### Marking individual text inside lines

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:60ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">function demo() {</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span class="indent">  </span>// Mark any given text inside lines</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>return 'Multiple matches of the given text are supported';</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">}</div></div></code></pre></div>

#### Regular expressions

<div class="expressive-code"><pre data-language="ts" class="wrap" style="--ecMaxLine:52ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">console.log('The words yes and yep will be marked.')</div></div></code></pre></div>

#### Escaping forward slashes

<div class="expressive-code"><pre data-language="sh" class="wrap" style="--ecMaxLine:28ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">echo &quot;Test&quot; &gt; /home/test.txt</div></div></code></pre></div>

#### Selecting inline marker types (mark, ins, del)

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:61ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">function demo() {</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code"><span class="indent">  </span>console.log('These are inserted and deleted marker types');</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>// The return statement uses the default marker type</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code"><span class="indent">  </span>return true;</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">}</div></div></code></pre></div>

### Word Wrap

[Word Wrap](https://expressive-code.com/key-features/word-wrap/)

#### Configuring word wrap per block

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:133ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// Example with wrap</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">function getLongString() {</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">}</div></div></code></pre></div>

---

<div class="expressive-code"><pre data-language="js"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// Example with wrap=false</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">function getLongString() {</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">}</div></div></code></pre></div>

#### Configuring indentation of wrapped lines

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:133ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// Example with preserveIndent (enabled by default)</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">function getLongString() {</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">}</div></div></code></pre></div>

---

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:133ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// Example with preserveIndent=false</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">function getLongString() {</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code"><span class="indent">  </span>return 'This is a very long string that will most probably not fit into the available space unless the container is extremely wide'</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">}</div></div></code></pre></div>

## Collapsible Sections

[Collapsible Sections](https://expressive-code.com/plugins/collapsible-sections/)

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:68ch"><code><details class="ec-section github"><summary><div class="ec-line"><div class="gutter"><div class="ln"></div></div><div class="code"><span class="expand"></span><span class="collapse"></span><span class="text">5 collapsed lines</span></div></div></summary><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// All this boilerplate setup code will be collapsed</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">import { someBoilerplateEngine } from '@example/some-boilerplate'</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">import { evenMoreBoilerplate } from '@example/even-more-boilerplate'</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">4</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">const engine = someBoilerplateEngine(evenMoreBoilerplate())</div></div></details><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">7</div></div><div class="code">// This part of the code will be visible by default</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">8</div></div><div class="code">engine.doSomething(1, 2, 3, calcFn)</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">9</div></div><div class="code">
</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">10</div></div><div class="code">function calcFn() {</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">11</div></div><div class="code"><span class="indent">  </span>// You can have multiple collapsed sections</div></div><details class="ec-section github"><summary><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln"></div></div><div class="code"><span class="expand"></span><span class="collapse"></span><span class="text">3 collapsed lines</span></div></div></summary><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">12</div></div><div class="code"><span class="indent">  </span>const a = 1</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">13</div></div><div class="code"><span class="indent">  </span>const b = 2</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">14</div></div><div class="code"><span class="indent">  </span>const c = a + b</div></div></details><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">15</div></div><div class="code">
</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">16</div></div><div class="code"><span class="indent">  </span>// This will remain visible</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">17</div></div><div class="code"><span class="indent">  </span>console.log(`Calculation result: ${a} + ${b} = ${c}`)</div></div><div class="ec-line" style="--ecIndent:2ch"><div class="gutter"><div class="ln" aria-hidden="true">18</div></div><div class="code"><span class="indent">  </span>return c</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">19</div></div><div class="code">}</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">20</div></div><div class="code">
</div></div><details class="ec-section github"><summary><div class="ec-line"><div class="gutter"><div class="ln"></div></div><div class="code"><span class="expand"></span><span class="collapse"></span><span class="text">4 collapsed lines</span></div></div></summary><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">21</div></div><div class="code">// All this code until the end of the block will be collapsed again</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">22</div></div><div class="code">engine.closeConnection()</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">23</div></div><div class="code">engine.freeMemory()</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">24</div></div><div class="code">engine.shutdown({ reason: 'End of example boilerplate code' })</div></div></details></code></pre></div>

## Line Numbers

[Line Numbers](https://expressive-code.com/plugins/line-numbers/)

### Displaying line numbers per block

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:41ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">1</div></div><div class="code">// This code block will show line numbers</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">2</div></div><div class="code">console.log('Greetings from line 2!')</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">3</div></div><div class="code">console.log('I am on line 3')</div></div></code></pre></div>

---

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:52ch"><code><div class="ec-line"><div class="code">// Line numbers are disabled for this block</div></div><div class="ec-line"><div class="code">console.log('Hello?')</div></div><div class="ec-line"><div class="code">console.log('Sorry, do you know what line I am on?')</div></div></code></pre></div>

### Changing the starting line number

<div class="expressive-code"><pre data-language="js" class="wrap" style="--ecMaxLine:37ch"><code><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">5</div></div><div class="code">console.log('Greetings from line 5!')</div></div><div class="ec-line"><div class="gutter"><div class="ln" aria-hidden="true">6</div></div><div class="code">console.log('I am on line 6')</div></div></code></pre></div>
