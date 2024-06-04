<template>
  <div class="barrel" :style="`--col-space:${colSpace}px;`">
    <template v-if="!total">
      <slot name="noData">
        <p class="no-data">暂无数据</p>
      </slot>
    </template>
    <!-- 这里使用了v-show 主要是为了保持loading 的IntersectionObserver 一直有效 -->
    <div v-show="total">
      <div class="lines">
        <ul
          :data-inf="`line: ${index + 1} height：${Math.round(line.list[0].colHeight)}`"
          v-for="(line, index) in lines"
          :key="index">
          <li
            v-for="(item, index) in line.list"
            :key="item.id || index"
             :style="{width: `${item.colWidth}px`, height: `${item.colHeight}px`}">
            <slot :data="item" />
          </li>
        </ul>
      </div>
      <!-- <div ref="loadMore" @click="loadMore">
        <template v-if="isNoMore">
          <slot name="noMore">
            <div class="no-more">没有更多了</div>
          </slot>
        </template>
        <template v-else>
          <slot name="loadMore">
            <div class="loading">拼命加载中....</div>
          </slot>
        </template>
      </div> -->
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash';
export default {
  name: 'barrel',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 100
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 50
    },
    colSpace: {
      type: Number,
      default: 20
    },
    height: {
      type: Number,
      default: 100
    },
    heightOffset: {
      type: Number,
      default: 50
    },
    // 为了得到真实的 isNoMore
    loading: {
      type: Boolean,
      default: false
    },
    loadAutomatically: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      waterfallWidth: 0,
    };
  },
  computed: {
    isNoMore() {
      return this.pageNum * this.pageSize >= this.total && !this.loading;
    },
    lines() {
      const {data, colSpace, height, heightOffset} = this;
      let {waterfallWidth} = this;
      waterfallWidth += colSpace;

      const minHeight = height - heightOffset;
      const maxHeight = height + heightOffset;

      // 至少摆放2个，图片的宽度要比间隔大
      if(waterfallWidth < colSpace * 2 * 2) return [];

      const lines = [];
      const originalList = [...data];
      const cacheList = []; // 缓存队列
      let canGetItemFromCacheLine = false; // 是否可以从缓存队列获取

      while(originalList.length > 0) {
        // 是否可以找到还没填满的队伍
        const notFullLine = lines.find(line => line.full === false);

        // 极端情况，当队伍只剩下1个人的时候，缓存队伍需要解散，归队！
        if(originalList.length === 1 && cacheList.length){
          originalList.push(...cacheList);
          cacheList.length = 0;

          // eslint-disable-next-line
          console.log('嘿，兄弟，你遇到麻烦了，我尝试解救一下!!', `cacheList: ${notFullLine.list.length}`)

          if(notFullLine) {
            originalList.push(...notFullLine.list);
            notFullLine.list.length = 0;
          }
        }

        const item = canGetItemFromCacheLine && cacheList.length
          ? cacheList.shift()
          : originalList.shift();

        // 按比例设置一下宽高
        item.colHeight = height;
        item.colWidth = height * item.width / item.height;

        if(notFullLine) {
          const itemsTotalWidth = notFullLine.list.reduce((total, next) => {
            total += next.colWidth;
            return total;
          }, item.colWidth);

          // 假设推入此列，剩余宽度有多少
          const leftoverWidth = waterfallWidth - (notFullLine.list.length + 1) * colSpace;

          if(itemsTotalWidth > leftoverWidth) {

            // 原则是先尝试推入缩小，若不行，再尝试不推入放大
            let ratio = leftoverWidth / itemsTotalWidth;
            let zoomHeight = ratio * height;

            if( zoomHeight >= minHeight) {
              notFullLine.list.push(item);
              notFullLine.list.forEach(v => {
                v.colHeight = zoomHeight;
                v.colWidth = v.colWidth * ratio;
              })
              notFullLine.full = true;
              canGetItemFromCacheLine = true; // 该行满员了，可以从缓存拿
            } else {

              cacheList.push(item);
              canGetItemFromCacheLine = false;

              // 尝试放大
              ratio = waterfallWidth / (itemsTotalWidth - item.colWidth);
              zoomHeight = ratio * height;

              if(zoomHeight <= maxHeight) {
                notFullLine.list.forEach(v => {
                  v.colHeight = zoomHeight;
                  v.colWidth = v.colWidth * ratio;
                })
                notFullLine.full = true;
                canGetItemFromCacheLine = true; // 该行满员了，可以从缓存拿
              }
            }
          } else {
            if(itemsTotalWidth === leftoverWidth) {
              notFullLine.full = true;
              canGetItemFromCacheLine = true; // 该行满员了，可以从缓存拿
            }
            notFullLine.list.push(item);
          }
        } else {
          lines.push({
            full: false,
            list: [item]
          });
        }
      }
      return lines;
    }
  },
  methods: {
    loadMore() {
      !this.isNoMore && this.$emit("loadMore");
    },
    initWaterfallWidth: throttle(function() {
      // 只有改变宽度需要重新布局
      if(this.waterfallWidth !== this.$el.offsetWidth) {
        this.waterfallWidth = this.$el.offsetWidth;
      }
    }, 500, {leading: false, trailing: true}),
  },
  mounted() {
    // 通过 IntersectionObserver 监听加载
    if (this.loadAutomatically) {
      const IO = new IntersectionObserver(el => {
        if (el[0].intersectionRatio <= 0) return;
        this.loadMore();
      });
      IO.observe(this.$refs.loadMore);
    }

    this.waterfallWidth = this.$el.offsetWidth;
    // this.initWaterfallWidth();
    window.addEventListener('resize', this.initWaterfallWidth, false);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.initWaterfallWidth, false);
  }
};
</script>
<style lang="postcss">
.barrel {
  & .lines {
    margin-left: calc(var(--col-space) * -1);
    width: calc(100% + var(--col-space));
    & ul {
      margin-bottom: var(--col-space);
      display: flex;
    }
    & li {
      margin-left: var(--col-space);
    }
  }
}
</style>
