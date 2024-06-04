import { getElementPosition } from "../utils/index.js";
import mitt from "mitt";

class Mask {
  constructor() {
    this.mask = null;
    this.opacity = 0.7;
    this.zIndex = 9;
    this.emitter = mitt();
    document.body.style.position = "relative";
    this.createMask();
  }

  init(opt = {}) {
    this.opacity = opt.opacity || 0.7;
    this.zIndex = opt.zIndex || 9;
  }

  createMask() {
    this.mask = document.createElement("div");

    this.mask.addEventListener(
      "click",
      ev => {
        this.emitter.emit("click", ev);
      },
      false
    );
    document.body.appendChild(this.mask);
  }

  updateMaskStyle(element) {
    if (!this.mask) {
      this.createMask();
    }

    const { left, top, width, height } =
      element instanceof HTMLElement ? getElementPosition(element) : element;

    const linearGradient = `linear-gradient(rgb(0, 0, 0) ${top}px, rgba(0, 0, 0, 0) ${top}px, rgba(0, 0, 0, 0) ${top +
      height}px, rgb(0, 0, 0) ${top +
      height}px), linear-gradient(to right, rgb(0, 0, 0) ${left}px, rgba(0, 0, 0, 0) ${left}px, rgba(0, 0, 0, 0) ${left +
      width}px, rgb(0, 0, 0) ${left + width}px);`;

    this.mask.style.cssText = `
      z-index: ${this.zIndex};
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      opacity: ${this.opacity};
      transition: opacity .2s ease-in;
      background: rgba(0, 0, 0, ${this.opacity});
      -webkit-mask-image: ${linearGradient};
      `;
  }

  destroy() {
    if (!this.mask) return;

    this.mask.style.opacity = 0;
    this.mask.addEventListener(
      "transitionend",
      () => {
        this.mask?.parentNode?.removeChild(this.mask);
        this.mask = null;
      },
      false
    );
  }
}

export default new Mask();
