---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
    name: 'SomeBuild'
    text: 'Build Something'
    tagline: 集合网络上的构建工具，针对性构建不同的东西
    actions:
        - theme: brand
          text: 开始
          link: /somebuild/
        - theme: alt
          text: Github
          link: /

features:
    - title: 构建库
      details: 采用Tsup构建，十分简便迅捷
    - title: 构建vue3组件
      details: 采用vite构建，就写组件就行
    - title: 构建vue3组件库
      details: 采用vite构建，就写组件就行
    - title: 构建静态站点
      details: 参考vitepress, 专门用于预览组件
---

<style>
    /* .VPFeatures.VPHomeFeatures .items .item{
        width: 100%;
        
    }
    @media (min-width: 640px){
        .VPFeatures.VPHomeFeatures .items .item{
            width: calc(100% / 2);
        }
    }
    @media (min-width: 768px){
        .VPFeatures.VPHomeFeatures .items .item{
            width: calc(100% / 3);
        }
    } */
    :root {
        --vp-home-hero-name-color: transparent;
        --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
    }
</style>