<script setup lang="ts">
import { useScroll } from '@vueuse/core';
import { computed } from 'vue';

const { y } = useScroll(document.body);
const progress = computed(() => {
    const distance = document.getElementById('app')!.offsetHeight - window.innerHeight;
    return Math.min((y.value / distance) * 100, 100) + '%';
});
</script>


<template>
    <div class="progress-bar"></div>
</template>


<style scoped>
.progress-bar {
    display: none;
}
@media (max-width: 750px) {
    .progress-bar {
        display: block;
        position: absolute;
        right: 0%;
        bottom: -1px;
        left: 0;
        height: 1px;
        &::after {
            display: block;
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            background-color: var(--vp-c-text-2);
            width: v-bind('progress');
        }
    }
}
</style>
