import path from 'path'
import {
    cwdDir,
    externals,
    getBuildinfo,
    getSomeBuildConfigCwd,
    globals,
} from './shared'
import { InlineConfig, build, mergeConfig } from 'vite'
import viteVueJsxPlugin from '@vitejs/plugin-vue-jsx'
import viteVuePlugin from '@vitejs/plugin-vue'
import dtsPlugin from 'vite-plugin-dts'
// import { LibCss } from './lib-css'
import postcssPresetEnv from 'postcss-preset-env'
import autoprefixer from 'autoprefixer'
import { readdirSync, existsSync } from 'fs'

export {
    defineConfig
} from './shared'

export default async function () {

    let _config = getBuildinfo()
    if (_config.singleTheme && existsSync(path.resolve(cwdDir, _config.singleTheme))) {
        console.log(`打包单个组件样式`)
        const styleConfig = getStyleConfig()
        await build(styleConfig)
    }
    if (_config.theme && existsSync(path.resolve(cwdDir, _config.theme))) {
        console.log(`打包统一样式`)
        const themeConfig = getThemeConfig()
        await build(themeConfig)
    }

    const viteConfig = getConfig()
    console.log(`打包组件库`)
    await build(viteConfig)
    console.log(`打包完成`)
}
function getThemeConfig() {
    let _config = getBuildinfo()
    const viteConfig: InlineConfig = {
        /** 针对 css 的配置项 */
        css: {
            /**
             * 配置 postcss
             *
             * @see css.postcss https://cn.vitejs.dev/config/shared-options.html#css-postcss
             */
            postcss: {
                plugins: [
                    /**
                     * 针对一些前沿的 css 进行降级
                     *
                     * @see postcss-preset-env https://www.npmjs.com/package/postcss-preset-env
                     */
                    postcssPresetEnv(),
                    /**
                     * 自动添加浏览器厂商前缀
                     *
                     * @see autoprefixer https://www.npmjs.com/package/autoprefixer
                     */
                    autoprefixer(),
                ],
            },
            /**
             * @see css.preprocessorOptions https://cn.vitejs.dev/config/shared-options.html#css-preprocessoroptions
             */
            preprocessorOptions: {
                scss: {
                    additionalData: '',
                },
            },
            /**
             * @see css.modules https://cn.vitejs.dev/config/shared-options.html#css-modules
             */
            modules: {
                scopeBehaviour: 'local',
            },
        },
        build: {
            emptyOutDir: false,
            rollupOptions: {
                input: _config.theme,
                output: {
                    assetFileNames: 'index.css',
                }
            },
        },
    }
    return viteConfig
}
function getStyleConfig() {
    let _config = getBuildinfo()
    const input: string = path.resolve(_config.singleTheme)
    const viteConfig: InlineConfig = {
        /** 针对 css 的配置项 */
        css: {
            /**
             * 配置 postcss
             *
             * @see css.postcss https://cn.vitejs.dev/config/shared-options.html#css-postcss
             */
            postcss: {
                plugins: [
                    /**
                     * 针对一些前沿的 css 进行降级
                     *
                     * @see postcss-preset-env https://www.npmjs.com/package/postcss-preset-env
                     */
                    postcssPresetEnv(),
                    /**
                     * 自动添加浏览器厂商前缀
                     *
                     * @see autoprefixer https://www.npmjs.com/package/autoprefixer
                     */
                    autoprefixer(),
                ],
            },
            /**
             * @see css.preprocessorOptions https://cn.vitejs.dev/config/shared-options.html#css-preprocessoroptions
             */
            preprocessorOptions: {
                scss: {
                    additionalData: '',
                },
            },
            /**
             * @see css.modules https://cn.vitejs.dev/config/shared-options.html#css-modules
             */
            modules: {
                scopeBehaviour: 'local',
            },
        },
        build: {
            emptyOutDir: false,
            assetsDir: 'theme',
            rollupOptions: {
                input: readdirSync(input).map((name): string => {
                    return `${input}/${name}`
                }),
                output: {
                    assetFileNames: 'theme/[name].[ext]',
                }
            },
        },
    }
    return viteConfig
}

function getVue3CommonConfig() {
    const viteConfig: InlineConfig = {
        configFile: false, // 禁用自动解析，不去寻找vite.config.ts
        plugins: [viteVueJsxPlugin()],
    }
    return viteConfig
}

function getConfig() {
    let _config = getBuildinfo()
    const config = getSomeBuildConfigCwd()
    const alias = config.config?.alias ?? {}
    for (const key in alias) {
        if (Object.prototype.hasOwnProperty.call(alias, key)) {
            const element = alias[key]
            alias[key] = path.resolve(cwdDir, element)
        }
    }
    const viteObject = config.config?.vite ?? {}
    const viteConfig: InlineConfig = mergeConfig(
        mergeConfig(getVue3CommonConfig(), {
            root: cwdDir,
            logLevel: 'error',
            resolve: {
                alias: {
                    ...alias,
                },
            },
            plugins: [
                viteVuePlugin({ isProduction: true }),
                dtsPlugin({
                    outputDir: [path.resolve(_config.outDir, 'es'), path.resolve(_config.outDir, 'lib')],
                }),
                // LibCss(),
            ],
            build: {
                sourcemap: true,
                cssCodeSplit: true,
                emptyOutDir: false,
                lib: {
                    entry: _config.entry,
                },
                rollupOptions: {
                    external: (id) => {
                        if (externals.includes(id)) {
                            return true
                        }
                        return false
                    },
                    output: [
                        {
                            name: _config.name /** 包名 */,
                            format: 'umd',
                            exports: 'named',
                            dir: path.resolve(_config.outDir),
                            entryFileNames: 'index.umd.js',
                            chunkFileNames: '[name].js',
                            globals: (id: string) => {
                                if (globals[id]) return globals[id]
                            },
                            generatedCode: true,
                        },
                        {
                            format: 'es',
                            dir: path.resolve(_config.outDir, 'es'),
                            preserveModules: true,
                            entryFileNames: '[name].mjs',
                            chunkFileNames: '[name].mjs',
                            exports: 'named',
                            assetFileNames(chunkInfo) {
                                if (_config.componentsName && chunkInfo.type === "asset") {
                                    const name = chunkInfo.name.split("?")[0].split(".").slice(0, -1).join(".")
                                    return `${_config.componentsName}/${name}/style/style.css`
                                }
                                return "[name].[ext]"
                            },
                            globals: (id: string) => {
                                if (globals[id]) return globals[id]
                            },
                            generatedCode: true,
                        },
                        {
                            format: 'cjs',
                            exports: 'named',
                            dir: path.resolve(_config.outDir, 'lib'),
                            sourcemap: false,
                            entryFileNames: '[name].js',
                            chunkFileNames: '[name].js',
                            preserveModules: true,
                            generatedCode: true,
                            assetFileNames(chunkInfo) {
                                if (_config.componentsName && chunkInfo.type === "asset") {
                                    const name = chunkInfo.name.split("?")[0].split(".").slice(0, -1).join(".")
                                    return `${_config.componentsName}/${name}/style/style.css`
                                }
                                return "[name].[ext]"
                            },
                        },
                    ],
                },
            },
        } as InlineConfig),
        viteObject
    )
    return viteConfig
}
