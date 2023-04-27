<template>
    <router-view></router-view>
</template>

<script lang="ts" setup>
import { watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
watchEffect(() => {
    // console.log(route)
})
</script>
