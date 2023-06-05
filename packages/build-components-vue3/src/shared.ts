import { getSomeBuildConfig } from 'somebuild'
import path from 'node:path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const rootDir = path.resolve(__dirname, '../')
export const srcDir = path.resolve(rootDir, './src')
export const distDir = path.resolve(rootDir, './dist')
export const cwdDir = process.cwd()

export interface IsomebuildConfigByDocs {}

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
