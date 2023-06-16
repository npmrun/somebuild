import { App } from "vue";
import Test from "./Test.vue"

export default {
    install(app: App, options = {}) {
        app.component("test", Test)
    }
}