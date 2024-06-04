<template>
<div class="uxms-draw" :class="{pc: !isPhone}">
  <img class="header" @click="isMuted = !isMuted" src="https://st-gdx.dancf.com/assets/20200114-185809-40e7.png" alt="">
  <div class="turntable-box">
    <div
      class="turntable"
      :style="{
        transform: `rotate(${totalDeg}deg)`,
        transition: `transform ${time}ms cubic-bezier(0, .31, .57, 1.03)`
      }"
      @transitionend="isPlaying = false">
    </div>
    <div class="start" @click="start">
      <audio :muted="isMuted" preload ref="audio" src="https://st-gdx.dancf.com/assets/20200111-170134-3df4.mov"></audio>
      <img src="https://st-gdx.dancf.com/assets/20200114-185605-9076.png" alt="">
    </div>
  </div>
  <img class="footer" src="https://st-gdx.dancf.com/assets/20200114-185831-411c.png" alt="">
</div>  
</template>

<script>
import { isPhone } from '@90s/tools';
export default {
  name: 'draw',
  data() {
    return {
      radis: 30,
      time: 0,
      totalDeg: 0,
      isPlaying: false,
      isMuted: true,
      isPhone
    }
  },
  computed: {
    $audio() {
      return this.$refs.audio;
    }
  },
  methods: {
    start() {
      if(this.isPlaying) return;
      this.isPlaying = true;
      this.time = 0;
      this.totalDeg = 0;

      setTimeout(() => {
        const random = Math.floor(Math.random() * 12);
        this.totalDeg = 360 * 8 + this.radis * random + this.radis / 2;
        this.time = 10 * 1000;
        this.playAudio();
      }, 30)
    },
    playAudio() {
      const {$audio} = this;
      if ($audio.paused) {
        $audio.play();
      }
    }
  }
}
</script>

<style lang="scss">
.uxms-draw {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url('https://st-gdx.dancf.com/assets/20200113-202526-e195.png') top center no-repeat;
  background-size: cover;
  flex-direction: column;
  &.pc {
    width: 375px;
    height: 667px;
    margin: 0 auto;
  }

  .turntable-box {
    position: relative;
    width: 320px;
    height: 320px;

    .turntable {
      position: relative;
      width: 100%;
      height: 100%;
      background: url('https://st-gdx.dancf.com/assets/20200114-185530-f432.png') center center no-repeat;
      background-size: cover;
      transform-origin: center center;
    }
    .start {
      width: 80px;
      height: 80px;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      img {
        max-width: 100%;
        width: 100%;
        margin-top: -15px;
      }
    }
  }
  .header {
    max-width: 100%;
  }
  .footer {
    max-width: 100%;
  }
}

</style>