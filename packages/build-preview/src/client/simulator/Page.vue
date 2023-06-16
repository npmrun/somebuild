<template>
    <div>
        <component v-if="active" :is="activeComponet?.demos[activeDemo]"></component>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, ref, watch, watchEffect } from 'vue'
import { components } from '../common/data'
import { _siteinfo } from 'site-desktop-info'
const route = useRoute()
// console.log(route.params)
// console.log(route.params)
const compName = route.params!.comp as string
const demoName = route.params!.demo as string

const active = ref(compName)
const activeDemo = ref<string>("basic")
const activeLanguage = ref<string>()
const keys = computed(() => {
    return components.map((v) => v.name)
})

const simulatorNavRef = ref<HTMLDivElement>()
watch(() => simulatorNavRef.value, () => {
    // @ts-ignore
    OverlayScrollbars(simulatorNavRef.value, {
        overflow: {
            y: 'hidden',
        },
        paddingAbsolute: false,
        showNativeOverlaidScrollbars: false,
        scrollbars: {
            theme: 'os-theme-dark',
            visibility: 'auto',
            autoHide: 'leave',
            autoHideDelay: 1300,
            dragScroll: true,
            clickScroll: true,
            pointers: ['mouse', 'touch', 'pen'],
        },
    })
})

watchEffect(() => {
    // console.log(route.params);

    if (route.params?.comp) {
        active.value = route.params.comp as string
    }
    activeLanguage.value = route.params.language as string
    activeDemo.value = route.params.demo as string
})

const activeComponet = computed(() => {
    let index = -1
    for (let i = 0; i < components.length; i++) {
        const element = components[i]
        if (element.name === active.value) {
            index = i
        }
    }
    if (index != -1) {
        const one = components[index]
        if (demoName && one.demos[demoName]) {
            activeDemo.value = demoName
        } else {
            if (Object.keys(one.demos).length) {
                let name = Object.keys(one.demos)[0]
                activeDemo.value = name
            }
        }
        // console.log(one);
        
        return one
    }
})
</script>