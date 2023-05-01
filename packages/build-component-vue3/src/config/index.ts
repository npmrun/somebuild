import { InlineConfig } from "vite"
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import path from "node:path"
import { getBuildinfo, getOtherinfo } from "../shared"

export function getConfig() {
    const buildInfo = getBuildinfo()
    const botherInfo = getOtherinfo()
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
            vueJsx()
        ],
        resolve: {
            alias: {
                '@': path.resolve(process.cwd(), './src')
            },
        },
        build: {
            sourcemap: 'inline',
            outDir: buildInfo.outDir,
            cssCodeSplit: false,
            emptyOutDir: false,
            watch,
            lib: {
                entry: buildInfo.entry,
                name: buildInfo.name,
                fileName: (format) => {
                    return `${format}/${buildInfo.name}.js`
                },
                formats: ['es', 'umd'],
            },
            rollupOptions: {
                external: botherInfo.externals,
                output: {
                    globals: botherInfo.globals,
                    exports: 'named',
                },
            },
        },
    }
    if (!isDev) {
        viteConfig.plugins.push(dts())
    }
    return viteConfig
}
