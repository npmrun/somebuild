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
    const optionalDependencies = pkgInfo['optionalDependencies'] ?? {} 
    pkgInfo.globals = pkgInfo['globals'] ?? {}
    pkgInfo.exclude = pkgInfo['exclude'] ?? []
    pkgInfo.include = pkgInfo['include'] ?? []

    const externals = [
        ...Object.keys(dependencies),
        ...Object.keys(peerDependencies),
        ...Object.keys(optionalDependencies),
        /**
         * 如果externals是['ant-design-vue']的话，就只能匹配import * from "ant-design-vue"引入
         * 如果是import * from "ant-design-vue/es/button" 类似的形式，可以添加 ['ant-design-vue', 'ant-design-vue/es/button']，这样也能匹配
         * 为甚么呢。因为我在rollupOptions.external的判断是externals.includes(id)的形式，因此就需要这样
         */
        ...pkgInfo.include
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
