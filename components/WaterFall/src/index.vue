<template>
  <div :class="bem()">
    <template v-if="!total">
      <slot name="noData">
        <p :class="bem('no-data')">暂无数据</p>
      </slot>
    </template>
    <!-- 这里使用了v-show 主要是为了保持loading 的IntersectionObserver 一直有效 -->
    <div v-show="total">
      <div :class="bem('groups')">
        <ul
          :style="{width: colWidth + 'px'}"
          v-for="(list, index) in groups" :key="index">
          <li
            v-for="(item, index) in list"
            :key="item.id || index"
            :style="{'margin-bottom': marginBottom + 'px'}"
          >
            <slot :data="item" />
          </li>
        </ul>
      </div>
      <div ref="getMore" @click="getMore">
        <template v-if="isNoMore">
          <slot name="noMore">
            <div :class="bem('no-more')">没有更多了</div>
          </slot>
        </template>
        <template v-else>
          <slot name="getMore">
            <div :class="bem('loading')" v-hi-loading="true"></div>
          </slot>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import bem from "../../../mixins/bem";
import { createComponentName } from "../../../utils/component";
const creatEmptyList = col => {
  const result = [];
  while (col > 0) {
    result.push([]);
    col--;
  }
  return result;
};
export default {
  name: createComponentName("waterfall"),
  mixins: [bem],
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
    col: {
      type: Number,
      default: 6
    },
    colWidth: {
      type: Number,
      default: 200
    },
    sameHeight: {
      type: Boolean,
      default: false
    },
    marginBottom: {
      type: Number,
      default: 20
    },
    // 为了得到真实的 isNoMore
    loading: {
      type: Boolean,
      default: false
    },
    triggerByClick: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      
    };
  },
  computed: {
    isNoMore() {
      return this.pageNum * this.pageSize >= this.total && !this.loading;
    },
    $getMore() {
      return this.$refs["getMore"];
    },
    groups() {
      const { data, col, sameHeight } = this;
      let listHeightMap = Array(col).fill(0);
      let listMap = creatEmptyList(col);
      data.forEach(item => {
        const index = listHeightMap.indexOf(Math.min(...listHeightMap));
        // 公式: natureW / natureH = showW / showH
        listHeightMap[index] += sameHeight
          ? 1
          : (200 * item.height) / item.width;
        listMap[index].push(item);
      });
      return listMap;
    }
  },
  methods: {
    getMore() {
      !this.isNoMore && this.$emit("getMore");
    }
  },
  mounted() {
    // 有的时候不需要组件自动触发，而需要用户手动触发
    if (!this.triggerByClick) {
      const IO = new IntersectionObserver(el => {
        if (el[0].intersectionRatio <= 0) return;
        !this.isNoMore && this.$emit("getMore");
      });
      IO.observe(this.$getMore);
    }
  }
};
</script>