import { InlineConfig, mergeConfig } from "vite"
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import path from "node:path"
import { getBuildConfig, getBuildinfo, getOtherinfo } from "../shared"
import libCss from './vite-plugin-libcss'

export function getConfig() {
    const buildInfo = getBuildinfo()
    const botherInfo = getOtherinfo()
    const _config = getBuildConfig()
    const isDev = !!process.env.WATCH
    let watch: any = false
    if (isDev) {
        watch = {
            buildDelay: 0,
            clearScreen: true,
            include: 'src/**',
            skipWrite: false
        }
    }
    const viteConfig: InlineConfig = {
        configFile: false,
        plugins: [
            vue({ isProduction: !isDev }),
            vueJsx(),
            libCss(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(process.cwd(), './src')
            },
        },
        build: {
            sourcemap: true,
            outDir: buildInfo.outDir,
            cssCodeSplit: false,
            emptyOutDir: false,
            watch,
            lib: {
                entry: buildInfo.entry,
                name: buildInfo.name,
                fileName: (format) => {
                    return `${format}/${buildInfo.fileName}.js`
                },
                // fileName: (format) => {
                //     return `${buildInfo.name}.${format}.js`
                // },
                // formats: isDev ? ['es'] : ['es', 'umd'],
                formats: isDev ? ['es'] : ['es', "cjs"],
            },
            rollupOptions: {
                external: botherInfo.externals.map(v => new RegExp(`^${v}`)),
                output: {
                    globals: botherInfo.globals,
                    exports: 'named',
                },
            },
        },
    }
    if (!isDev) {
        viteConfig.plugins.push(dts({
            outputDir: buildInfo.outDir,
            staticImport: true,
            skipDiagnostics: false,
            insertTypesEntry: true
        }))
    }
    return mergeConfig(viteConfig, _config)
}
