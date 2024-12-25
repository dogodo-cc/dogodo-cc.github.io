<template>
    <div class="pictures-scroll-x">
        <slot />
    </div>
    <Tip>横向滑动，查看更多</Tip>
</template>
<script setup>
import { computed } from 'vue';
import Tip from './picture-tip.vue';
const props = defineProps({
    width: {
        type: Number,
        default: 300,
    },
});

const width = computed(() => {
    return props.width + 'px';
});
</script>
<style lang="css">
.pictures-scroll-x {
    display: flex;
    width: 100%;
    overflow-x: auto;
    align-items: end;
    & img {
        width: v-bind('width');
    }
}
</style>
