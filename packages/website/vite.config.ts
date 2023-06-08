import { resolve } from 'path'
import type { UserConfigExport } from 'vite'

export default (): UserConfigExport => {
    return {
        optimizeDeps: {
            exclude: ['vitepress'],
        },
        /**
         * 定义全局常量替换方式
         *
         * @see define https://cn.vitejs.dev/config/shared-options.html#define
         */
        define: {},
        server: {
            port: 9999,
        },
        resolve: {
            alias: {
                // 'fighting-design': resolve(
                //     __dirname,
                //     '../packages/fighting-design/index.ts'
                // ),
                // '@fighting-design/fighting-icon': resolve(
                //     __dirname,
                //     '../packages/fighting-icon/index.ts'
                // ),
            },
        },
        css: {
            postcss: {
                plugins: [
                    {
                        postcssPlugin: 'internal:charset-removal',
                        AtRule: {
                            charset: (atRule): void => {
                                if (atRule.name === 'charset') {
                                    atRule.remove()
                                }
                            },
                        },
                    },
                ],
            },
        },
    }
}
