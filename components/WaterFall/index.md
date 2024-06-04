## WaterFall 组件

瀑布流列表经常用于图片展示，无限加载的场景中。

### 自动加载


:::demo 支持动态改变列数、自动判断是否滚动到底部而触发加载。
```html
<template>
  <div class="waterfall-wrap">
    <hi-waterfall
      :data="data"
      :col="col"
      :col-width="colWidth"
      :margin-bottom="20"
      :total="total"
      :page-size="pageSize"
      :page-num="pageNum"
      :loading="loading"
      @getMore="fetchData"
      >
      <template #default="{data}">
        <div
          class="card"
          :style="{
            height: data.height + 'px'
          }"
        >
        <span>{{data.id}}</span> 
        </div>
      </template>
    </hi-waterfall>
    <div>
      <button @click="testNoData">无数据</button>
      <button @click="testChangeCol">变{{col === 4 ? 5 : 4}}列数</button>
    </div>
  </div>
</template>
<script>
  let id = 1;
  export default {
    data() {
      return {
        data: [],
        col: 4,
        colWidth: 190,
        pageSize: 20,
        pageNum: 0,
        total: 60,
        loading: false,
      };
    },
    methods: {
      fetchData() {
        if (this.loading) return;
        this.loading = true;
        this.pageNum++;
        const r = [];
        for (let i = 0; i < 20; i++) {
          r.push({
            id: id++,
            width: this.colWidth,
            height: parseInt(Math.random() * (9 - 5) + 5,10) * 10
          })
        }
        window.setTimeout(() => {
          this.data.push(...r);
          this.loading = false;
        }, 600);
      },
      testNoData() {
        this.total = 0;
      },
      testChangeCol() {
        this.col = this.col === 4 ? 5 : 4;
        this.colWidth = this.colWidth === 190 ? 150 : 190;
      }
    }
  };
</script>
```
:::

### 手动加载
:::demo 由用户自己点击触发加载更多
```html
<template>
  <div class="waterfall-wrap">
    <hi-waterfall
      :data="data"
      :col="col"
      :col-width="colWidth"
      :margin-bottom="20"
      :total="total"
      :page-size="pageSize"
      :page-num="pageNum"
      :loading="loading"
      :trigger-by-click="true"
      @getMore="fetchData"
      >
      <template #default="{data}">
        <div
          class="card"
          :style="{
            height: data.height + 'px'
          }"
        >
        <span>{{data.id}}</span> 
        </div>
      </template>
      <template #getMore>
        <div style="text-align:center;"><button>{{loading ? '加载中' : '下一页'}}</button></div>
      </template>
    </hi-waterfall>
  </div>
</template>
<script>
  let id = 1;
  export default {
    data() {
      return {
        data: [],
        col: 4,
        colWidth: 190,
        pageSize: 20,
        pageNum: 0,
        total: 60,
        loading: false,
      };
    },
    methods: {
      fetchData() {
        if (this.loading) return;
        this.loading = true;
        this.pageNum++;
        const r = [];
        for (let i = 0; i < 20; i++) {
          r.push({
            id: id++,
            width: this.colWidth,
            height: parseInt(Math.random() * (9 - 5) + 5,10) * 10
          })
        }
        window.setTimeout(() => {
          this.data.push(...r);
          this.loading = false;
        }, 600);
      }
    },
    created() {
      this.fetchData();
    }
  };
</script>
```
:::


### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| data    | 瀑布流数据         | array | — | — |
| pageNum   | 当前页数 | numbe | — | 0 |
| pageSize   | 每页数量 | numbe | — | 20 |
| total   | 接口返回的列表总数， `pageNum`,`pageSize`,`total`都是为了得出 `isNoMore` 传入的 | numbe | — | 1 |
| col   | 显示几列布局 | numbe | — | 4 |
| colWidth   | 每列的宽度 | numbe | — | 200 |
| sameHeight   | 是否统一高度，表示整齐的排列 | Boolean | true/false | false |
| marginBottom   | 卡片之间的垂直间隔 | number | — | 20 |
| loading   | 页面是否进行数据加载，主要是为了得到真实的`isNoMore` | Boolean | true/false  | false |
| triggerByClick   | 是否通过点击触发加载，默认是通过组件内部自己判断是否滚动到底部触发加载 | Boolean | true/false  | false |



### Slot

| Name | Description |
|------|--------|
| — | 描述 |
| default | 自定义的卡片组件 |
| noMore | 没有更多的提示 |
| noData | 没有数据的提示 |
| getMore | 自定义加载按钮，默认是3个圆点的加载组件|


### Events
| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| getMore | 加载下一页 | — |
