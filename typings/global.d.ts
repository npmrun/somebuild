declare const __NAME__: string
declare const __VERSION__: string
declare const __DEV__: boolean

interface IBuildInfoTsup<T extends 'lib'> {
    engine?: 'tsup'
    mode: T
    watch: boolean
    outDir: string
    name: string
    entry: string[] | Record<string, string> | string
}

interface IBuildInfoVite<T extends 'components-vue3' | 'component-vue3'> {
    engine?: 'vite'
    mode: T
    watch: boolean
    outDir: string
    entry: string
    componentsName: string
}

type IBuildInfo = IBuildInfoTsup | IBuildInfoVite
