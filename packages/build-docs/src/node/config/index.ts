import {
    InlineConfig,
    mergeConfig,
    normalizePath,
    searchForWorkspaceRoot,
} from 'vite'
import viteVueJsxPlugin from '@vitejs/plugin-vue-jsx'
import viteVuePlugin from '@vitejs/plugin-vue'
import viteMd from 'vite-plugin-md'
import vitePluginWindicss from 'vite-plugin-windicss'
import hljs from 'highlight.js'
import { clientDir, cwdDir, getConfig, rootDir } from '@/shared'
import path from 'node:path'
import fs from 'fs-extra'
import FastGlob from 'fast-glob'
import { vitePluginVirtualEntry } from './plugins/vite-plugin-virtual-entry'
import { genDesktopFiles } from './plugins/gen-desktop-files'
import type MarkdownIt from 'markdown-it'
import { createRequire } from 'node:module'

function getVue3CommonConfig() {
    const viteConfig: InlineConfig = {
        configFile: false, // 禁用自动解析，不去寻找vite.config.ts
        plugins: [viteVueJsxPlugin()],
    }

    return viteConfig
}

export async function getDevConfig(
    isSSR: boolean = false,
    isPreRender: boolean = false
) {
    const config = getConfig()
    let alias = config.config.alias
    const viteObject = config.config.vite ?? {}
    for (const key in alias) {
        if (Object.prototype.hasOwnProperty.call(alias, key)) {
            const element = alias[key]
            alias[key] = path.resolve(cwdDir, element)
        }
    }
    const DEFAULT_THEME_PATH = path.resolve(
        clientDir,
        './desktop/theme-default'
    )
    const themeDir = (await fs.pathExists(
        path.resolve(cwdDir, './.anybuild/theme')
    ))
        ? path.resolve(cwdDir, './.anybuild/theme')
        : DEFAULT_THEME_PATH

    alias = {
        ...alias,
        'anybuild/vite/desktop/theme': path.resolve(
            DEFAULT_THEME_PATH,
            `index.${__DEV__ ? 'ts' : 'js'}`
        ),
        '@desktop': path.resolve(clientDir, './desktop'),
        '@theme': themeDir,
        '@simulator': path.resolve(cwdDir, './.anybuild/simulator'),
        '@root': path.resolve(cwdDir),
        // ssr不指定
    }
    if (!isSSR && !isPreRender) {
        alias['vue'] = path.resolve(
            rootDir,
            'node_modules/vue',
            'dist',
            'vue.runtime.esm-bundler.js'
        )
    }

    let inputHtml: any = {
        main: path.resolve(clientDir, './index.html'),
    }
    const htmls = FastGlob.sync('*.html', {
        cwd: clientDir,
        ignore: ['!index.html'],
    })
    for (let i = 0; i < htmls.length; i++) {
        const htmlPath = normalizePath(path.resolve(clientDir, htmls[i]))
        const [, name] = htmlPath.match(/(?<=\/(.*?))\.html$/) // 反向肯定匹配，获取文件名
        inputHtml[name] = htmlPath
    }
    if (isSSR) {
        let simulatorHTML = inputHtml['simulator']
        let mainHTML = inputHtml['main']
        inputHtml = {
            // TODO 参考vitepress
            app: isPreRender
                ? `${normalizePath(
                      path.resolve(clientDir, './desktop/main.ts')
                  )}`
                : `${normalizePath(
                      path.resolve(
                          clientDir,
                          `./desktop/ssr.${__DEV__ ? 'ts' : 'js'}`
                      )
                  )}`,
            // main: `${normalizePath(path.resolve(clientDir, './desktop'))}/main.ts`,
            // simulator: `${normalizePath(path.resolve(clientDir, './simulator'))}/main.ts`,
        }
        if (isPreRender) {
            inputHtml = {}
            // 模拟器需要直接输出
            inputHtml['simulator'] = simulatorHTML
            inputHtml['main'] = mainHTML
        }
    }
    let outDir = path.resolve(cwdDir, './.anybuild/dist')
    if (isSSR && !isPreRender) {
        outDir = path.resolve(cwdDir, './.anybuild/.tempDir')
    }
    const viteConfig: InlineConfig = mergeConfig(
        mergeConfig(getVue3CommonConfig(), {
            // root: cwdDir,
            resolve: {
                alias,
            },
            css: {
                preprocessorOptions: {
                    scss: {
                        additionalData: `@import "@desktop/assets/style/global.scss";`,
                    },
                },
            },
            optimizeDeps: {
                // https://cn.vitejs.dev/config/dep-optimization-options.html#optimizedeps-entries
                // 可以看到node_modules的文件会被忽略。所以需要使其不被忽略
                entries: ['!node_modules/anybuild'],
            },
            build: {
                html: {},
                emptyOutDir: true,
                outDir: outDir,
                ssrManifest: isSSR && !isPreRender,
                ssr: isSSR && !isPreRender,
                rollupOptions: {
                    input: {
                        ...inputHtml,
                    },
                    output: isSSR
                        ? !isPreRender
                            ? {
                                  entryFileNames: '[name].js',
                              }
                            : {}
                        : {},
                    // input: {
                    //     main: `${normalizePath(path.resolve(clientDir, './desktop'))}/main.ts`,
                    //     simulator: `${normalizePath(path.resolve(clientDir, './simulator'))}/main.ts`,
                    // }
                },
            },
            publicDir:
                isSSR && !isPreRender
                    ? false
                    : path.resolve(clientDir, './public'),
            server: {
                fs: {
                    allow: [cwdDir, clientDir, searchForWorkspaceRoot(cwdDir)],
                },
            },
            plugins: [
                vitePluginVirtualEntry(),
                // {
                //     name: 'vite-plugin-html',
                //     transformIndexHtml: {
                //         enforce: 'pre',
                //         transform(html) {
                //             return lodash.template(html)({
                //                 title: "MK"
                //             });
                //         },
                //     },
                // },
                // genDesktopDemos(),
                viteVuePlugin({
                    isProduction: false,
                    include: [/\.vue$/, /\.md$/],
                }),
                viteMd({
                    wrapperClasses: 'van-doc-markdown-body',
                    transforms: {
                        after(htmlCode: string, id: string) {
                            let startTemplate =
                                htmlCode.indexOf('<template>') +
                                '<template>'.length
                            let endTemplate =
                                htmlCode.lastIndexOf('</template>')
                            const tCode = htmlCode.slice(
                                startTemplate,
                                endTemplate
                            )
                            const group = tCode
                                .replace(/<h3/g, ':::<h3')
                                .replace(/<h2/g, ':::<h2')
                                .split(':::')
                            const code = group
                                .map((fragment) => {
                                    if (fragment.indexOf('<h3') !== -1) {
                                        return `<div class="van-doc-card">${fragment}</div>`
                                    }
                                    return fragment
                                })
                                .join('')
                            return (
                                htmlCode.slice(0, startTemplate) +
                                code +
                                htmlCode.slice(endTemplate)
                            )
                        },
                    },
                    markdownItOptions: {
                        typographer: false, // https://markdown-it.github.io/markdown-it/#MarkdownIt
                        highlight(str: string, lang: string) {
                            if (lang && hljs.getLanguage(lang)) {
                                // https://github.com/highlightjs/highlight.js/issues/2277
                                return hljs.highlight(str, {
                                    language: lang,
                                    ignoreIllegals: true,
                                }).value
                            }
                            return ''
                        },
                    },
                    markdownItSetup(md: MarkdownIt) {
                        const require = createRequire(import.meta.url)
                        const { slugify } = require('transliteration')
                        const markdownItAnchor = require('markdown-it-anchor')

                        ;(function markdownLinkOpen(md: MarkdownIt) {
                            const defaultRender = md.renderer.rules.link_open

                            md.renderer.rules.link_open = (
                                tokens,
                                idx,
                                options,
                                env,
                                self
                            ) => {
                                const aIndex = tokens[idx].attrIndex('target')
                                if (aIndex < 0) {
                                    tokens[idx].attrPush(['target', '_blank']) // add new attribute
                                }
                                if (defaultRender) {
                                    return defaultRender(
                                        tokens,
                                        idx,
                                        options,
                                        env,
                                        self
                                    )
                                }
                                return self.renderToken(tokens, idx, options)
                            }
                        })(md)

                        md.use(markdownItAnchor, {
                            level: 2,
                            slugify,
                        })
                    },
                }),
                vitePluginWindicss({
                    scan: {
                        dirs: [
                            path.resolve(clientDir, './desktop'),
                            path.resolve(clientDir, './simulator'),
                        ],
                        fileExtensions: ['vue', 'tsx'],
                    },
                }),
                genDesktopFiles(),
            ],
        } as InlineConfig),
        viteObject
    )

    return viteConfig
}
