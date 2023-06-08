<template>
    <nav class="navbar">
        <div class="container">
            <div class="title flex">
                <a href="/" class="mr-12px">{{ title }}</a>
                <ul class="flex">
                    <!-- <li class="px-12px" v-for="item in _siteinfo.navbar ?? []">
                        <router-link class="block" :to="`/${language}/${item.path}`">{{ item.title }}</router-link>
                    </li> -->
                </ul>
            </div>
            <ul class="ml-auto">
                <!-- <router-link v-if="language === 'en'" :to="active ? `/zh/${active}` : '/zh'" replace custom
                    v-slot="{ href, route, navigate, isActive, isExactActive }">
                    <li class="float-left px-12px">
                        <a :href="href" @click="navigate">{{language === 'en' ? 'Chinese' : '中文'}}</a>
                    </li>
                </router-link>
                <router-link v-if="language === 'zh'" :to="active ? `/en/${active}` : '/en'" replace custom
                    v-slot="{ href, route, navigate, isActive, isExactActive }">
                    <li class="float-left px-12px">
                        <a :href="href" @click="navigate">{{language === 'zh' ? '英语' : 'English'}}</a>
                    </li>
                </router-link> -->
                <!-- <li class="float-left px-12px"  v-for="item in _siteinfo.action ?? []">
                    <router-link class="block" :to="`/${language}/${item.path}`">{{ item.title }}</router-link>
                </li> -->
            </ul>
        </div>
    </nav>
    <div class="block"></div>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { components } from "../../common/data"
import { _siteinfo } from 'site-desktop-info'

defineProps<{
    title: string
}>()

const keys = computed(() => {
    return components.map((v) => v.name)
})

const FirstComponent = computed(() => {
    return components[0]
})

const active = ref()
// const language = ref("zh")
// const route = useRoute()
// watchEffect(() => {
//     const [, lang] = route.path.match(/\/(.*?)\//) as string[] ?? []
//     if(lang){
//         language.value = lang
//     }
//     if (route.params?.comp) {
//         active.value = route.params.comp as string
//     }
//     if (route.params?.language) {
//         language.value = route.params.language as string
//     }
    
// })
</script>

<style lang="scss" scoped>
.navbar {
    height: 45px;
    line-height: 45px;
    background-color: var(--header-bg);
    color: var(--header-text-color);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;

    .container {
        @apply mx-auto flex items-center;

        .title {
            @apply font-bold;
            cursor: pointer;
        }
    }
}

.block {
    height: 45px;
}
</style>
