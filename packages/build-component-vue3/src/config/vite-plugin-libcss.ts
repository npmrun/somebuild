import fs from 'fs'
import path, { resolve } from 'path'
import { Plugin } from 'vite'

let viteConfig: any

/**
 * es模式下打包后在顶部插入css模块文件
 */
export default function (): Plugin {
    return {
        name: 'lib-css',
        apply: 'build',
        enforce: 'post',

        configResolved(resolvedConfig: any) {
            viteConfig = resolvedConfig
        },

        writeBundle(option: any, bundle: any) {
            if (!viteConfig.build || !viteConfig.build.lib) {
                // only for lib build
                console.warn('vite-plugin-libcss only works in lib mode.')
                return
            }
            if (option.format !== 'es') {
                // only for es built
                return
            }
            const files = Object.keys(bundle)
            const cssFile = files.find((v) => v.endsWith('.css'))
            if (!cssFile) {
                return
            }
            for (const file of files) {
                if (!bundle[file].isEntry) {
                    // only for entry
                    continue
                }
                let level = file.split("/").length
                const outDir = viteConfig.build.outDir || 'dist'
                const filePath = resolve(viteConfig.root, outDir, file)
                const data = fs.readFileSync(filePath, {
                    encoding: 'utf8',
                })
                fs.writeFileSync(filePath, `import '${[...Array(level)].map(()=>'.').join('')}/${cssFile}';\n${data}`)
            }
        },
    }
}