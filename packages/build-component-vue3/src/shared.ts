import { getSomeBuildConfig, getInfo } from 'somebuild'


interface IBuildInfoTsup {
    engine?: 'vite'
    mode: 'component-vue3'
    watch: boolean
    outDir: string
    name: string
    fileName: string
    entry: string[] | Record<string, string> | string
}

const allinfo = getInfo()
export const cwdDir = process.cwd()

export function getOtherinfo() {
    let externals = allinfo.externals
    let globals = allinfo.globals
    return {
        globals,
        externals,
    }
}


/**
 * 获取package.json中的buildinfo
 */
export function getBuildinfo() {
    let _config = allinfo.buildinfo as IBuildInfoTsup
    return _config
}

export interface IsomebuildConfigByComponent { }

export function defineConfig(config: IsomebuildConfigByComponent) {
    return config
}

/**
 * 获取somebuild.config.mts配置文件
 */
export function getBuildConfig() {
    let config = getSomeBuildConfig<IsomebuildConfigByComponent>("component-vue3")
    return config
}
