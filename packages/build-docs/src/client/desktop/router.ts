import { components, allDocs } from '../common/data'
import {
    createRouter,
    RouteRecordRaw,
    createMemoryHistory,
    createWebHistory,
    createWebHashHistory,
    useRoute,
} from 'vue-router'
import Page from "./Page.vue"
import { h, reactive } from 'vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/:pathMatch(.*)*',
        component: () => import("./Page.vue")
        // {
        //     render() {
        //         return h(Page, {}, this.dynamicComponent?[h(this.dynamicComponent)]:null)
        //     },
        //     data() {
        //         return {
        //             dynamicComponent: null
        //         };
        //     },
        //     beforeRouteEnter(to, from, next) {
        //         let name = `/${to.path.replace(/\//, '')}`
        //         if (to.path.endsWith("/")) {
        //             name = name + "readme.md"
        //         } else {
        //             name = name + ".md?fuck"
        //         }
        //         // 动态加载组件并将其赋值给 dynamicComponent
        //         import(/* @vite-ignore */name)
        //             .then((component) => {
        //                 next((vm) => {
        //                     // @ts-ignore
        //                     vm.dynamicComponent = component.default;
        //                 });
        //             })
        //             .catch(() => {
        //                 next();
        //             });
        //     },
        //     beforeRouteUpdate(to, from, next) {
        //         let name = `/${to.path.replace(/\//, '')}`
        //         if (to.path.endsWith("/")) {
        //             name = name + "readme.md"
        //         } else {
        //             name = name + ".md?fuck"
        //         }
        //         // 动态加载组件并更新 dynamicComponent
        //         import(/* @vite-ignore */name)
        //             .then((component) => {
        //                 // @ts-ignore
        //                 this.dynamicComponent = component.default;
        //                 next();
        //             })
        //             .catch(() => {
        //                 next();
        //             });
        //     }
        // },

    }
]

function buildRouter() {
    const router = createRouter({
        history: import.meta.env.SSR
            ? createMemoryHistory()
            : createWebHistory(),
        routes,
    })
    router.beforeResolve(async (to) => {
        console.log(to)
        console.log('beforeResolve', to.path.replace(/\//, ''))
        try {
            let name = `/${to.path.replace(/\//, '')}`
            if (to.path.endsWith("/")) {
                name = name + "readme.md?fuck"
            } else if (to.path.endsWith(".html")) {
                name = name.replace(".html", "") + ".md?fuck"
            } else {
                name = name + ".md?fuck"
            }
            // let n = `@root/${to.path.replace(/\//, '')}.md`
            // const name = '/' + to.path.replace(/\//, '') + '.md'
            console.log(name);
            if(name === "/readme.md?fuck"){
                name = "/zh/readme.md?fuck"
            }
            const res = await import(/* @vite-ignore */name)
            // to.matched[0].components?.default
            // 替换组件
            // if(to.matched[0].components){
            //     to.matched[0].components.default = comp
            // }
            // router.addRoute({
            //     path: to.path,
            //     component: comp
            // })
            // console.log({
            //     path: to.path,
            //     component: comp
            // });
            console.log(res);

            to.meta['path'] = res.default.__file
            to.meta['comp'] = res.default
            to.meta['frontmatter'] = reactive(res.frontmatter)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    })
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
    if (import.meta.hot) {
        import.meta.hot.on("vitepress:pageData", (res) => {   
            if (res.data.path === decodeURIComponent((router.currentRoute.value.meta.path as any) ?? '')) {
                // @ts-ignore
                Object.assign(router.currentRoute.value.meta.frontmatter, res.data.frontmatter)
            }
            console.log(router.currentRoute.value.meta);
        })
    }

    return router
}

export { buildRouter }
