import path from 'path';
import { cwdDir, externals, getBuildinfo, getSomeBuildConfigCwd, globals } from './shared'
import { InlineConfig, build, createServer, mergeConfig, build as viteBuild } from 'vite'
import viteVueJsxPlugin from "@vitejs/plugin-vue-jsx"
import viteVuePlugin from "@vitejs/plugin-vue"
import dtsPlugin from "vite-plugin-dts"
import { LibCss } from './lib-css';

export default async function () {
    console.log(`检测到组件库`)
    console.log(`打包es组件库`)
    const viteConfigES = getConfig(true)
    await build(viteConfigES)
    console.log(`打包cjs组件库`)
    const viteConfigCJS = getConfig(false)
    await build(viteConfigCJS)

}

function getVue3CommonConfig() {
    const viteConfig: InlineConfig = {
        configFile: false, // 禁用自动解析，不去寻找vite.config.ts
        plugins: [
            viteVueJsxPlugin()
        ]
    }

    return viteConfig
}

function getConfig(isEsm: boolean) {
    let _config = getBuildinfo()
    const config = getSomeBuildConfigCwd()
    const alias = config.config?.alias ?? {}
    for (const key in alias) {
        if (Object.prototype.hasOwnProperty.call(alias, key)) {
            const element = alias[key];
            alias[key] = path.resolve(cwdDir, element)
        }
    }
    const viteObject = config.config?.vite ?? {}

    const viteConfig: InlineConfig = mergeConfig(mergeConfig(getVue3CommonConfig(), {
        root: cwdDir,
        logLevel: 'error',
        resolve: {
            alias: {
                ...alias
            },
        },
        plugins: [
            viteVuePlugin({ isProduction: true }),
            dtsPlugin({ outputDir: path.resolve(_config.outDir, isEsm ? 'es' : 'lib') }),
            LibCss()
        ],
        build: {
            sourcemap: 'inline',
            outDir: path.resolve(_config.outDir, isEsm ? 'es' : 'lib'),
            cssCodeSplit: true,
            emptyOutDir: true,
            lib: {
                entry: _config.entry,
                fileName: () => isEsm ? `[name].mjs` : '[name].js',
                formats: [isEsm ? 'es' : 'cjs'],
            },
            rollupOptions: {
                external: (id) => {
                    if (externals.includes(id)) {
                        return true
                    }
                    return false
                },
                output: {
                    preserveModules: true,
                    preserveModulesRoot: path.resolve(_config.outDir, isEsm ? 'es' : 'lib'),
                    assetFileNames(chunkInfo) {
                        console.log(chunkInfo);

                        const name = chunkInfo.name.split("?")[0].split(".").slice(0, -1).join(".")
                        return `${_config.componentsName}/${name}/style/style.css`
                    },
                    globals: (id: string) => {
                        if (globals[id]) return globals[id]
                    },
                    exports: 'named',
                }
            },
        },
    } as InlineConfig), viteObject)
    return viteConfig
}