<template>
    <div class="pictures-scroll-x">
        <slot />
    </div>
    <PictureTip>横向滑动，查看更多</PictureTip>
</template>
<script setup>
import { computed } from 'vue';
import PictureTip from './picture-tip.vue';
const props = defineProps({
    width: {
        type: Number,
        default: 200,
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
