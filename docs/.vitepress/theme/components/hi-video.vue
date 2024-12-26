<template>
    <div
        :class="{
            'hi-video': true,
            'hi-video--playing': isPlaying,
        }"
    >
        <video controls :src="src" @play="onPlay" @pause="onPause"></video>
    </div>
</template>

<script setup>
// 移动端视频不会提前加载，所以需要一个默认图片，否则黑漆漆的很丑
// poster 不能自适应，所以用伪元素
import { toRefs, ref } from 'vue';
const props = defineProps({
    src: String,
});
const { src } = toRefs(props);

const isPlaying = ref(false);

function onPlay() {
    isPlaying.value = true;
}

function onPause() {
    isPlaying.value = false;
}
</script>
<style>
@media (max-width: 750px) {
    .hi-video {
        position: relative;
        display: inline-flex;
        &::after {
            content: '';
            display: block;
            position: absolute;
            inset: 0;
            background-image: url('https://weihai.dogodo.cc/assets/2.DyYdrqIQ.jpeg');
            background-size: cover;
            background-repeat: no-repeat;
            pointer-events: none;
            background-position: center;
            opacity: 0.2;
            /* 加个透明度，否则看不见播放按钮 */
        }
        &.hi-video--playing {
            &::after {
                display: none;
            }
        }
    }
}
</style>
