<template>
  <div
    tabindex="-1"
    :class="bem()"
    :style="style"
    @mousedown="mousedown"
    @mousemove="mousemove"
    @mouseup="mouseup"
    @keydown.prevent="keydown">
    <div class="wraper" :style="wrapStyle">
      <img @load="imageLoad"
        class="image"
        :src="image"
      />
      <div
        class="cropper"
        :style="areaStyle"
        data-cropper-direction="all">
        <div
          v-for="bar in bars"
          :key="bar.name"
          :class="['bar', bar.name]"
          :data-cropper-direction="bar.name"
          :style="bar.style"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ImageCropper from "../../services/image-cropper";

const PADDING = 20; // 在裁切区域外围套一层更大的事件响应层，这样在定位边缘的时候操作体验更好
const DOT_WIDTH = 14;
export default defineComponent({
  name: "image-cropper",
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 300
    },
    // 裁剪区域最小尺寸
    minSize: {
      type: Number,
      default: 30,
      validator(v) {
        return v >= 30;
      }
    },
    image: {
      type: String,
      required: true
    },
    ratio: {
      type: Number,
      default: 0
    },
    forceRatio: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    style() {
      const { width, height, mask } = this;
      return {
        width: width + PADDING * 2 + "px",
        height: height + PADDING * 2 + "px",
        padding: PADDING + "px",
        "--padding": PADDING + "px",
        "--mask": mask,
        "--dot-width": DOT_WIDTH + "px"
      };
    },
    wrapStyle() {
      const { width, height } = this;
      return {
        width: width + "px",
        height: height + "px"
      };
    },
    areaStyle() {
      const { left, right, top, bottom, width, height } = this;
      const _right = width - right;
      const _bottom = height - bottom;
      return {
        left: left + "px",
        right: _right + "px",
        top: top + "px",
        bottom: _bottom + "px"
      };
    },
    paddingHorizontal() {
      const { width, imageWidth } = this;
      return (width - imageWidth) / 2;
    },
    paddingVertical() {
      const { height, imageHeight } = this;
      return (height - imageHeight) / 2;
    },
    mask() {
      const { left, top, right, bottom } = this;
      return (
        `linear-gradient(to bottom, rgba(0,0,0,1) ${top}px, rgba(0,0,0,0) ${top}px, rgba(0,0,0,0) ${bottom}px, rgba(0,0,0,1) ${bottom}px),` +
        `linear-gradient(to right, rgba(0,0,0,1) ${left}px, rgba(0,0,0,0) ${left}px, rgba(0,0,0,0) ${right}px, rgba(0,0,0,1) ${right}px)`
      );
    }
  },
  data() {
    const HALF_DOT = DOT_WIDTH / 2;
    return {
      bars: [
        {
          name: "left",
          style: {
            cursor: "ew-resize",
            left: `${-HALF_DOT}px`,
            top: `calc(50% - ${HALF_DOT}px)`
          }
        },
        {
          name: "left-top",
          style: {
            cursor: "nwse-resize",
            left: `${-HALF_DOT}px`,
            top: `${-HALF_DOT}px`
          }
        },
        {
          name: "top",
          style: {
            cursor: "ns-resize",
            left: `calc(50% - ${HALF_DOT}px)`,
            top: `${-HALF_DOT}px`
          }
        },
        {
          name: "right-top",
          style: {
            cursor: "nesw-resize",
            right: `${-HALF_DOT}px`,
            top: `${-HALF_DOT}px`
          }
        },
        {
          name: "right",
          style: {
            cursor: "ew-resize",
            right: `${-HALF_DOT}px`,
            top: `calc(50% - ${HALF_DOT}px)`
          }
        },
        {
          name: "right-bottom",
          style: {
            cursor: "nwse-resize",
            right: `${-HALF_DOT}px`,
            bottom: `${-HALF_DOT}px`
          }
        },
        {
          name: "bottom",
          style: {
            cursor: "ns-resize",
            left: `calc(50% - ${HALF_DOT}px)`,
            bottom: `${-HALF_DOT}px`
          }
        },
        {
          name: "left-bottom",
          style: {
            cursor: "nesw-resize",
            left: `${-HALF_DOT}px`,
            bottom: `${-HALF_DOT}px`
          }
        }
      ],
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      direction: "",
      zoom: 1,
      naturalWidth: 0,
      naturalHeight: 0,
      imageWidth: 0,
      imageHeight: 0,
      imageCropperService: undefined,
      clientX: 0, // 平移和按比例缩放时，计算鼠标移动的差值
      clientY: 0
    };
  },
  mounted() {
    this.imageCropperService = new ImageCropper(this.image);
    document.addEventListener("mouseup", this.mouseup, false);
  },
  unmounted() {
    document.removeEventListener("mouseup", this.mouseup, false);
  },
  methods: {
    getOffset(ev) {
      let { offsetX, offsetY, target } = ev;
      while (!target.classList.contains(this.$options.name)) {
        offsetX += target.offsetLeft;
        offsetY += target.offsetTop;
        target = target.offsetParent;
      }
      return { offsetX: offsetX - PADDING, offsetY: offsetY - PADDING };
    },
    validate(direction, val) {
      const {
        minSize,
        left,
        top,
        right,
        bottom,
        width,
        height,
        paddingHorizontal,
        paddingVertical
      } = this;
      const validateMap = {
        left() {
          return val + minSize <= right && val >= paddingHorizontal;
        },
        right() {
          return val - minSize >= left && val <= width - paddingHorizontal;
        },
        top() {
          return val + minSize <= bottom && val >= paddingVertical;
        },
        bottom() {
          return val - minSize >= top && val <= height - paddingVertical;
        }
      };
      return val >= 0 && validateMap[direction](val);
    },
    validateOverflow(distanceX, distanceY, directions) {
      return directions.some(direction => {
        const val = /^(left|right)$/.test(direction) ? distanceX : distanceY;
        return !this.validate(direction, this[direction] + val);
      });
    },
    setValue(direction, val) {
      if (!this.validate(direction, val)) return;
      this[direction] = val;
    },
    // 拖动上下左右单边
    resizeCropperBox(offsetX, offsetY, direction) {
      const val = /^(left|right)$/.test(direction) ? offsetX : offsetY;
      this.setValue(direction, val);
    },
    // 拖动上下左右单边时保持固定比例缩放
    resizeCropperBoxByRatio(offsetX, offsetY, direction) {
      const { setValue, validate, right, left, top, bottom } = this;
      const areaW = right - left;
      const areaH = bottom - top;

      let distanceX = 0;
      let distanceY = 0;

      // 和对面一起更新
      let leftBouth = 0;
      let rightBouth = 0;
      let topBouth = 0;
      let bottomBouth = 0;

      // 只更新自己，对面已经不能更新
      let leftSingle = 0;
      let rightSingle = 0;
      let topSingle = 0;
      let bottomSingle = 0;

      let operator = 1;
      // 以往右拖动left和往下拖动top为基准，判断缩放行为，来决定关联的边是加还是减
      switch (direction) {
      case "left":
      case "right":
        distanceX = offsetX - this[direction];
        distanceY = (distanceX / areaW) * areaH;

        operator = direction === "left" ? 1 : -1;

        topBouth = top + (distanceY / 2) * operator;
        topSingle = top + distanceY * operator;
        bottomBouth = bottom - (distanceY / 2) * operator;
        bottomSingle = bottom - distanceY * operator;

        if (validate(direction, offsetX)
        && validate("top", topBouth)
        && validate("bottom", bottomBouth)) {
          setValue(direction, offsetX);
          setValue("top", topBouth);
          setValue("bottom", bottomBouth);
        } else if (validate(direction, offsetX) && validate("top", topSingle)) {
          setValue(direction, offsetX);
          setValue("top", topSingle);
        } else if (validate(direction, offsetX) && validate("bottom", bottomSingle)) {
          setValue(direction, offsetX);
          setValue("bottom", bottomSingle);
        }
        break;

      case "top":
      case "bottom":
        distanceY = offsetY - this[direction];
        distanceX = (distanceY / areaH) * areaW;

        operator = direction === "top" ? 1 : -1;

        leftBouth = left + (distanceX / 2) * operator;
        leftSingle = left + distanceX * operator;
        rightBouth = right - (distanceX / 2) * operator;
        rightSingle = right - distanceX * operator;

        if (validate(direction, offsetY)
            && validate("left", leftBouth)
            && validate("right", rightBouth)
        ) {
          setValue(direction, offsetY);
          setValue("left", leftBouth);
          setValue("right", rightBouth);
        } else if (validate(direction, offsetY) && validate("left", leftSingle)) {
          setValue(direction, offsetY);
          setValue("left", leftSingle);
        } else if ( validate(direction, offsetY) && validate("right", rightSingle)) {
          setValue(direction, offsetY);
          setValue("right", rightSingle);
        }
        break;
      }
    },
    // 移动裁切框
    moveCropperBox(distanceX, distanceY, directions) {
      if (this.validateOverflow(distanceX, distanceY, directions)) return;

      directions.forEach(d => {
        const val = /^(left|right)$/.test(d) ? distanceX : distanceY;
        this[d] += val;
      });
    },
    // 拖动4个边角缩放裁切框
    zoomCropperBox(distanceX, distanceY, direction) {
      const { setValue, validateOverflow, right, left, top, bottom } = this;
      const [directionHorizontal, directionVertical] = direction.split("-");

      const areaW = right - left;
      const areaH = bottom - top;

      // 根据偏移量大小，决定使用哪个方向的偏移值
      const distance = Math.max(Math.abs(distanceX), Math.abs(distanceY));
      // 根据偏移量大小，决定先设置哪个方向的值，另外一个方向根据比例计算
      const horizontal = Math.abs(distanceX) > Math.abs(distanceY);

      // 是否缩小
      let zoomIn = true; // 是否为放大行为
      let distanceH = 0; // 水平值
      let distanceV = 0; // 垂直值

      switch (direction) {
      case "right-top":
        zoomIn = distanceX >= 0 && distanceY <= 0;
        break;
      case "right-bottom":
        zoomIn = distanceX >= 0 && distanceY >= 0;
        break;
      case "left-top":
        zoomIn = distanceX <= 0 && distanceY <= 0;
        break;
      case "left-bottom":
        zoomIn = distanceX <= 0 && distanceY >= 0;
        break;
      }

      const getZoomValueMap = direction => {
        const zoom = /^(left|top)$/.test(direction)
          ? zoomIn
            ? -1
            : 1
          : zoomIn
            ? 1
            : -1;
        return {
          right() {
            return horizontal
              ? distance * zoom
              : (distance / areaH) * areaW * zoom;
          },
          left() {
            return horizontal
              ? distance * zoom
              : (distance / areaH) * areaW * zoom;
          },
          top() {
            return horizontal
              ? (distance / areaW) * areaH * zoom
              : distance * zoom;
          },
          bottom() {
            return horizontal
              ? (distance / areaW) * areaH * zoom
              : distance * zoom;
          }
        }[direction]();
      };

      distanceH = getZoomValueMap(directionHorizontal);
      distanceV = getZoomValueMap(directionVertical);

      if (
        validateOverflow(distanceH, distanceV, [
          directionHorizontal,
          directionVertical
        ])
      )
        return;

      setValue(directionHorizontal, distanceH + this[directionHorizontal]);
      setValue(directionVertical, distanceV + this[directionVertical]);
    },
    mousedown(ev) {
      const { target } = ev;
      const direction = target?.dataset?.cropperDirection;
      if (direction) {
        this.direction = direction;

        if (
          /^(all|left-top|left-bottom|right-top|right-bottom)$/.test(direction)
        ) {
          this.clientX = ev.clientX;
          this.clientY = ev.clientY;
        }
      }
    },
    mousemove(ev) {
      const {
        direction,
        forceRatio,
        resizeCropperBox,
        resizeCropperBoxByRatio,
        moveCropperBox,
        zoomCropperBox
      } = this;
      if (!direction) return;

      const { offsetX, offsetY } = this.getOffset(ev);
      const { clientX, clientY } = ev;

      const distanceX = clientX - this.clientX;
      const distanceY = clientY - this.clientY;

      this.clientX = clientX;
      this.clientY = clientY;

      switch (direction) {
      case "left":
      case "top":
      case "right":
      case "bottom":
        if (ev.shiftKey || forceRatio) {
          resizeCropperBoxByRatio(offsetX, offsetY, direction);
        } else {
          resizeCropperBox(offsetX, offsetY, direction);
        }
        break;
      case "left-top":
      case "left-bottom":
      case "right-top":
      case "right-bottom":
        if (ev.shiftKey || forceRatio) {
          zoomCropperBox(distanceX, distanceY, direction);
        } else {
          direction
            .split("-")
            .forEach(dir => resizeCropperBox(offsetX, offsetY, dir));
        }
        break;
      case "all":
        moveCropperBox(distanceX, distanceY, [
          "top",
          "left",
          "right",
          "bottom"
        ]);
        break;
      }
    },
    mouseup() {
      this.direction = "";
    },
    cropper() {
      let { left, top, right, bottom } = this;
      const { paddingHorizontal, paddingVertical, zoom } = this;

      left = (left - paddingHorizontal) * zoom;
      right = (right - paddingHorizontal) * zoom;
      top = (top - paddingVertical) * zoom;
      bottom = (bottom - paddingVertical) * zoom;

      this.imageCropperService.cropper(left, top, right - left, bottom - top);
    },
    imageLoad(ev) {
      const { naturalWidth, naturalHeight } = ev.target;
      const { width, height, ratio } = this;
      let imageWidth = 0;
      let imageHeight = 0;

      // 原图高宽比例 大于 裁切组件高宽比例
      if (naturalHeight / naturalWidth > height / width) {
        imageHeight = height;
        imageWidth = (imageHeight * naturalWidth) / naturalHeight;

        if (ratio) {
          const h = imageWidth / ratio;
          this.top = (height - h) / 2;
          this.bottom = this.top + h;
          this.left = (width - imageWidth) / 2;
          this.right = width - this.left;
        } else {
          this.left = (width - imageWidth) / 2;
          this.right = width - this.left;
          this.bottom = height;
        }
      } else {
        imageWidth = width;
        imageHeight = (imageWidth * naturalHeight) / naturalWidth;

        if (ratio) {
          const w = imageHeight * ratio;
          this.left = (width - w) / 2;
          this.right = this.left + w;
          this.top = (height - imageHeight) / 2;
          this.bottom = height - this.top;
        } else {
          this.top = (height - imageHeight) / 2;
          this.bottom = height - this.top;
          this.right = width;
        }
      }

      this.naturalWidth = naturalWidth;
      this.naturalHeight = naturalHeight;
      this.imageWidth = imageWidth;
      this.imageHeight = imageHeight;
      this.zoom = naturalWidth / imageWidth;
    },
    // keydown 才可以阻止页面的滚动
    keydown(ev) {
      const { keyCode, shiftKey } = ev;

      // 37:left  38:up  39:right  40:down
      if (!/^(37|38|39|40)$/.test(keyCode)) return;

      const distance = shiftKey ? 10 : 1;
      const { moveCropperBox } = this;
      let zoom = 1;

      switch (keyCode) {
      case 37:
      case 39:
        zoom = keyCode === 39 ? 1 : -1;
        moveCropperBox(distance * zoom, 0, ["left", "right"]);
        break;
      case 38:
      case 40:
        zoom = keyCode === 40 ? 1 : -1;
        moveCropperBox(0, distance * zoom, ["top", "bottom"]);
        break;
      }
    }
  }
});
</script>

<style lang="postcss">
.image-cropper {
  position: relative;
  box-sizing: border-box;
  user-select: none;

  /* 为了获取键盘事件 tabindex */
  &:focus {
    outline: none;
  }

  &::before {
    position: absolute;
    z-index: 1;
    display: block;
    content: "";
    top: var(--padding);
    left: var(--padding);
    right: var(--padding);
    bottom: var(--padding);
    opacity: 0.5;
    background: #000;
    mask-image: var(--mask);
  }

  & .wraper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAEhJREFUWAnt1rENADAIA0HISuy/AZ4JsoMjpXn6l9A1kN09YUxVGXXEseoHMQsggAACCCCAQM4d56pKcnL+AQQQQAABBBD4L7D30gqeWYm3DAAAAABJRU5ErkJggg==)
      0 0 repeat;
    background-size: 8px 8px;
  }

  & .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  & .cropper {
    position: absolute;
    z-index: 2;
    border: 1px solid rgba(255, 255, 255, 0.7);
    cursor: move;

    & .bar {
      position: absolute;
      pointer-events: auto;
      width: var(--dot-width);
      height: var(--dot-width);
      border-radius: 50%;
      background-color: blue;
    }
  }
}
</style>
