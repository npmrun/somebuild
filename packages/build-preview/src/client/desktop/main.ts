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

export async function justCreateApp() {
    let app = createApp(BaseApp)
    const router = buildRouter()
    app.use(router)
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
