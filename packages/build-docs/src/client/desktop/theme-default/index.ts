import { App } from 'vue'
import Layout from './Layout.vue'

export default {
    Layout,
    enhanceApp({ app }: { app: App }) {
        console.log(111);
        
        // app.use(FUI)
    },
}
