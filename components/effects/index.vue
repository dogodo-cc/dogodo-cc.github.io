<template>
  <div class="effect-page">
    <SvgPath />
    <HoverPress>
      <img width="400"
           height="300"
           src="https://cdn.dancf.com/uxms/www/image/3-5_e8021f69.png"
           alt="">
    </HoverPress>
    <ChinaMap />
    <DotRing />
    <Loading />
    <SvgAnimals />
    <div
      v-mouseDirection="{cb: cb}"
      class="mouse-direction">
      {{ mouseDirectionVal }}
    </div>
  </div>
</template>

<script>
import SvgPath from './components/svg-path/index.vue';
import HoverPress from './components/hover-press/index.vue';
import ChinaMap from './components/china-map/index.vue';
import DotRing from './components/dot-ring/index.vue';
import Loading from './components/loading/index.vue';
import SvgAnimals from './components/svg-animals/index.vue';
import HiUi from '90s-ui';
const {mouseDirection} = HiUi;

export default {
  name: 'Effects',
  directives: {
    mouseDirection
  },
  components: {
    SvgPath,
    HoverPress,
    ChinaMap,
    DotRing,
    Loading,
    SvgAnimals,
  },
  data() {
    return {
      mouseDirectionVal: '判断鼠标方向'
    }
  },
  methods: {
    cb(v) {
      this.mouseDirectionVal = v;
    }
  }
}
</script>

<style lang="scss">
.effect-page {
  height: 100vh;
  .mouse-direction {
    margin: 30px;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
    border: 1px solid #ccc;
  }
}
</style>
