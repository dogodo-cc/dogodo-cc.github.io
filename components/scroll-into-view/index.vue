<template>
  <div :class="bem()">
    <div class="header">
      <a
        v-for="item in list"
        :key="item"
        :href="`#${item}`"
        :class="{ active: current === item }">
        {{ item }}&nbsp;
      </a>
    </div>
    <div
      v-for="item in list"
      :key="item"
      :id="item"
      :class="[item, 'layout']">
      {{ item }}
    </div>

    <a class="go-top" href="#">top</a>
  </div>
</template>
<script>
import scrollInToView from "./scrollInToView.js";

export default {
  name: "scroll-into-view",
  data() {
    return {
      list: Array.from(new Array(4)).map((_, i) => `layout${++i}`)
    };
  },
  computed: {
    current() {
      return scrollInToView.current;
    },
    layouts() {
      return scrollInToView.layouts;
    }
  },
  mounted() {
    scrollInToView.init();
  }
};
</script>

<style lang="postcss">
html {
  scroll-behavior: smooth;
}
.scroll-into-view {
  & a {
    text-decoration: none;
  }
  & .layout {
    padding: 30px;
    height: 80vh;
    line-height: 80vh;
    text-align: center;
    font-size: 80px;
    color: #fff;
  }
  & .header {
    position: fixed;
    background: #eee;
    text-align: center;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    a.active {
      color: red;
    }
  }
  & .go-top {
    display: block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-radius: 50%;
    background-color: #333;
    color: #fff;
    position: fixed;
    right: 5px;
    bottom: 20px;
  }
  & .layout1 {
    background-color: aqua;
  }
  & .layout2 {
    background-color: blueviolet;
  }
  & .layout3 {
    background-color: aqua;
  }
  & .layout4 {
    background-color: #eee;
  }
}
</style>
