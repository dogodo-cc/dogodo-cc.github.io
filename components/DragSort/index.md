## DragSort 组件

将数据进行拖动分类，是一种比较直观、符合直觉的交互效果。

### 基本用法

对多组数据进行拖动分类

:::demo 支持使用`v-model`将数据传入，您还可以使用鼠标左键进行`框选`操作，或者按`shift`键进行多选。甚至支持鼠标右键进行快速分类。
```html
<template>
  <hi-drag-sort
    v-model="gaoding"
    :contextmenu-options="options"
    :style-config="styleConfig">
    <template #default="{data}">
        <div class="card" :class="{selected: data.selected }">
          {{data.name}}
          <span>{{data.sex === 1 ? 'boy' : 'girl'}}</span>
        </div>
    </template>
  </hi-drag-sort>
</template>
<script>
  export default {
    data() {
      return {
        gaoding: [
          {
            title: 'uxms',
            childrens: [
              {
                id:1,
                name: '元帅',
                sex: 1,
                selected: false
              },{
                id:2,
                name: '童童',
                sex: 0,
                selected: false
              },{
                id:3,
                name: '浣熊',
                sex: 1,
                selected: false
              },{
                id:4,
                name: '腰果',
                sex: 0,
                selected: false
              },{
                id:5,
                name: '坐标',
                sex: 0,
                selected: false
              }
            ]
          },
          {
            title: 'editor',
            childrens: [
              {
                id: 6,
                name: '小米',
                sex: 1,
                selected: false},
              {
                id: 7,
                name: '诺亚',
                sex: 1,
                selected: false
              },
              {
                id: 8,
                name: '流浪人',
                sex: 1,
                selected: false
              }
            ]
          },
          {
            title: 'ai',
            childrens: [
              {
                id:9,
                name: '豆丁',
                sex: 1,
                selected: false
              }
            ]
          }
        ],
        styleConfig: {
          common: {
            width: '33.333%',
            height: '340px',
            "background-color": '#eee',
            padding: '10px'
          },
          groups: {
            1: {
              "background-color": 'rgb(235, 221, 221)'
            }
          }
        }
      };
    },
    computed: {
      options(){
        return this.gaoding.map((g, i) => {
          return {
            name:g.title,
            value: i
          }
        })
      }
    },
    methods: {
      
    }
  };
</script>
```
:::


### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| v-model     | 需要被分类的对象数组           | array | — | — |
| contextmenu-options | 右键快捷分类的选项，需包含`{name, value}`两个字段， `name`为展示的名称，`value`为分组索引，因为组件内部是通过索引来进行数据`拖动`的 | array | — | [ ] |
| style-config    | 每个组的样式 `{common, groups}` `common`是组的公共样式, 假如你需要对第二个组进行样式定义，则传入 `{groups: {1: {width: 100px, ...style}}}`， 比如demo里对第二组定制了独立的背景色          | object | — | — |


### Slot

| Name | Description |
|------|--------|
| — | 描述 |
| default | 自定义的拖动卡片组件 |
| header | 每个组的头部 |
| footer | 每个组的底部 |

### Events
| 事件名称 | 说明 | 回调参数 |
|---------- |-------- |---------- |
| change | 拖动完成 | `orginalIndex`, `targetIndex`, `ids` 原组的索引和目标组的索引，且把被分类的`项`的id返回 |
