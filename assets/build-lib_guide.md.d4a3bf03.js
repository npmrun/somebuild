import{_ as s,o as n,c as a,O as l}from"./chunks/framework.7faa710e.js";const B=JSON.parse('{"title":"build-lib","description":"","frontmatter":{},"headers":[],"relativePath":"build-lib/guide.md","filePath":"build-lib/guide.md","lastUpdated":1686979861000}'),p={name:"build-lib/guide.md"},o=l(`<h1 id="build-lib" tabindex="-1">build-lib <a class="header-anchor" href="#build-lib" aria-label="Permalink to &quot;build-lib&quot;">​</a></h1><h2 id="导览" tabindex="-1">导览 <a class="header-anchor" href="#导览" aria-label="Permalink to &quot;导览&quot;">​</a></h2><p>该库主要是为了构建一个基本js库</p><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki vitesse-dark vp-code-dark"><code><span class="line"><span style="color:#dbd7caee;">pnpm i @somebuild/build-lib -D</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#393a34;">pnpm i @somebuild/build-lib -D</span></span></code></pre></div><h2 id="使用说明" tabindex="-1">使用说明 <a class="header-anchor" href="#使用说明" aria-label="Permalink to &quot;使用说明&quot;">​</a></h2><p>目前版本需要在根目录下的<code>package.json</code>中定义一个<code>buildinfo</code>字段，其类型如下：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki vitesse-dark vp-code-dark"><code><span class="line"><span style="color:#CB7676;">interface</span><span style="color:#DBD7CAEE;"> </span><span style="color:#5DA9A7;">IBuildInfoTsup</span><span style="color:#DBD7CAEE;"> </span><span style="color:#666666;">{</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#BD976A;">engine</span><span style="color:#CB7676;">?</span><span style="color:#666666;">: </span><span style="color:#C98A7D99;">&#39;</span><span style="color:#C98A7D;">tsup</span><span style="color:#C98A7D99;">&#39;</span><span style="color:#666666;"> </span><span style="color:#758575DD;">// 使用tsup引擎，后续可能会有其他编译器加入</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#BD976A;">mode</span><span style="color:#666666;">: </span><span style="color:#C98A7D99;">&#39;</span><span style="color:#C98A7D;">lib</span><span style="color:#C98A7D99;">&#39;</span><span style="color:#666666;"> </span><span style="color:#758575DD;">// 表明是库模式</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#BD976A;">outDir</span><span style="color:#666666;">: </span><span style="color:#5DA9A7;">string</span><span style="color:#666666;"> </span><span style="color:#758575DD;">// 编译后输出的位置</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#BD976A;">name</span><span style="color:#666666;">: </span><span style="color:#5DA9A7;">string</span><span style="color:#666666;"> </span><span style="color:#758575DD;">// 该库的名字变量</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#BD976A;">entry</span><span style="color:#666666;">: </span><span style="color:#5DA9A7;">string</span><span style="color:#666666;">[] | </span><span style="color:#5DA9A7;">Record</span><span style="color:#666666;">&lt;</span><span style="color:#5DA9A7;">string</span><span style="color:#666666;">, </span><span style="color:#5DA9A7;">string</span><span style="color:#666666;">&gt; | </span><span style="color:#5DA9A7;">string</span><span style="color:#666666;"> </span><span style="color:#758575DD;">// 库的入口</span></span>
<span class="line"><span style="color:#666666;">}</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#AB5959;">interface</span><span style="color:#393A34;"> </span><span style="color:#2E808F;">IBuildInfoTsup</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B07D48;">engine</span><span style="color:#AB5959;">?</span><span style="color:#999999;">: </span><span style="color:#B5695999;">&#39;</span><span style="color:#B56959;">tsup</span><span style="color:#B5695999;">&#39;</span><span style="color:#999999;"> </span><span style="color:#A0ADA0;">// 使用tsup引擎，后续可能会有其他编译器加入</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B07D48;">mode</span><span style="color:#999999;">: </span><span style="color:#B5695999;">&#39;</span><span style="color:#B56959;">lib</span><span style="color:#B5695999;">&#39;</span><span style="color:#999999;"> </span><span style="color:#A0ADA0;">// 表明是库模式</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B07D48;">outDir</span><span style="color:#999999;">: </span><span style="color:#2E808F;">string</span><span style="color:#999999;"> </span><span style="color:#A0ADA0;">// 编译后输出的位置</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B07D48;">name</span><span style="color:#999999;">: </span><span style="color:#2E808F;">string</span><span style="color:#999999;"> </span><span style="color:#A0ADA0;">// 该库的名字变量</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B07D48;">entry</span><span style="color:#999999;">: </span><span style="color:#2E808F;">string</span><span style="color:#999999;">[] | </span><span style="color:#2E808F;">Record</span><span style="color:#999999;">&lt;</span><span style="color:#2E808F;">string</span><span style="color:#999999;">, </span><span style="color:#2E808F;">string</span><span style="color:#999999;">&gt; | </span><span style="color:#2E808F;">string</span><span style="color:#999999;"> </span><span style="color:#A0ADA0;">// 库的入口</span></span>
<span class="line"><span style="color:#999999;">}</span></span></code></pre></div><p>作为开箱即用的工具，做的不够好，目前最好都定义一下这几个字段：</p><div class="language-json vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">json</span><pre class="shiki vitesse-dark vp-code-dark"><code><span class="line"><span style="color:#666666;">{</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#FDAEB7;font-style:italic;">engine</span><span style="color:#666666;">:</span><span style="color:#DBD7CAEE;"> </span><span style="color:#C98A7D99;">&quot;</span><span style="color:#C98A7D;">tsup</span><span style="color:#C98A7D99;">&quot;</span><span style="color:#666666;">,</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#FDAEB7;font-style:italic;">mode</span><span style="color:#666666;">:</span><span style="color:#DBD7CAEE;"> </span><span style="color:#C98A7D99;">&quot;</span><span style="color:#C98A7D;">lib</span><span style="color:#C98A7D99;">&quot;</span><span style="color:#666666;">,</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#FDAEB7;font-style:italic;">outDir</span><span style="color:#666666;">:</span><span style="color:#DBD7CAEE;"> </span><span style="color:#C98A7D99;">&quot;</span><span style="color:#C98A7D;">./dist</span><span style="color:#C98A7D99;">&quot;</span><span style="color:#666666;">,</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#FDAEB7;font-style:italic;">name</span><span style="color:#666666;">:</span><span style="color:#DBD7CAEE;"> </span><span style="color:#FDAEB7;font-style:italic;">allinfo.pkgInfo.name</span><span style="color:#666666;">,</span></span>
<span class="line"><span style="color:#DBD7CAEE;">    </span><span style="color:#FDAEB7;font-style:italic;">entry</span><span style="color:#666666;">:</span><span style="color:#DBD7CAEE;"> </span><span style="color:#C98A7D99;">&quot;</span><span style="color:#C98A7D;">./src/index.ts</span><span style="color:#C98A7D99;">&quot;</span></span>
<span class="line"><span style="color:#666666;">}</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#999999;">{</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B31D28;font-style:italic;">engine</span><span style="color:#999999;">:</span><span style="color:#393A34;"> </span><span style="color:#B5695999;">&quot;</span><span style="color:#B56959;">tsup</span><span style="color:#B5695999;">&quot;</span><span style="color:#999999;">,</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B31D28;font-style:italic;">mode</span><span style="color:#999999;">:</span><span style="color:#393A34;"> </span><span style="color:#B5695999;">&quot;</span><span style="color:#B56959;">lib</span><span style="color:#B5695999;">&quot;</span><span style="color:#999999;">,</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B31D28;font-style:italic;">outDir</span><span style="color:#999999;">:</span><span style="color:#393A34;"> </span><span style="color:#B5695999;">&quot;</span><span style="color:#B56959;">./dist</span><span style="color:#B5695999;">&quot;</span><span style="color:#999999;">,</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B31D28;font-style:italic;">name</span><span style="color:#999999;">:</span><span style="color:#393A34;"> </span><span style="color:#B31D28;font-style:italic;">allinfo.pkgInfo.name</span><span style="color:#999999;">,</span></span>
<span class="line"><span style="color:#393A34;">    </span><span style="color:#B31D28;font-style:italic;">entry</span><span style="color:#999999;">:</span><span style="color:#393A34;"> </span><span style="color:#B5695999;">&quot;</span><span style="color:#B56959;">./src/index.ts</span><span style="color:#B5695999;">&quot;</span></span>
<span class="line"><span style="color:#999999;">}</span></span></code></pre></div><h2 id="定义一个命令行" tabindex="-1">定义一个命令行 <a class="header-anchor" href="#定义一个命令行" aria-label="Permalink to &quot;定义一个命令行&quot;">​</a></h2><p>此模式上面的字段都一样，但是需要在根目录创建一个<code>somebuild.config.mts</code>文件，其内容如下：</p><div class="language-ts vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki vitesse-dark vp-code-dark"><code><span class="line"><span style="color:#4D9375;">import</span><span style="color:#DBD7CAEE;"> </span><span style="color:#666666;">{</span><span style="color:#DBD7CAEE;"> </span><span style="color:#BD976A;">defineRootConfig</span><span style="color:#DBD7CAEE;"> </span><span style="color:#666666;">}</span><span style="color:#DBD7CAEE;"> </span><span style="color:#4D9375;">from</span><span style="color:#DBD7CAEE;"> </span><span style="color:#C98A7D99;">&#39;</span><span style="color:#C98A7D;">somebuild</span><span style="color:#C98A7D99;">&#39;</span></span>
<span class="line"><span style="color:#4D9375;">import</span><span style="color:#DBD7CAEE;"> </span><span style="color:#666666;">{</span><span style="color:#DBD7CAEE;"> </span><span style="color:#BD976A;">defineConfig</span><span style="color:#DBD7CAEE;"> </span><span style="color:#4D9375;">as</span><span style="color:#DBD7CAEE;"> </span><span style="color:#BD976A;">defineLibConfig</span><span style="color:#DBD7CAEE;"> </span><span style="color:#666666;">}</span><span style="color:#DBD7CAEE;"> </span><span style="color:#4D9375;">from</span><span style="color:#DBD7CAEE;"> </span><span style="color:#C98A7D99;">&#39;</span><span style="color:#C98A7D;">@somebuild/build-lib</span><span style="color:#C98A7D99;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#4D9375;">export</span><span style="color:#DBD7CAEE;"> </span><span style="color:#4D9375;">default</span><span style="color:#DBD7CAEE;"> </span><span style="color:#80A665;">defineRootConfig</span><span style="color:#666666;">({</span></span>
<span class="line"><span style="color:#666666;">    </span><span style="color:#B8A965;">lib</span><span style="color:#666666;">: </span><span style="color:#80A665;">defineLibConfig</span><span style="color:#666666;">({</span></span>
<span class="line"><span style="color:#666666;">        </span><span style="color:#B8A965;">bin</span><span style="color:#666666;">: </span><span style="color:#4D9375;">true</span><span style="color:#666666;"> </span><span style="color:#758575DD;">// 此时，会在输出的文件中添加 #!/usr/bin/env node</span></span>
<span class="line"><span style="color:#666666;">    }),</span></span>
<span class="line"><span style="color:#666666;">})</span></span></code></pre><pre class="shiki vitesse-light vp-code-light"><code><span class="line"><span style="color:#1E754F;">import</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">defineRootConfig</span><span style="color:#393A34;"> </span><span style="color:#999999;">}</span><span style="color:#393A34;"> </span><span style="color:#1E754F;">from</span><span style="color:#393A34;"> </span><span style="color:#B5695999;">&#39;</span><span style="color:#B56959;">somebuild</span><span style="color:#B5695999;">&#39;</span></span>
<span class="line"><span style="color:#1E754F;">import</span><span style="color:#393A34;"> </span><span style="color:#999999;">{</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">defineConfig</span><span style="color:#393A34;"> </span><span style="color:#1E754F;">as</span><span style="color:#393A34;"> </span><span style="color:#B07D48;">defineLibConfig</span><span style="color:#393A34;"> </span><span style="color:#999999;">}</span><span style="color:#393A34;"> </span><span style="color:#1E754F;">from</span><span style="color:#393A34;"> </span><span style="color:#B5695999;">&#39;</span><span style="color:#B56959;">@somebuild/build-lib</span><span style="color:#B5695999;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#1E754F;">export</span><span style="color:#393A34;"> </span><span style="color:#1E754F;">default</span><span style="color:#393A34;"> </span><span style="color:#59873A;">defineRootConfig</span><span style="color:#999999;">({</span></span>
<span class="line"><span style="color:#999999;">    </span><span style="color:#998418;">lib</span><span style="color:#999999;">: </span><span style="color:#59873A;">defineLibConfig</span><span style="color:#999999;">({</span></span>
<span class="line"><span style="color:#999999;">        </span><span style="color:#998418;">bin</span><span style="color:#999999;">: </span><span style="color:#1E754F;">true</span><span style="color:#999999;"> </span><span style="color:#A0ADA0;">// 此时，会在输出的文件中添加 #!/usr/bin/env node</span></span>
<span class="line"><span style="color:#999999;">    }),</span></span>
<span class="line"><span style="color:#999999;">})</span></span></code></pre></div>`,13),e=[o];function t(c,r,y,i,D,A){return n(),a("div",null,e)}const u=s(p,[["render",t]]);export{B as __pageData,u as default};