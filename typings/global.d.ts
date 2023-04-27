declare const __NAME__: string
declare const __VERSION__: string
declare const __DEV__: boolean

interface IBuildInfoVite<T extends 'components-vue3' | 'component-vue3'> {
    engine?: 'vite'
    mode: T
    watch: boolean
    outDir: string
    entry: string
    componentsName: string
}
type IBuildInfo = any

declare module 'process' {
    global {
        var process: NodeJS.Process
        namespace NodeJS {
            interface ProcessEnv extends Dict<string> {
                WATCH: boolean | undefined
            }
        }
    }
}
