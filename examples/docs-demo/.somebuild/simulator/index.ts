import 'ant-design-vue/dist/antd.css';
import antd from "ant-design-vue"

export default {
    enhanceApp({ app }) {
        app.use(antd)
    }
}