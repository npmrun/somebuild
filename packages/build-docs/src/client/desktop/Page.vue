<template>
    <div>
        <Simulator v-if="frontmatter?.type=='mobile'" :url="`/zh/${curDemo}/basic`"></Simulator>
        <PC v-if="frontmatter?.type=='pc'" :url="`/zh/${curDemo}/basic`"></PC>
        <div style="margin-top: 50px;">
            <Content>
                <component :is="dynamicComponent" v-if="dynamicComponent"></component>
            </Content>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import Simulator from '@desktop/components/Simulator.vue'
import PC from '@desktop/PC.vue'
import Content from './Content.vue'

const route = useRoute()

const curDemo = computed(()=>{
    return route.path.split("/").slice(-2,-1)[0]
})
const frontmatter= computed<any>(()=>{
    console.log(route.meta);
    
    return (route.meta.frontmatter as any).value as any
})
const dynamicComponent = computed(()=>{
    return route.meta.comp
})
</script>