import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: 'somebuild',
    description: '集合网络上的构建工具，针对性构建不同的东西',
    lastUpdated: true,
    lang: "zh",
    markdown: {
        theme: {
            light: 'vitesse-light',
            dark: 'vitesse-dark',
        }
    },
    
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: '首页', link: '/' },
            { text: '开始', link: '/start/' },
            {
                text: '库', items: [
                    {
                        text: 'build-lib',
                        link: '/build-lib/guide'
                    }
                ]
            },
        ],
        sidebar: [
            {
                text: '开始',
                items: [{ text: '介绍', link: '/start/' }],
            },
            {
                text: "build-lib",
                items: [
                    { text: '导航', link: '/build-lib/guide' }
                ]
            }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
        ],
    },
})
