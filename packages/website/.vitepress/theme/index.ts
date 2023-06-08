import Theme from 'vitepress/theme'
import { h } from 'vue'
import "./style.scss"

export default {
    ...Theme,
    Layout() {
        return h(Theme.Layout, null, {})
    },
    enhanceApp(app) {},
}
