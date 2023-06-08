import { getSomeBuildConfig, getInfo } from 'somebuild'

interface IBuildInfoTsup {
    engine?: 'tsup'
    mode: 'lib'
    outDir: string
    name: string
    entry: string[] | Record<string, string> | string
}

const allinfo = getInfo()

/**
 * 获取package.json中的buildinfo
 */
export function getBuildinfo() {
    let _config = allinfo.buildinfo as IBuildInfoTsup
    if (!_config) {
        _config = {
            engine: "tsup",
            mode: "lib",
            outDir: "./dist",
            name: allinfo.pkgInfo.name,
            entry: "./src/index.ts"
        }
    }
    return _config
}

// overide是否覆盖整个内置的tsup配置
export type IsomebuildConfig = {
    overide?: boolean
    bin?: boolean
} & import('tsup').Options
/**
 * 定义配置文件
 */
export function defineConfig(config: IsomebuildConfig) {
    return config
}
/**
 * 获取somebuild.config.mts配置文件
 */
export function getConfig() {
    let config = getSomeBuildConfig<IsomebuildConfig>("lib")
    return config
}
