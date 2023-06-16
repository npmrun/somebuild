import { getInfo, getSomeBuildConfig } from 'somebuild'
import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const rootDir = path.resolve(__dirname, '../')
export const srcDir = path.resolve(rootDir, './src')
export const distDir = path.resolve(rootDir, './dist')
export const cwdDir = process.cwd()

interface IBuildInfoComponentsVue3 {
    engine?: 'vite'
    mode: 'components-vue3'
    watch: boolean
    outDir: string
    name: string
    entry: string
    theme: string
    singleTheme: string
    componentsName: string
}


const allinfo = getInfo()

export const externals = allinfo.externals
export const globals = allinfo.globals

/**
 * 获取package.json中的buildinfo
 */
export function getBuildinfo() {
    let _config = allinfo.buildinfo as IBuildInfoComponentsVue3
    return _config
}

export interface IsomebuildConfigByDocs {
    alias?: any
    vite?: any
}

export function defineConfig(config: IsomebuildConfigByDocs) {
    return config
}

/**
 * 获取somebuild.config.mts配置文件
 */
export function getSomeBuildConfigCwd() {
    let config = getSomeBuildConfig<IsomebuildConfigByDocs>("components-vue3")
    if (!config) {
        config = {
            path: path.resolve(cwdDir, 'somebuild.config.mts'),
            config: {},
            dependencies: [],
        }
    }
    return config
}
