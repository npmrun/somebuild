import { cwdDir } from '../shared'
import fs from 'fs-extra'
import path from 'node:path'
import { loadConfigFromFile } from '@noderun/loadconfig'

export interface IConfig<T extends any> {
    path: string
    config: T
    dependencies: string[]
}

let userConfig

export function getSomeBuildConfig<T>() {
    return userConfig as IConfig<T>
}

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
