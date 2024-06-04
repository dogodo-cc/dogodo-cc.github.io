<template>
  <div :class="bem()" v-show="intro.showIntroBox">
    <div class="info">
      {{ intro.currentInfo.info }}
    </div>

    <div class="footer">
      <el-button
        @click="intro.prev()"
        :disabled="intro.disabledPrev"
        type="primary">prev</el-button>

      {{ intro.currentStep }}/{{ intro.steps.length }}

      <el-button
        @click="intro.next()"
        :disabled="intro.disabledNext"
        type="primary">next</el-button>
    </div>

    <div class="arrow" data-popper-arrow></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IntroService from "./index.js";

export default defineComponent({
  name: "intro",
  components: {},
  data() {
    return {
      intro: { currentInfo: {}, steps: [] }
    };
  },
  props: {
    showImmediately: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    initIntro() {
      IntroService.init(this.$el);
      this.intro = IntroService;
    }
  },
  mounted() {
    if (this.showImmediately) {
      this.initIntro();
    }
  },
  unmounted() {
    IntroService.destory();
  }
});
</script>

<style lang="postcss">
.intro{
  background-color: #fff;
  padding: 10px;
  z-index: 99;
  border-radius: 4px;
  max-width: 280px;

  & .info {
    margin: 8px 0;
  }

  & .arrow,
  & .arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: -1;
  }

  & .arrow::before {
    content: "";
    transform: rotate(45deg);
    background: #fff;
  }

  &[data-popper-placement^="top"] > .arrow {
    bottom: -4px;
  }

  &[data-popper-placement^="bottom"] > .arrow {
    top: -4px;
  }

  &[data-popper-placement^="left"] > .arrow {
    right: -4px;
  }

  &[data-popper-placement^="right"] > .arrow {
    left: -4px;
  }
}
</style>
