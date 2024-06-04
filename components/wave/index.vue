<template>
<div style="height: 1300px;">
  <div class="box">
    <div class="inner"></div>
  </div>
</div>
  <div style="display: flex;">
    <div ref="div1" style="width: 500px;height: 500px; "></div>
    <div ref="div2" style="width: 600px;height: 500px; margin-left: 10px;"></div>
  </div>
  <div style="height: 1300px;"></div>
</template>

<script>
import Wave from './wave';
export default {
  name: 'Wave',
  mounted() {
    new Wave({el: this.$refs.div1, followMouse: true})
    new Wave({el: this.$refs.div2, followMouse: true, dotSize: 100})
  }
}
</script>
<style lang="postcss" scoped>
.box {
  width: 200px;
  height: 200px;
  background-color: #eee;
  & .inner {
    width: 250px;
    height: 300px;
    max-width: 100%;
    max-height: 100%;
    background-color: #ccc;
  }
}
</style>
