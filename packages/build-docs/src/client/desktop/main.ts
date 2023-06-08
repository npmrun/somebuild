import 'virtual:windi.css'
import 'virtual:windi-devtools'
// import AppComp from './App.vue'
import { createApp, App, watchEffect, defineComponent, h } from 'vue'
import allComponents from './components'

import RawTheme from '@theme/index'
import { buildRouter } from './router'

declare global {
    interface Window {
        app: App
    }
}

function resolveThemeExtends(theme: typeof RawTheme): typeof RawTheme {
    if (theme.extends) {
        const base = resolveThemeExtends(theme.extends)
        return {
            ...base,
            ...theme,
            async enhanceApp(app) {
                if (base.enhanceApp) await base.enhanceApp(app)
                if (theme.enhanceApp) await theme.enhanceApp(app)
            },
        }
    }
    return theme
}
// 可参照vitepress
const Theme = resolveThemeExtends(RawTheme) as any

// 这是根据root的为基准的，此时可以获取到cwd下的aaaa.md
// https://github.com/vuejs/vitepress/blob/8059ec390a1dbc7602f7a9125393742b12dd0eb2/src/node/plugin.ts#L58
// 根据vitepress的做法，可以在transform中做转换，转换成组件以及数据
// import('@root/aaaa.md').then(console.log)

const BaseApp = defineComponent({
    name: 'VitePressApp',
    setup() {
        // const { site } = useData()

        // // change the language on the HTML element based on the current lang
        // onMounted(() => {
        //     watchEffect(() => {
        //         document.documentElement.lang = site.value.lang
        //         document.documentElement.dir = site.value.dir
        //     })
        // })

        // if (import.meta.env.PROD) {
        //     // in prod mode, enable intersectionObserver based pre-fetch
        //     usePrefetch()
        // }

        // // setup global copy code handler
        // useCopyCode()
        // // setup global code groups handler
        // useCodeGroups()

        if (Theme.setup) Theme.setup()
        return () => h(Theme.Layout)
    },
})

export async function justCreateApp(isSSR?: boolean) {
    let app
    let router
    // TODO 考虑在ssr构建时构建一个json对应页面的mjs,然后应用到路由上
    if(import.meta.env.PROD && !isSSR){
        app = undefined
    }else if(import.meta.env.DEV || isSSR){
        app = createApp(BaseApp)
        router = buildRouter()
    }
    if(app === undefined) return
    router && app.use(router)
    app.use(allComponents)
    ;(async () => {
        if (Theme.enhanceApp) {
            await Theme.enhanceApp({
                app,
                router,
            })
        }
    })()
    if (!import.meta.env.SSR) {
        app.mount('#app')
        // watchEffect(()=>{
        //     if(router.currentRoute.value.meta){
        //         const data = router.currentRoute.value.meta.meta
        //         useUpdateHead(data)
        //     }
        // })
    }
    return {
        app,
        router,
    }
}

if (!import.meta.env.SSR) {
    justCreateApp()
}
