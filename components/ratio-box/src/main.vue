<template>
    <div class="ws-ratio-box" :style="`--ratio:${ratio}`">
        <div class="ws-ratio-box__content">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    name: 'WRatioBox',

    props: {
        ratio: {
            type: String,
            default: '56.25%',
        },
    },
};
</script>
