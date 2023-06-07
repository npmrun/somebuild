import { createServer, build } from 'vite'
import { clientDir, cwdDir, getConfig } from '../shared'
import { getDevConfig } from './config'
import path from 'path'
import { pathToFileURL } from 'url'
import fs from 'fs-extra'
import lodash from "lodash-es"

const { ensureFileSync, pathExistsSync, readFileSync, readJSONSync, writeFileSync, unlinkSync } = fs

export * from '../shared'

export default async function (isSSR: boolean) {
    if (!!process.env.WATCH) {
        devDocs()
    } else {
        buildDocs()
    }
}

async function devDocs() {
    const viteConfig = await getDevConfig()
    const server = await createServer({
        ...viteConfig,
        logLevel: 'info',
        server: {
            port: 3366,
            host: '0.0.0.0',
        },
    })
    await server.listen()
    server.printUrls()
}

async function buildDocs() {
    console.log(" client rendering, server rendering ");
    const [serverResult, clientResult] = await Promise.all([
        build(await getDevConfig(true)) as any, // ssr
        build(await getDevConfig(true, true)) as any // 客户端
    ])
    // https://github.com/vuejs/vitepress/blob/da1691d77e371892cbe566ba45ca24f1fa03dc7c/src/node/build/render.ts
    // https://github.com/vuejs/vitepress/blob/da1691d77e371892cbe566ba45ca24f1fa03dc7c/src/node/build/build.ts
    const entryPath = path.resolve(cwdDir, './.somebuild/.tempDir/app.mjs')
    const manifest = JSON.parse(
        readFileSync(path.resolve(cwdDir, './.somebuild/.tempDir/ssr-manifest.json'), 'utf-8'),
    )
    const indexHTML = path.resolve(cwdDir, './.somebuild/dist/index.html')
    const aa = String(readFileSync(indexHTML)).match(/<\!--preload-links-->([\s\S]*?)<\/head>/)
    const [, matchedStr] = aa ?? []
    unlinkSync(indexHTML)

    const { render } = await import(pathToFileURL(entryPath).toString())
    const siteinfoPath = path.resolve(cwdDir, ".somebuild/siteinfo.json")
    let renderData: any = {}
    if (pathExistsSync(siteinfoPath)) {
        renderData = readJSONSync(siteinfoPath)
    }

    let pagesPromise = [
        renderPage(path.resolve(cwdDir, './.somebuild/.tempDir/zh/readme.md.mjs')+"?module", "index.html", { manifest, clientResult, render, renderData, matchedStr })
    ]
   
    await Promise.all(pagesPromise)
}


async function renderPage(p: string, htmlPath: string, { render, manifest, clientResult, renderData, matchedStr }) {
    try {
        const [appHtml, metas, _title] = await render(p, manifest)
        if (!matchedStr) {
            const appChunk =
                clientResult &&
                (clientResult.output.find(
                    (chunk) =>
                        chunk.type === 'chunk' &&
                        chunk.isEntry &&
                        chunk.facadeModuleId?.endsWith('desktop/main.ts')
                ))

            const cssChunk = clientResult.output.filter(
                (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
            );


            const assets = clientResult.output
                .filter(
                    (chunk) => chunk.type === 'asset' && !chunk.fileName.endsWith('.css')
                )
                .map((asset) => asset.fileName)

            const scriptStr = appChunk
                ? `<script type="module" src="/${appChunk.fileName}"></script>`
                : ``

            const stylesheetLink = cssChunk.map(v => {
                return `<link rel="preload stylesheet" href="/${v.fileName}" as="style">`
            }).join("\n") ?? ''

            /**
             * 考虑不读取，直接字符串拼接快一点, 不同页面也需要不同的标题与meta
             */
            let indexHTML = readFileSync(path.resolve(clientDir, "./index.html"), "utf-8")
            indexHTML = lodash.template(indexHTML)(renderData);
            indexHTML = indexHTML.replace(/<\!--preload-links-->/g, stylesheetLink)
            indexHTML = indexHTML.replace(/<title>[\s\S]*?<\/title>/g, `<title>${_title}</title>`)
            indexHTML = indexHTML.replace(/<\!--ENRTYSTART-->[\s\S]*?<\!--ENRTYEND-->/g, scriptStr)
            indexHTML = indexHTML.replace(/<\!--app-html-->/g, appHtml)

            const metaStr = []
            for (let i = 0; i < metas.length; i++) {
                const mm = metas[i];
                let startMeta = ["<meta "]

                for (const key in mm) {
                    startMeta.push(`${key}="${mm[key]}" `)
                }
                startMeta.push(">")
                if (startMeta.length > 2) {
                    metaStr.push(startMeta.join(''))
                }
            }
            if (metaStr.length) {
                indexHTML = indexHTML.replace(/<\!--meta-data-->/g, metaStr.join('\n'))
            } else {
                indexHTML = indexHTML.replace(/<\!--meta-data-->/g, '')
            }

            ensureFileSync(path.resolve(cwdDir, `./.somebuild/dist/${htmlPath}`))
            writeFileSync(path.resolve(cwdDir, `./.somebuild/dist/${htmlPath}`), indexHTML, "utf-8")
        } else {
            let indexHTML = readFileSync(path.resolve(clientDir, "./index.html"), "utf-8")
            indexHTML = lodash.template(indexHTML)(renderData);
            indexHTML = indexHTML.replace(/<\!--preload-links-->/g, matchedStr)
            indexHTML = indexHTML.replace(/<title>[\s\S]*?<\/title>/g, `<title>${_title}</title>`)
            indexHTML = indexHTML.replace(/<\!--ENRTYSTART-->[\s\S]*?<\!--ENRTYEND-->/g, "")
            indexHTML = indexHTML.replace(/<\!--app-html-->/g, appHtml)

            const metaStr = []
            for (let i = 0; i < metas.length; i++) {
                const mm = metas[i];
                let startMeta = ["<meta "]

                for (const key in mm) {
                    startMeta.push(`${key}="${mm[key]}" `)
                }
                startMeta.push(">")
                if (startMeta.length > 2) {
                    metaStr.push(startMeta.join(''))
                }
            }
            if (metaStr.length) {
                indexHTML = indexHTML.replace(/<\!--meta-data-->/g, metaStr.join('\n'))
            } else {
                indexHTML = indexHTML.replace(/<\!--meta-data-->/g, '')
            }

            ensureFileSync(path.resolve(cwdDir, `./.somebuild/dist/${htmlPath}`))
            writeFileSync(path.resolve(cwdDir, `./.somebuild/dist/${htmlPath}`), indexHTML, "utf-8")
        }
    } catch (error) {
        throw error
    }
}