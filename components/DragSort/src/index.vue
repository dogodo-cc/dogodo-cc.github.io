<template>
  <div :class="bem()" :style="dragLayout">
    <div
      v-for="(group, index) in value"
      :key="index"
      v-DragSelect="{
        className: 'group-item',
        onlyElTriger: true,
        cb: dragSelect,
        clickCancel: true
      }"
      :class="[
        bem(`group-${index}`),
        bem('group'),
        {empty: !group.childrens.length}
      ]"
      :style="getGroupStyle(index)"
      :data-origin-group-index="index"
      @dragover="dragOver"
      @drop="drop">
      <div :class="bem('group-header')">
        <slot name="header" :group="group">
          {{ group.title }}
        </slot>
      </div>
      <div :class="bem('group-body')">
        <div
          v-for="item in group.childrens"
          :key="item.id"
          v-contextmenuClick="{cb: moveToGroup, options: contextmenuOptions}"
          class="group-item"
          draggable="true"
          :data-origin-group-index="index"
          :data-id="item.id"
          @click.shift="select(item.id, index, true)"
          @click.exact.stop="select(item.id, index)"
          @dragstart="dragStart"
          @mouseenter="item.isHover = true"
          @mouseleave="item.isHover = false">
          <slot :data="item" :group="group" />
        </div>
        <div class="empty-tip">
          <slot name="tip" />
        </div>
      </div>
      <div :class="bem('group-footer')">
        <slot name="footer" />
      </div>
    </div>
    <img :src="dragImage" style="display: none;">
  </div>
</template>

<script>
import DragSelect from "@/directives/drag-select.js";
import contextmenuClick from "@/directives/contextmenu-click.js";
import bem from "../../../mixins/bem";
import { createComponentName } from "../../../utils/component";
const dragImage = "https://st-gdx.dancf.com/assets/20191223-162122-afcb.png";
const createDragImage = ev => {
  var img = new Image();
  img.src = dragImage;
  ev.dataTransfer.setDragImage(img, 64, 64);
};
const cloneDeep = obj => {
  return JSON.parse(JSON.stringify(obj));
};
export default {
  name: createComponentName("drag-sort"),
  directives: {
    DragSelect,
    contextmenuClick
  },
  mixins: [bem],
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    styleConfig: {
      type: Object,
      default() {
        return {
          common: {},
          groups: {}
        };
      }
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    contextmenuOptions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      dragImage,
      selected: {
        index: 0,
        ids: []
      }
    };
  },
  computed: {
    dragLayout() {
      return this.direction === "horizontal"
        ? { "flex-direction": "row" }
        : { "flex-direction": "column" };
    }
  },
  watch: {
    selected: {
      handler: function(val) {
        const { index, ids } = val;
        let value = cloneDeep(this.value);
        value = value.map((group, i) => {
          group.childrens = group.childrens.map(v => {
            v.selected = i === index ? ids.includes(v.id) : false;
            return v;
          });
          return group;
        });
        this.$emit("input", value);
      },
      deep: true
    }
  },
  methods: {
    select(id, index, multiple = false) {
      let selected = cloneDeep(this.selected);
      if (selected.index === index) {
        const includes = selected.ids.includes(id);
        if (multiple) {
          if (includes) {
            const _i = selected.ids.findIndex(v => v === id);
            _i !== -1 && selected.ids.splice(_i, 1);
          } else {
            selected.ids.push(id);
          }
        } else {
          if (includes) {
            selected.ids = selected.ids.length > 1 ? [id] : [];
          } else {
            selected.ids = [id];
          }
        }
      } else {
        selected = {
          index,
          ids: [id]
        };
      }
      this.selected = selected;
    },
    dragSelect(selected) {
      if (selected.length) {
        const index = this.value.findIndex(v => {
          return v.childrens.some(o => selected.includes(o.id));
        });

        if (index !== -1) {
          this.selected = {
            index,
            ids: selected
          };
        }
      } else {
        this.selected = {
          index: 0,
          ids: []
        };
      }
    },
    dragStart(ev) {
      let target = ev.target;
      // origin-group-index 和 id 都是只挂在 group-item 上
      while (!target.classList.contains("group-item")) {
        target = target.parentNode;
      }

      let { id, originGroupIndex } = target.dataset;
      id = +id || id; // 兼容string number 类型

      let selectedLength = this.selected.ids.length;

      const includes = this.selected.ids.includes(id);
      if (includes && +originGroupIndex === this.selected.index) {
        // do nothing
      } else {
        this.select(id, +originGroupIndex);
        selectedLength = 1; // 手动设置length，避免下面获取到到length 更新不及时的问题
      }

      if (selectedLength > 1) {
        createDragImage(ev); // 超过一张 需要显示复制的图片
      }

      const { dataTransfer } = ev;
      dataTransfer.dropEffect = "move";
      dataTransfer.setData("text", `${originGroupIndex}-${id}`);
    },
    dragOver(ev) {
      ev.preventDefault();
    },
    drop(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      const data = ev.dataTransfer.getData("text");
      const [originGroupIndex] = data.split("-").map(v => +v);
      const targetGroupIndex = +ev.target.dataset.originGroupIndex;
      // 如果相同 或者找不到 不执行drop
      if ([originGroupIndex, NaN].includes(targetGroupIndex)) return;
      this.sort(originGroupIndex, targetGroupIndex);
    },
    sort(originGroupIndex, targetGroupIndex) {
      // console.log({ originGroupIndex, targetGroupIndex });
      if (originGroupIndex === targetGroupIndex) return;
      let value = cloneDeep(this.value);
      const _select = cloneDeep(this.selected.ids);
      const originTeam = value[originGroupIndex].childrens;
      while (this.selected.ids.length) {
        const id = this.selected.ids.shift();
        const itemIndex = originTeam.findIndex(v => v.id === id);
        itemIndex !== -1 &&
          value[targetGroupIndex].childrens.push(
            originTeam.splice(itemIndex, 1)[0]
          );
      }
      this.$emit("input", value);
      this.$emit("change", originGroupIndex, targetGroupIndex, _select);
    },
    moveToGroup(el, index) {
      let { originGroupIndex, id } = el.dataset;
      originGroupIndex = +originGroupIndex || originGroupIndex;
      id = +id || id;

      if (this.selected.ids.includes(id)) {
        this.sort(originGroupIndex, index);
      } else {
        this.dragSelect([+id || id]);
        this.sort(originGroupIndex, index);
      }
    },
    getGroupStyle(index) {
      const {
        styleConfig: { common, groups }
      } = this;
      return Object.assign({}, common || null, groups[index] || null);
    }
  }
};
</script>