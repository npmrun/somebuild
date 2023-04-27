import { Component, defineAsyncComponent, defineComponent } from 'vue'
import './loading.css'

/**
 * 存在两种方式实现
 * 1. site-desktop-shared
 *     需要自行实现代码引入，做热更刷新，监听文件夹新建与删除等
 * 2. import.meta.glob
 *     路径无法配置，只能固定，但可再尝试
 */

type One = {
    name: string
    component: Component
    demos: Record<string, Component>
    zh: any
    en: any
}

const components: One[] = []
const simulatorRoutes: any[] = []
const mdData = import.meta.glob(__MD_MATCH__, { eager: true })
const demoData = import.meta.glob(__DEMO_MATCH__)
const componentsData = import.meta.glob(__COMP_MATCH__)
// const docsData = import.meta.glob(__DOCS_MATCH__, { eager: true })
const docsData = import.meta.glob(__DOCS_MATCH__, { eager: true })

const allDocs: any[] = []
for (const key in docsData) {
    if (Object.prototype.hasOwnProperty.call(docsData, key)) {
        const doc = (docsData[key] as any).default ?? (docsData[key] as any)
        const frontmatter =
            (docsData[key] as any).frontmatter ?? (docsData[key] as any)
        const [, name, _language] = key.match(
            /\/docs\/(.*?)\/index\.(.*?)\.md/
        ) as string[]
        const language = _language.split('-')[0]
        allDocs.push({
            path: `/${language}/docs/${name}`,
            name: name,
            language: language,
            meta: {
                title: name,
                ...(frontmatter ?? {})
            },
            component: doc,
        })
    }
}

for (const key in componentsData) {
    // @ts-ignore
    const mod = componentsData[key]
    const name = /src\/components\/(.*?)\//.exec(key)![1]
    const demos: Record<string, Component> = {}
    for (const key in demoData) {
        if (key.includes(`/components/${name}/demo`)) {
            const demoName = /\/demo\/(.*?)\.vue$/.exec(key)![1]
            // @ts-ignore
            const demoModule = demoData[key]
            demos[demoName] = demoModule
            simulatorRoutes.push({
                path: `/zh/${name}/${demoName}`,
                component: demoModule,
            })
            simulatorRoutes.push({
                path: `/en/${name}/${demoName}`,
                component: demoModule,
            })
        }
    }
    let zhMD
    let enMD
    for (const key in mdData) {
        if (Object.prototype.hasOwnProperty.call(mdData, key)) {
            const element = mdData[key] as any
            if (key.includes(`components/${name}/index.zh-CN.md`)) {
                zhMD = element.default
            }
            if (key.includes(`components/${name}/index.en-US.md`)) {
                enMD = element.default
            }
        }
    }

    components.push({
        name: name,
        component: mod,
        demos: demos,
        zh: zhMD,
        en: enMD,
    })
}

// function loaddingComp() {
//     return (
//         <div className="loading-container">
//             <div className="loading-spinner">
//                 <div></div>
//                 <div></div>
//                 <div></div>
//             </div>
//         </div>
//     )
// }

// console.log(components, allDocs, simulatorRoutes)

export { components, allDocs, simulatorRoutes }
