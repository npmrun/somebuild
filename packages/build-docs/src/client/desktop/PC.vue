<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

defineProps<{
    url: string
}>()
const isFixed = ref(false)
const router = useRouter()
const route = useRoute()
onMounted(() => {
    if (route.query.full) {
        isFixed.value = true
    }
})
function handleClick() {
    isFixed.value = !isFixed.value
    if (isFixed.value) {
        document.body.style.overflow = 'hidden'
        router.push({ query: { full: true } as any })
    } else {
        document.body.style.overflow = 'auto'
        router.push({ query: {} })
    }
}
</script>
<template>
    <div class="bg-white h-1/1 pc-component group" :class="[isFixed ? 'sfixed' : '']">
        <iframe v-if="url" :src="'/simulator.html#' + url" frameborder="0" style="height: 100%"></iframe>
        <div class="circle" @click="handleClick" style="box-shadow: 0 8px 12px #ebedf0;">
            {{ isFixed ? '重置' : '全屏' }}
        </div>
    </div>
</template>

<style lang="scss">
.pc-component {
    box-shadow: 0 8px 12px #ebedf0;
    border-radius: 6px;
    overflow: auto;
    background: #fafafa;
    position: relative;
    margin: -12px;

    &.sfixed {
        @apply fixed left-0 right-0 top-0 right-0 z-9 w-1/1 h-1/1;
        border-radius: 0;
        margin: 0;
    }

    iframe {
        display: block;
        width: 100%;
    }
}

.circle {
    @apply absolute cursor-pointer hidden group-hover: block z-999 bottom-12px right-12px h-55px w-55px leading-55px whitespace-nowrap bg-white text-center rounded-1/2;
}
</style>