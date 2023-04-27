import { getAnybuildConfig, getInfo } from 'anybuild'
import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const rootDir = path.resolve(__dirname, '../')
export const srcDir = path.resolve(rootDir, './src')
export const distDir = path.resolve(rootDir, './dist')
export const cwdDir = process.cwd()

// cli开发时读取src下的，构建之后读取dist下的
export const clientDir = __DEV__
    ? path.resolve(srcDir, './client')
    : path.resolve(distDir, './client')

export interface IAnyBuildConfigByDocs {
    alias: any
    define?: any
    componentsDir?: string //组件文件夹
    glob?: {
        componentsDir?: string // 组件文件夹匹配模式
        componentsDir_ignore?: string[] // 组件文件夹不匹配的模式
    }
    vite?: import('vite').InlineConfig
}

export function defineConfig(config: IAnyBuildConfigByDocs) {
    return config
}

/**
 * 获取anybuild.config.mts配置文件
 */
export function getConfig() {
    let config = getAnybuildConfig<IAnyBuildConfigByDocs>()
    if (!config) {
        config = {
            path: path.resolve(cwdDir, 'anybuild.config.mts'),
            config: {
                alias: {
                    '@': './src',
                },
                define: {
                    __MD_MATCH__: "'@root/src/components/*/index.*.md'",
                    __DEMO_MATCH__: "'@root/src/components/*/demo/*.vue'",
                    __COMP_MATCH__: "'@root/src/components/*/index.ts'",
                    __DOCS_MATCH__: "'@root/docs/*/*.md'",
                },
            },
            dependencies: [],
        }
    }
    return config
}
