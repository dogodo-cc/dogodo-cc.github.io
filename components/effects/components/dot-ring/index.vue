<template>
  <div>
    <div class="ring"
      @mousemove="move"
      @mouseenter="stop = false"
      @mouseleave="stop = true">
      <div class="center" :style="{transform: `rotate(${rotate}deg)`}">
        <div
          class="dot"
          :style="{'background-color':`rgba(255,255,255, ${dot.opacity})`}"
          :data-index="dot.id"
          :data-opacity="dot.opacity"
          v-for="dot in dots"
          :key="dot.id"></div>
      </div>
      <div class="tip">
        <div>左</div>
        <div>中</div>
        <div>右</div>
      </div>
    </div>
  </div>
</template>

<script>
const creatArray = (len) => {
  let i = 0;
  let arr = [];
  while(i < len) {
    arr.push({ id:i + 1,opacity: 0})
    i++
  }
  return arr;
}
const getBrother = (v, max = 36) => {
  let result = [{id: v, opacity: 1}];
  let len = max / 4;
  for(let i = 1; i < len; i++) {
    const after = v + i;
    const before = v - i;
    const opacity = 1 - (1 - 0.4) / len * i; // 透明度在 1 ～ 0.4 之间
    result.push({id: after > max ? after - max : after, opacity});
    result.push({id: before < 1 ? max - Math.abs(before) : before, opacity});
  }
  return result;
}
export default {
  name: 'dotRing',
  data() {
    return {
      dotNum: 36,
      dots: [],
      speed: .5,
      rotate: 0,
      stop: true,
      clockwise: true
    }
  },
  computed: {
    deg() {
      return 360 / this.dotNum;
    }
  },
  methods: {
    setOpacity(index) {
      const brothers = getBrother(index);
      this.dots.forEach(dot => {
        let d = brothers.find(v => v.id === dot.id);
        dot.opacity = d?.opacity || 0;
      })
    },
    run() {
      const {stop ,speed, deg} = this;
      if (!stop) {
        this.rotate += this.clockwise ? speed : -speed;
        if (this.rotate % deg === 0) {
          const dist = this.rotate % 360;
          const index = dist / deg
          const topIndex = (index === 0)
            ? 36
            : index > 0
              ? 36 - index
              : Math.abs(index);
          this.setOpacity(topIndex);
        }
      }
      window.requestAnimationFrame(this.run);
    },
    move(e) {
      const {offsetX} = e;
      this.clockwise = offsetX > 200;
      this.stop = offsetX > 100 && offsetX < 200;
    }
  },
  created() {
    this.dots = creatArray(this.dotNum);
    this.setOpacity(this.dotNum);
    window.requestAnimationFrame(this.run);
  }
}
</script>

<style lang="scss">
.ring {
  width: 300px;
  height: 300px;
  background-color: aqua;
  position: relative;
  overflow: hidden;
  .center {
    width: 4px;
    height: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -2px 0 0 -2px;
    will-change: transform;
  }
  .dot {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    @for $index from 1 to 37 {
      &:nth-child(#{$index}) {
        transform:rotate(calc(10 * #{$index}) + deg) translate(0, -146px) ;
      }
    }
  }
  .tip {
    width: 100%;
    height: 10%;
    margin-top: 90%;
    display: flex;
    text-align: center;
    > div {
      flex:1;
    }
    > div:nth-child(2) {
      background-color: azure;
    }
  }
}
</style>


