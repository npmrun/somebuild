<template>
    <Header :title="_siteinfo.title"></Header>
    <div class="container mx-auto py-20px relative">
        <router-view v-if="$route?.meta?.type === 'ui'"></router-view>
        <div class="van-doc-content" v-else>
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts" setup>
// import * as components from 'site-desktop-shared'
import { _siteinfo } from 'site-desktop-info'
// import { defineAsyncComponent } from 'vue'
import Header from '@desktop/components/Header.vue'
import { useRoute } from 'vue-router'
import { watchEffect } from 'vue';

const route = useRoute()
watchEffect(()=>{
    console.log(route);
    
})

// const FeButton = defineAsyncComponent({
//     loader: button.component,
// })
// (async () => {
// console.log(button.readmeZHCN)
// console.log(_siteinfo)
// })()
</script>
<style lang="scss">
@import '@desktop/assets/style/common.scss';
</style>
