import type { ModuleNode, Plugin } from "vite";

export async function genDesktopDemos(): Promise<Plugin> {
    return {
        name: "gen-desktop-demos",
        transform(code, id) {
            if (/\.md$/.test(id)) {
                const matchCode = `<script lang="ts">`
                let num = code.search(matchCode)
                if (num != -1) {
                    let start = num + matchCode.length
                    code = code.slice(0, start) + `
                    import { defineComponent } from 'vue'
                    const all = import.meta.glob("./demo/*.vue", { eager: true })
                    let components = {}
                    if(all && JSON.stringify(all)!=="{}"){
                        for(let key in all){
                            const comp = all[key]
                            const [, name] = key.match(/demo\\/(.*?)\\.vue$/)
                            components[name] = comp.default || comp
                        }
                    }
                    export default defineComponent({
                        components
                    })
                    `+ code.slice(start)
                }
            }
            return code
        },
    }
}