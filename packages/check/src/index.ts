import path from 'path'
import fs from 'fs-extra'
import { error } from '@anybuild/utils'

const jsonFile = path.resolve(process.cwd(), './package.json')
if (!fs.pathExistsSync(jsonFile)) {
    error('不存在package.json', 'exit')
}

const pkgInfo = fs.readJSONSync(jsonFile)
const buildinfo: IBuildInfo = pkgInfo.buildinfo

if (buildinfo === undefined) {
    error('package.json不存在buildinfo字段', 'exit')
}

if (!buildinfo.mode) {
    error('buildinfo不存在mode字段', 'exit')
}

const defaultBuildInfo: Partial<IBuildInfo> = {
    entry: './src/index.ts',
    outDir: './dist',
}

Object.keys(defaultBuildInfo).forEach((key) => {
    if (defaultBuildInfo[key] && !Reflect.has(buildinfo, key)) {
        buildinfo[key] = defaultBuildInfo[key]
    }
})

export { jsonFile, pkgInfo, buildinfo }
