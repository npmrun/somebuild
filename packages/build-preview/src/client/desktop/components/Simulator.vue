<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
    <div class="simulator group relative" :class="[isFixed ? 'sfixed' : '']">
        <div class="h-640px wrapper ">
            <iframe v-if="url" :src="'/simulator.html#' + url" frameborder="0" style="height: 100%"></iframe>
        </div>
        <div class="circle" @click="handleClick" style="box-shadow: 0 8px 12px #ebedf0;">
            {{ isFixed ? '重置' : '全屏' }}
        </div>
    </div>
</template>

<style lang="scss">
.simulator {
    box-sizing: border-box;
    min-width: 360px;
    width: 360px;
    z-index: 1;

    .wrapper {
        background: #fafafa;
        width: 350px;
        border-radius: 20px;
        box-shadow: 0 8px 12px #ebedf0;
    }

    &.sfixed {
        @apply fixed left-0 right-0 top-0 right-0 z-9 flex w-1/1 h-1/1;
        background-color: white;

        >div {
            margin: auto;
        }
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
