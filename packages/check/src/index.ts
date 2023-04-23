import path from 'path'
import fs from 'fs-extra'
import { error } from '@anybuild/utils'

const jsonFile = path.resolve(process.cwd(), './package.json')
if (!fs.pathExistsSync(jsonFile)) {
    error('不存在package.json', 'exit')
}

const pkgInfo = fs.readJSONSync(jsonFile)
const buildinfo = pkgInfo.buildinfo

if (buildinfo === undefined) {
    error('package.json不存在buildinfo字段', 'exit')
}

export { jsonFile, pkgInfo, buildinfo }
