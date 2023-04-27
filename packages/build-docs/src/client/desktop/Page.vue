<template>
    <aside class="w-300px fixed bottom-0 top-65px rounded-tl-6px rounded-tr-6px"
        style="background: white; box-shadow: 0 8px 12px #ebedf0">
        <nav class="h-1/1 van-doc-nav overflow-y-auto p-12px">
            <!--  @click="(active = name) && $router.replace(`/${language}/${name}`)" -->
            <!-- <div v-for="name in keys" :key="name">
                <router-link :to="`/${activeLanguage}/${name}`"
                    :class="[active === name ? 'router-link-active' : '', 'router-link']" replace class="text-gray-400">{{
                        name }}
                </router-link>
            </div> -->
            <div v-for="item in (_siteinfo?.sidebar ?? [])">
                <div class="van-doc-nav__title">{{ item.title }}</div>
                <router-link v-for="jtem in item.items ?? []" :to="`/${activeLanguage}/${jtem.path}`"
                    :class="[active === jtem.path ? 'router-link-active' : '', 'router-link']" replace
                    class="text-gray-400">{{ jtem.title }}
                </router-link>
            </div>
        </nav>
    </aside>
    <aside v-if="activeItem?.type === 'mobile'" class="absolute right-0 w-350px z-9">
        <nav class="w-350px fixed bottom-0 top-65px">
            <div ref="simulatorNavRef" v-if="activeComponet" class="border-b mb-12px pb-4px ">
                <div class="whitespace-nowrap inline-block">
                    <div v-for="(demo, key) in activeComponet.demos" class="cursor-pointer inline-block rounded-6px" :style="{
                        backgroundColor: key === activeDemo ? 'rebeccapurple' : '',
                        color: key === activeDemo ? 'white' : '#455a64'
                    }" :key="key">
                        <div class="px-12px py-4px"
                            @click="
                                                                                                                                                                                                                                                                                                                                ; (activeDemo = key) &&
                                $router.replace(
                                    `/${activeLanguage}/${active}/${key}`
                                )
                                                                                                                                                                                                                                                                                                                            ">
                            {{ key }}
                        </div>
                    </div>
                </div>
            </div>
            <Simulator :url="`/${activeLanguage}/${active}/${activeDemo}`">
                <!-- <div style="padding: 6px">
                    <component v-if="activeDemo" :is="activeComponet?.demos[activeDemo]"></component>
                </div> -->
            </Simulator>
        </nav>
    </aside>
    <!-- style="background: white; box-shadow: 0 8px 12px #ebedf0" -->
    <main class="ml-320px p-12px rounded-6px" :style="{ marginRight: activeItem?.type === 'mobile' ? '370px' : '' }">
        <div class="p-12px van-doc-content">
            <div v-if="activeItem?.type === 'pc'" class="sticky top-65px h-320px z-99 mb-20px flex flex-col" style="background-color: #f7f8fa;">
                <div v-if="activeComponet" class="border-b mb-12px pb-4px mb-20px">
                    <div class="whitespace-nowrap inline-block">
                        <div v-for="(demo, key) in activeComponet.demos" class="cursor-pointer inline-block rounded-6px" :style="{
                            backgroundColor: key === activeDemo ? 'rebeccapurple' : '',
                            color: key === activeDemo ? 'white' : '#455a64'
                        }" :key="key">
                            <div class="px-12px py-4px"
                                @click="
                                                                                                                                                                                                                                                                                                                                    ; (activeDemo = key) &&
                                    $router.replace(
                                        `/${activeLanguage}/${active}/${key}`
                                    )
                                                                                                                                                                                                                                                                                                                                ">
                                {{ key }}
                            </div>
                        </div>
                    </div>
                </div>
                <PC class="flex-1 h-0" :url="`/${activeLanguage}/${active}/${activeDemo}`"></PC>
            </div>
            <Content>
                <component :is="activeComponet?.[activeLanguage as 'zh' | 'en']"></component>
            </Content>
        </div>
    </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, watch, watchEffect } from 'vue'
import { components } from '../common/data'
import Simulator from './components/Simulator.vue'
import PC from './PC.vue'
import Content from './Content.vue'
import { _siteinfo } from 'site-desktop-info'
const route = useRoute()
// console.log(route.params)
// console.log(route.params)
const compName = route.params!.comp as string
const demoName = route.params!.demo as string

const active = ref(compName)
const activeDemo = ref<string>()
const activeLanguage = ref<string>()
const keys = computed(() => {
    return components.map((v) => v.name)
})

const simulatorNavRef = ref<HTMLDivElement>()
watch(() => simulatorNavRef.value, () => {
    if (!simulatorNavRef.value) return
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

const activeItem = computed(() => {
    if (_siteinfo?.sidebar) {
        for (let i = 0; i < _siteinfo?.sidebar.length; i++) {
            const el = _siteinfo?.sidebar[i];
            if (el.items) {
                for (let j = 0; j < el.items.length; j++) {
                    const ell = el.items[j];
                    if (active.value === ell.path) {
                        return ell
                    }
                }
            }

        }
    }
})

watchEffect(() => {
    if (route.params?.comp) {
        active.value = route.params.comp as string
    }
    activeLanguage.value = route.params.language as string
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
                activeDemo.value = name //one.demos[name].name as string
            }
        }
        return one
    }
})
</script>

<style lang="scss" scoped>
.router-link {
    display: block;
    color: #455a64;
    display: block;
    font-size: 14px;
    line-height: 20px;
    margin: 8px 0;
    padding: 8px 0 8px 24px;
    transition: color .2s;

    &:hover {
        color: #4fc08d;
    }
}

.router-link-active {
    color: #4fc08d;
    background-color: #ebfff0;
    border-radius: 999px;
    font-weight: 600;
}

.van-doc-nav__title {
    color: #455a64;
    font-size: 15px;
    font-weight: 600;
    line-height: 28px;
    padding: 8px 0 8px 24px;
}
</style>
