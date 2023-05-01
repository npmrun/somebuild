declare const __NAME__: string
declare const __VERSION__: string
declare const __DEV__: boolean

declare module 'process' {
    global {
        var process: NodeJS.Process
        namespace NodeJS {
            interface ProcessEnv extends Dict<string> {
                WATCH: string | undefined
            }
        }
    }
}
