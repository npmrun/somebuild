
import { App } from 'vue'
import Test from "./test.vue"
console.log(2232);
console.log(2232);

export default {
    install(app: App) {
        app.component("ttt", Test)
    }
}
