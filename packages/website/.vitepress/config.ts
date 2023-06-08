import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'somebuild',
    description: '集合网络上的构建工具，针对性构建不同的东西',
    lastUpdated: true,
    lang: "zh",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: '开始', link: '/start/' },
            { text: '库', link: '/lib/guide' },
        ],
        sidebar: [
            {
                text: '开始',
                items: [{ text: '介绍', link: '/start/' }],
            },
            {
                text: '库',
                items: [{ text: '导览', link: '/lib/guide' }],
            },
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
        ],
    },
})
