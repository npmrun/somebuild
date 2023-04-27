import { components, allDocs } from '../common/data'
import {
    createRouter,
    RouteRecordRaw,
    createMemoryHistory,
    createWebHistory,
    createWebHashHistory,
} from 'vue-router'
import PageComp from './Page.vue'

const routes: RouteRecordRaw[] = [
    // { path: '/', redirect: allDocs.find(v => v.name === 'home' && v.language === 'zh').path },
    {
        path: '/zh',
        redirect: allDocs.find((v) => v.name === 'home' && v.language === 'zh')
            .path,
    },
    {
        path: '/en',
        redirect: allDocs.find((v) => v.name === 'home' && v.language === 'en')
            .path,
    },
    {
        path: '/:language/:comp/:demo(.*)?',
        meta: { type: 'ui' },
        component: PageComp,
    },
    ...allDocs.map((v) => {
        return {
            path: v.path === '/zh/docs/home' ? '/' : v.path,
            alias: v.path,
            meta: { ...(v.meta ?? {}), type: 'page' },
            component: v.component,
        }
    }),
]

function buildRouter() {
    const router = createRouter({
        history: import.meta.env.SSR
            ? createMemoryHistory()
            : createWebHistory(),
        routes,
    })
    // router.beforeResolve(async (to) => {
    //     console.log(to)
    //     console.log('beforeResolve', to.path.replace(/\//, ''))
    //     try {
    //         const name = '/' + to.path.replace(/\//, '') + '.md'
    //         await import(/* @vite-ignore */name).then(
    //             console.log
    //         )
    //         to.meta['aaaccc'] = 1123455
    //         console.log(to.fullPath)
    //         return true
    //     } catch (error) {
    //         console.error(error)
    //         return false
    //     }
    // })
    // router.beforeEach(async (to, from, next) => {
    //     console.log('beforeEach', '@root/' + to.path)
    //     try {
    //         await import('@root/' + to.path).then(console.log)
    //         to.meta['aaaccc'] = 1123455
    //         console.log(to.fullPath)
    //         next()
    //     } catch (error) {

    //     }
    // })

    return router
}

export { buildRouter }
