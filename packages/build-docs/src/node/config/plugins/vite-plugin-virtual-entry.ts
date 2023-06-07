// https://github.com/Fi2zz/vite-plugin-virtual-entry/blob/master/README.md
import { normalizePath, Plugin, ResolvedConfig } from "vite"
import fs from "fs-extra"
import path from "node:path"
import { clientDir, cwdDir } from "../../../shared"

const cleanUrl = (url: string): string =>
    url.replace(/#.*$/s, '').replace(/\?.*$/s, '')

export async function vitePluginVirtualEntry(): Promise<Plugin> {
    let inputHtml = {}
    return {
        name: "vite-plugin-multi-virtual-html",
        configResolved(config: ResolvedConfig) {
            inputHtml = config.build.rollupOptions.input
            if (config.command == "serve") {

            } else if (config.command == "build") {
                // @ts-ignore
                config.plugins = config.plugins.map((plugin: Plugin) => {
                    if (plugin.name !== "vite:build-html") return plugin;
                    const originalTransform = plugin.transform as Plugin["transform"] as Function;
                    const originalGenerateBundle =
                        plugin.generateBundle as Plugin["generateBundle"] as Function;
                    plugin.transform = function (code: string, id: string) {
                        return originalTransform!.call(this, code, id);
                    };
                    plugin.generateBundle = async function (
                        options: any,
                        bundle: any,
                        isWrite: boolean
                    ) {
                        // @ts-ignore
                        config.root = clientDir
                        const result = await originalGenerateBundle!.call(this, options, bundle, isWrite);
                        // @ts-ignore
                        config.root = cwdDir
                        return result
                    };
                    return plugin
                })
            }
        },
        transformIndexHtml(html) {
            // 去除注释，打包时这两个注释可以删掉，开发时不会走这里，作用是用于定位
            // html = html.replace(/<\!--ENRTYSTART-->/g, "")
            // html = html.replace(/<\!--ENRTYEND-->/g, "")
            return html
        },
        transform(code, id, options) {
            let ext = __DEV__ ? ".ts" : ".js"
            if(id.endsWith("index.html")){
                code = code.replace(/<\!--ENRTYSTART-->[\s\S]*?<\!--ENRTYEND-->/g, `<script type="module" src="desktop/main${ext}"></script>`)
            }
            if(id.endsWith("simulator.html")){
                code = code.replace(/<\!--ENRTYSTART-->[\s\S]*?<\!--ENRTYEND-->/g, `<script type="module" src="simulator/main${ext}"></script>`)
            }
            return code
        },
        configureServer(server) {
            // build是采用patches的方式修正vite内的错误，这样的话必须使用指定版本的vite, 但这应该是客户端使用的，使用patch感觉也不行。还是得使用todo中提到的方案
            server.middlewares.use(async (req, res, next) => {
                const url = req.url && cleanUrl(req.url)
                let ext = __DEV__ ? ".ts" : ".js"
                if(url.endsWith(".md")){
                    console.log(url);
                    
                    next()
                    return
                }
                if (url === "/" || url.startsWith("/zh") || url.startsWith("/en")) {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'text/html')
                    const source = inputHtml['main']
                    let html = fs.readFileSync(source, "utf-8")
                    html = html.replace(/<\!--ENRTYSTART-->[\s\S]*?<\!--ENRTYEND-->/g, `<script type="module" src="/@fs/${normalizePath(path.resolve(clientDir, './desktop'))}/main${ext}"></script>`)
                    // let html = renderIndexHTML({
                    //     injectScript: `<script type="module" src="/@fs/${normalizePath(path.resolve(clientDir, './desktop'))}/main.ts"></script>`
                    // })
                    html = await server.transformIndexHtml(url, html, req.originalUrl)
                    res.end(html)
                    return
                }
                if (url.endsWith("simulator.html")) {
                    const [, name] = url.match(/(?<=\/(.*?))\.html$/)
                    const source = inputHtml[name]
                    if (source) {
                        let html = fs.readFileSync(source, "utf-8")
                        html = html.replace(/<\!--ENRTYSTART-->[\s\S]*?<\!--ENRTYEND-->/g, `<script type="module" src="/@fs/${normalizePath(path.resolve(clientDir, './simulator'))}/main${ext}"></script>`)
                        html = await server.transformIndexHtml(url, html, req.originalUrl)
                        res.end(html)
                        return
                    }
                }
                next()
            })
        },
    }
}