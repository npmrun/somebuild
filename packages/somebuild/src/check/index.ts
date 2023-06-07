import path from 'path'
import fs from 'fs-extra'
import { error } from '../utils'

/**
 * @internal
 */
export function check() {
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
    return { jsonFile, pkgInfo, buildinfo }
}

export function getMode() {
    const { buildinfo, pkgInfo, jsonFile } = check()
    return buildinfo.mode
}

/**
 * @internal
 */
export function getInfo() {
    const { buildinfo, pkgInfo, jsonFile } = check()

    const defaultBuildInfo: Partial<IBuildInfo> = {
        entry: './src/index.ts',
        outDir: './dist',
    }

    Object.keys(defaultBuildInfo).forEach((key) => {
        if (defaultBuildInfo[key] && !Reflect.has(buildinfo, key)) {
            buildinfo[key] = defaultBuildInfo[key]
        }
    })

    const dependencies = pkgInfo['dependencies'] ?? {}
    const devDependencies = pkgInfo['devDependencies'] ?? {}
    const peerDependencies = pkgInfo['peerDependencies'] ?? {}
    pkgInfo.globals = pkgInfo['globals'] ?? {}
    pkgInfo.exclude = pkgInfo['exclude'] ?? []

    const externals = [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
    ].filter((v) => !pkgInfo.exclude.includes(v))

    let globals: Record<string, string> = {}
    externals.forEach((v) => {
        globals[v] = pkgInfo.globals[v] || v
    })
    return {
        jsonFile,
        pkgInfo,
        buildinfo,
        externals,
        globals,
        dependencies,
        devDependencies,
        peerDependencies,
    }
}
