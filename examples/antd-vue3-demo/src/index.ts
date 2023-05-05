import { App } from 'vue'
import Test from './test.vue'

const _: import("vue").Plugin = {
    install(app: App) {
        app.component('tttaa', Test)
    },
}

export default _