/// <reference types="vite/client" />

declare const __MD_MATCH__: string
declare const __DEMO_MATCH__: string
declare const __COMP_MATCH__: string
declare const __DOCS_MATCH__: string

// declare module "site-desktop-shared" {
//     interface Comp{
//         componet: any
//         demos: Record<string, any>
//         readme: Record<string, any>
//         styleFile: any
//     }
//     export const button: Comp
//     export const input: Comp
//     export const space: Comp
// }

declare module "site-desktop-info" {
    export const _siteinfo: any
}


declare module "@*" {
    const defaultModule: any
    export default defaultModule
}

declare module '@theme/index' {
    import { App } from "vue"
    interface Theme {
        extends?: Theme,
        enhanceApp?: (ctx: {
            app: App,
            router: any
        }) => any
    }
    const theme: Theme
    export default theme
}

declare module '@simulator/index' {
    import { App } from "vue"
    interface Theme {
        extends?: Theme,
        enhanceApp?: (ctx: {
            app: App,
            router: any
        }) => any
    }
    const theme: Theme
    export default theme
}
