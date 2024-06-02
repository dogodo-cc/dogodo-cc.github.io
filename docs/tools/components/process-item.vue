<template>
    <div class="process-item">
        <div v-if="props.showProcessBar" class="process-bar"></div>
        <div class="process-title" :class="{ done: done }">{{ stepTitle }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    process: {
        type: Number,
        default: 0,
    },
    showProcessBar: {
        type: Boolean,
        default: true,
    },
    stepTitle: {
        type: String,
        default: 'step',
    },
});

const width = computed(() => {
    return props.process * 100 + '%';
});

const done = computed(() => {
    return props.process >= 1;
});
</script>

<style>
.process-item {
    display: flex;
    align-items: center;
}

.process-bar {
    position: relative;
    width: 100px;
    height: 4px;
    background-color: var(--vp-c-gray-1);
    overflow: hidden;
    border-radius: 2px;
    margin: 0 4px;
    &::after {
        display: block;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        transition: width 0.2s linear;
        width: v-bind(width);
        background-color: var(--vp-c-indigo-3);
    }
}

.process-title {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    border-radius: 6px;
    background-color: var(--vp-c-gray-1);
    color: var(--vp-c-text-1);

    &.done {
        background-color: var(--vp-c-indigo-3);
        color: #fff;
    }
}

@media (max-width: 750px) {
    .process-item {
        & .process-bar {
            width: 50px;
        }
        & .process-title {
            padding: 0 6px;
        }
    }
}
</style>
