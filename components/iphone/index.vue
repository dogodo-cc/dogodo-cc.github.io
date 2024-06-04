<template>
  <div
    class="iphone"
    :class="{ 'show-loading': showLoading }"
    @click="showLoading = true">
    <div
      class="loading"
      style="--width: 150px; --height: 10px; --slide-width: 10px">
      <div class="press" :class="{ active: active }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Iphone",
  components: {},
  data() {
    return {
      active: false,
      showLoading: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.active = true;
    }, 1000);
  }
});
</script>

<style lang="postcss">
.iphone {
  width: 200px;
  height: 391px;
  background: url("https://alicdn.huanleguang.com/gaoding_material/static/img/iphone.9f70c2d4.png")
    0 0 no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  &.show-loading {
    & .loading::before {
      display: block;
    }
  }
}

.loading {
  width: var(--width);
  height: var(--height);
  margin: 0 auto;
  background-color: #fff;
  position: relative;
  overflow: hidden;
  &::before {
    position: absolute;
    display: none;
    content: "";
    background-color: #333;
    width: var(--slide-width);
    height: var(--slide-width);
    border-radius: 50%;
    animation: lineRound 2s linear infinite;
  }
  &::after {
    position: absolute;
    display: block;
    content: "";
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    background-color: #eee;
  }
}

.press {
  position: absolute;
  z-index: 1;
  left: 1px;
  top: 1px;
  bottom: 1px;
  right: calc(100% - 1px);
  background-color: #2254f4;
  transition: right 1s ease-out;
  &.active {
    right: 50%;
  }
}

@keyframes lineRound {
  0% {
    left: calc(var(--slide-width) / -2);
    top: calc(var(--slide-width) / -2);
  }
  5% {
    left: calc(var(--slide-width) / -2);
    top: calc(var(--height) - var(--slide-width) / 2);
  }
  35% {
    left: calc(var(--width) - var(--slide-width) / 2);
    top: calc(var(--height) - var(--slide-width) / 2);
  }
  40% {
    left: calc(var(--width) - var(--slide-width) / 2);
    top: calc(var(--slide-width) / -2);
  }
  100% {
    left: calc(var(--slide-width) / -2);
    top: calc(var(--slide-width) / -2);
  }
}
</style>
