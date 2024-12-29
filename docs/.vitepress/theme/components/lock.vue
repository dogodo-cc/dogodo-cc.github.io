<template>
    <div v-if="showLock" class="lock-panel-wrapper" data-tip="非礼勿视，这是一道防君子的门">
        <div class="lock-panel-bg"></div>
        <div class="lock-panel">
            <div>
                <input type="tel" placeholder="请输入我的手机号" @input="onInput" />
                <p>仅好友可见</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vitepress';

const route = useRoute();
const showLock = ref(false);

function onInput(e) {
    const value = e.target.value;
    if (value == '15105029536') {
        localStorage.setItem(route.path, 'true');
        showLock.value = false;
    }
}

onMounted(() => {
    const path = route.path;
    // localStorage.removeItem(path);
    const hasValid = Boolean(localStorage.getItem(path));
    if (hasValid) {
        showLock.value = false;
    } else {
        showLock.value = true;
    }
});
</script>

<style>
.lock-panel-wrapper {
    & .lock-panel-bg {
        position: absolute;
        inset: -10px;
        z-index: calc(var(--vp-z-index-sidebar) - 2);
        backdrop-filter: blur(6px);
        filter: blur(6px);
    }
    & .lock-panel {
        position: absolute;
        inset: 0;
        z-index: calc(var(--vp-z-index-sidebar) - 1);
        display: flex;
        justify-content: center;
        & input {
            border: 1px solid var(--vp-c-divider);
            text-indent: 8px;
        }
        & p {
            text-align: center;
        }
    }
}
</style>
