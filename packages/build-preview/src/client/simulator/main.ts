import RawTheme from '@simulator/index'
import { createApp, App } from 'vue';
import AppComp from './App.vue';
import PageComp from './Page.vue';
import * as VueRouter from "vue-router"
import { simulatorRoutes } from '../common/data';
import "./sss.scss"

// const routes: VueRouter.RouteRecordRaw[] = [
//     { path: '/:language/:comp/:demo(.*)?', component: PageComp },
// ]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: simulatorRoutes,
})

declare global {
    interface Window {
        app: App;
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
            }
        }
    }
    return theme
}

const Theme = resolveThemeExtends(RawTheme)

let app = createApp(AppComp)
window.app = app
app.use(router);

(async () => {
    if (Theme.enhanceApp) {
        await Theme.enhanceApp({
            app,
            router
        })
    }
})()

setTimeout(() => {
    window.app.mount('#app');
}, 0);
