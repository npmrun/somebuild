import { cwdDir } from '../shared'
import fs from 'fs-extra'
import path from 'node:path'
import { loadConfigFromFile } from '@noderun/loadconfig'

/**
 *
 * @internal
 */
export interface IConfig<T extends any> {
    path: string
    config: T
    dependencies: string[]
}

let userConfig

/**
 * @public
 */
export function getSomeBuildConfig<T>(name: keyof IRootConfig) {
    const config = userConfig as IConfig<T>
    if(config?.config?.[name]){
        config.config = config.config[name]
    }
    return config
}

/**
 *
 * @internal
 */
export async function getSomeBuildConfigAsync() {
    if (fs.pathExistsSync(path.resolve(cwdDir, 'somebuild.config.mts'))) {
        userConfig = (await loadConfigFromFile(
            {
                mode: process.env.WATCH ? 'development' : 'production',
                command: process.env.WATCH ? 'serve' : 'build',
            },
            'somebuild.config.mts',
            cwdDir
        )) as any
    }
    return userConfig
}

interface IRootConfig {
    lib: any
    docs: any
    preview: any
    'component-vue3': any
    'components-vue3': any
}
/**
 * @public
 */
export function defineRootConfig(config: Partial<IRootConfig>) {
    return config
}
