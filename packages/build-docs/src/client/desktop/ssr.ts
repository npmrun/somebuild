// entry for SSR
import { justCreateApp } from './main'
import { renderToString } from 'vue/server-renderer'
// import { renderHeadToString } from "@vueuse/head"
import { basename } from 'node:path'
import { _siteinfo } from 'site-desktop-info'

// https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js
export async function render(path: string, manifest: any) {
    const { app, router } = await justCreateApp()
    await router.push(path+"?module")
    await router.isReady()
    let meta = []
    let _title = ""
    if (router.currentRoute.value.meta) {
        const title = router.currentRoute.value.meta.title as string ?? _siteinfo.title
        const data = router.currentRoute.value.meta.meta ?? []
        meta = (_siteinfo.meta ?? []).concat(data as any)
        _title = title
    }
    // TODO 获取title用于渲染
    const ctx = {}
    const html = await renderToString(app, ctx)

    // @ts-ignore
    // const preloadLinks = renderPreloadLinks(ctx.modules, manifest)

    return [html, meta, _title]
}

function renderPreloadLinks(modules: any, manifest: any) {
    let links = ''
    const seen = new Set()
    modules.forEach((id: any) => {
        const files = manifest[id]
        if (files) {
            files.forEach((file: any) => {
                if (!seen.has(file)) {
                    seen.add(file)
                    const filename = basename(file)
                    if (manifest[filename]) {
                        for (const depFile of manifest[filename]) {
                            links += renderPreloadLink(depFile)
                            seen.add(depFile)
                        }
                    }
                    links += renderPreloadLink(file)
                }
            })
        }
    })
    return links
}

function renderPreloadLink(file: string) {
    if (file.endsWith('.js')) {
        return `<link rel="modulepreload" crossorigin href="${file}">`
    } else if (file.endsWith('.css')) {
        return `<link rel="stylesheet" href="${file}">`
    } else if (file.endsWith('.woff')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    } else if (file.endsWith('.woff2')) {
        return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    } else if (file.endsWith('.gif')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/gif">`
    } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`
    } else if (file.endsWith('.png')) {
        return ` <link rel="preload" href="${file}" as="image" type="image/png">`
    } else {
        // TODO
        return ''
    }
}