import { buildinfo, cwdDir } from 'anybuild'
import path from 'node:path'
import fs from 'fs-extra'
import { loadConfigFromFile } from '@noderun/loadconfig'

export function getBuildinfo() {
    let _config = buildinfo as IBuildInfoTsup<'lib'>
    return _config
}

// overide是否覆盖整个内置的tsup配置
export type IAnyBuildConfig = { overide?: boolean, bin?: boolean } & import('tsup').Options

export function defineConfig(config: IAnyBuildConfig) {
    return config
}

const holder: {
    userConfig: {
        path: string
        config: IAnyBuildConfig
        dependencies: string[]
    }
} = {
    userConfig: undefined
}

export function getAnybuildConfig() {
    if (holder.userConfig) return holder.userConfig
}

export async function getAnybuildConfigAsync() {
    let _config = getBuildinfo()
    const isDev = !!_config.watch
    console.log(cwdDir);
    
    if (fs.pathExistsSync(path.resolve(cwdDir, "anybuild.config.ts"))) {
        holder.userConfig = await loadConfigFromFile(
            {
                mode: isDev ? "development" : "production",
                command: isDev ? 'serve' : 'build'
            },
            "anybuild.config.ts",
            cwdDir
        ) as any
    }
    return holder.userConfig
}