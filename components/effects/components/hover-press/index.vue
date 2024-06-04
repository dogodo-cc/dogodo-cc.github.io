<template>
  <div
    class="hove-press"
    :style="{'transform': transform}"
    @mouseout="mouseout"
    @mousemove="mousemove">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'hove-press',
  data(){
    return {
      transform: '',
      angle: 2
    }
  },
  methods: {
    mouseout() {
      this.transform = 'perspective(300px) rotateY(0deg) rotateX(0deg)'
    },
    mousemove(e) {
      const { angle } = this;
      const { 
        target: {
          clientWidth: w,
          clientHeight: h
        },
        offsetX,
        offsetY
      } = e;
      
      const y = (offsetX - w * .5) / w * angle;
      const x = (1 - (offsetY - h * .5)) / h * angle;
      this.transform = `perspective(300px) rotateY(${y}deg) rotateX(${x}deg)`;
    }
  }
}
</script>

<style lang="scss">
.hove-press {
  display: inline-flex;
  transition: transform .2s ease;
  cursor: pointer;
}
</style>