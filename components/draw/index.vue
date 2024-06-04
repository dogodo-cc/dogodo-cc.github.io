<template>
  <div class="draw">
    <div class="title">设计工坊尾牙抽奖</div>
    <div class="box">
        <div
          :class="{start: member === '开始',item: true}"
          v-for="(member, index) in members"
          :key="index"
          @click="start(member)">
          {{member}}
        </div>
        <div
          :class="{spin: true, win: !isRunning, run: isRunning}"
          :style="{transform: `translate(${x}px, ${y}px)`, transition: `transform ${duration}ms`}"></div>
    </div>
  </div>
</template>

<script>
const before = ['王导','坐标','冻结','元帅'];
const after = ['童童','重来','腰果','希罗'];
export default {
  name: 'draw',
  data() {
    return {
      x:0,
      y:0,
      members: [...before, '开始', ...after ],
      isRunning: false,
      index: 0, // 从哪里开始跑
      duration:0
    }
  },
  methods: {
    generateCirclePath(n, cell = 1) {
      let arr = [];
      // up
      for(let i = 0; i < n; i++ ) {
        arr.push([i * cell, 0]);
      }
      // right
      for(let i = 0; i < n-1; i++) {
        arr.push([(n-1) * cell, (i+1) * cell]);
      }
      // bottom
      for (let i = 0;i < n-1; i++) {
        arr.push([(n-i-2) * cell,(n-1) * cell])
      }
      // left
      for(let i = 0; i < n-2; i++) {
        arr.push([0, (n-i-2) * cell]);
      }
      return arr;
    },
    /** 
     * path: 运动轨迹
     * steps: 总共跑几步
     * speed: 初始速度
     * index: 从第几格开始跑
     * **/
    run(path, steps,index = 0, speed = 60) {
      setTimeout(() => {
        if(index < steps) {
          const length = path.length;
          // 每跑完一圈，更新一下速度
          if (index % length === length - 1) {
            speed += speed * .2
          }
          const [x, y] = path[index % length];
          this.x = x;
          this.y = y;
          this.duration = speed;
          this.run(path, steps, ++index, speed)
        } else {
          this.isRunning = false;
        }
      }, speed);
    },
    start(v) {
      if (v !== '开始' || this.isRunning) return;
      this.isRunning = true;
      const path = this.generateCirclePath(3, 100); // 运动轨道
      const random = Math.floor(Math.random() * path.length);
      const steps = 6 * path.length + random;
      this.run(path, steps, this.index);
      this.index = random;
    }
  }
}
</script>

<style lang="scss" scoped>
.draw {
  .title {
    font-size: 20px;
    padding: 20px 0;
    text-align: center;
  }
  .box {
      display: flex;
      flex-wrap: wrap;
      width: 300px;
      height: 300px;
      margin: 0 auto;
      position: relative;
      background-color: seagreen;
      color: #fff;
      user-select: none;
      .item {
          width: 100px;
          text-align: center;
          line-height: 100px;
          font-size: 20px;
      }
      .start {
        background-color:aquamarine;
        cursor: pointer;
      }
      // 滑块
      .spin {
          transition: transform .2s;
          position: absolute;
          left: 0;
          top: 0;
          display: inline-block;
          width: 100px;
          height: 100px;
          overflow: hidden;
          &::after {
            display: none;
            content: 'luck';
            position: absolute;
            right: -19px;
            top: 0;
            background-color:blueviolet;
            transform: rotate(45deg);
            padding: 4px 16px;
          }
          &.win::after {
            display: block;
          }
          &::before {
            transition: opacity .2s;
            position: absolute;
            content: '';
            opacity: 0;
            left: 0;
            right: 0;
            bottom: 0;
            top:0;
            background:url('https://st-gdx.dancf.com/assets/20200111-103204-f1cb.jpg') center center no-repeat;
            background-size: cover;
          }
          &.run::before {
            opacity: 1;
          }
      }
  }
}

</style>