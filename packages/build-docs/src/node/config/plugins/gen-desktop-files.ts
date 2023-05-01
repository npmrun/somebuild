import glob from 'fast-glob'
import path from 'path'
import { ModuleNode, normalizePath, Plugin } from 'vite'
import fs from 'fs-extra'
import chalk from 'chalk'
import lodash from 'lodash-es'
import { clientDir, cwdDir, getConfig } from '../../../shared'

const virtualDesktopModuleId = 'site-desktop-shared'
const virtualDesktopInfoModuleId = 'site-desktop-info'
const resolvedDesktopVirtualModuleId = `somebuild:${virtualDesktopModuleId}`
const resolvedDesktopInfoVirtualModuleId = `somebuild:${virtualDesktopInfoModuleId}`

function createImport(file: string) {
    return `async ()=>await import('${normalizePath(file)}')`
}

function parseComponent(componentsDir) {
    const config = getConfig()
    const indexFile = path.resolve(componentsDir, './index.ts')
    const readmeZHCN = path.resolve(componentsDir, './index.zh-CN.md')
    const readmeENUS = path.resolve(componentsDir, './index.en-US.md')
    const styleFile = path.resolve(componentsDir, './style/style.scss')

    const demos = glob.sync(componentsDir + '/demo/*', { cwd: cwdDir })

    let demosCode = `{\n`
    demos.forEach((v) => {
        const compRoot = normalizePath(path.resolve(cwdDir, v))
        const p = path.parse(compRoot)
        demosCode += `${p.name}: async ()=>await import("${compRoot}"),\n`
    })
    demosCode += '}'

    let readmeCode =
        `{` +
        `zhCN: async ()=>await import("${readmeZHCN}"), enUS: async ()=>await import("${readmeENUS}") }`

    return `{
        component: ${
            fs.pathExistsSync(indexFile) ? createImport(indexFile) : undefined
        },
        styleFile: ${
            fs.pathExistsSync(styleFile) ? createImport(styleFile) : undefined
        },
        demos: ${demosCode},
        readme: ${readmeCode}
    }`
}

export async function genDesktopFiles(): Promise<Plugin> {
    const myConfig = getConfig()
    const siteinfoPath = path.resolve(cwdDir, '.somebuild/siteinfo.json')
    let root
    return {
        name: 'vite-plugin(somebuild):gen-site-base-code',
        resolveId(id) {
            if (id === virtualDesktopModuleId) {
                return resolvedDesktopVirtualModuleId
            }
            if (id === virtualDesktopInfoModuleId) {
                return resolvedDesktopInfoVirtualModuleId
            }
            return null
        },
        transformIndexHtml: {
            enforce: 'pre',
            transform(html) {
                if (fs.pathExistsSync(siteinfoPath))
                    return lodash.template(html)(fs.readJSONSync(siteinfoPath))
                return html
            },
        },
        config: (config) => {
            root = config.root
            //     return {
            //         server: {
            //             fs: {
            //                 allow: [
            //                     config.root,
            //                     cwdDir
            //                 ]
            //             },
            //         }
            //     }
        },
        configureServer(server) {
            const { moduleGraph, watcher, ws } = server
            const reload = (path: string) => {
                if (path === siteinfoPath) {
                    // https://github.com/hannoeru/vite-plugin-pages/blob/0057b65f3a07045bc15614ad9530e26954b3bc88/src/utils.ts#L63
                    const mods = moduleGraph.getModulesByFile(
                        resolvedDesktopInfoVirtualModuleId
                    )
                    if (mods) {
                        const seen = new Set<ModuleNode>()
                        mods.forEach((mod) => {
                            moduleGraph.invalidateModule(mod, seen)
                        })
                    }

                    ws.send({ type: 'full-reload', path: path })
                    // server.restart()
                    console.log('full-reload: ', path)
                }
            }
            watcher
                .add([siteinfoPath])
                .on('add', reload)
                .on('change', reload)
                .on('unlink', reload)

            // const p = path.resolve(cwdDir, myConfig.config.glob.componentsDir)
            // const reloadComponents = (path: string) => {
            //     if(new RegExp(p).test(path)){
            //         server.restart()
            //         console.log("server restart: ", path);
            //     }else{
            //         ws.send({ type: 'full-reload', path: path })
            //     }
            // }
            /**
             * 用于监听组件新建与删除时的页面刷新
             */
            // watcher.add(path.resolve(cwdDir, myConfig.config.componentsDir)).on('addDir', () => {
            //     console.log(222);

            // }).on('add', () => {
            //     console.log(22233);
            // }).on('unlink', () => {
            //     console.log(22233);
            // }).on('unlinkDir', () => {
            //     console.log(2223223);
            // })
        },
        load(id) {
            if (id === resolvedDesktopVirtualModuleId) {
                /**
                    componentsDir: "src/components",
                    glob: {
                        componentsDir: "src/components/*",
                        componentsDir_ignore: ["src/components/_*"]
                    },
                 */
                if (!myConfig.config?.glob?.componentsDir) {
                    console.log(
                        chalk.red(
                            `如需使用${resolvedDesktopVirtualModuleId}请指定glob中的componentsDir`
                        )
                    )
                    return
                }
                let code = ''
                glob.sync(myConfig.config.glob.componentsDir, {
                    cwd: cwdDir,
                    onlyDirectories: true,
                    ignore: myConfig.config.glob.componentsDir_ignore,
                }).forEach((p) => {
                    const componentsDir = normalizePath(path.resolve(cwdDir, p))
                    const name = path.parse(componentsDir).name
                    if (
                        fs.pathExistsSync(
                            path.resolve(componentsDir, './index.ts')
                        )
                    ) {
                        code += `\nexport const ${name} = ${parseComponent(
                            componentsDir
                        )}\n`
                    }
                })
                return `
                    ${code}
                `
            }
            if (id === resolvedDesktopInfoVirtualModuleId) {
                return `export const _siteinfo = ${JSON.stringify(
                    fs.readJSONSync(siteinfoPath)
                )}`
            }
        },
        transform(code, id) {
            if (
                id.includes(normalizePath(cwdDir)) ||
                (id.includes(normalizePath(clientDir)) &&
                    !id.includes('node_modules'))
            ) {
                const allDefine = myConfig.config.define ?? {}
                for (const key in allDefine) {
                    if (Object.prototype.hasOwnProperty.call(allDefine, key)) {
                        const de = allDefine[key]
                        code = code.replace(new RegExp(key, 'g'), de)
                    }
                }
            }
            return code
        },
    }
}
