import { reactive } from "vue";
import { getElementPosition } from "../../utils/index.js";
import { kebabCase } from "lodash";
import Popper from "../../services/popper.js";
import maskService from "../../services/dom-mask.js";
maskService.init({ opacity: 0.8 });

class Intro {
  constructor() {
    this.popperService = new Popper({
      name: "offset",
      options: {
        offset: [0, 8]
      }
    });
    return reactive(this);
  }

  introStep = "introStep";
  introInfo = "introInfo";

  steps = [];
  currentStep = 1;

  showIntroBox = false; // 是否显示信息框
  introBox = null; // 信息框的DOM
  clickLayerClose = true; // 点击遮罩是否可以关闭
  mustRead2End = true; // 是否必须看完最后一条
  read2end = false; // 是否看完了最后一条

  get currentInfo() {
    return this.steps[this.currentStep - 1] || { info: "" };
  }

  get selector() {
    return "data-" + kebabCase(this.introStep);
  }

  get disabledNext() {
    return this.currentStep === this.steps.length;
  }

  get disabledPrev() {
    return this.currentStep === 1;
  }

  init(introBox) {
    this.introBox = introBox;
    this.getSteps();
    this.goStep(1);
    this.showIntroBox = true;
    this.read2end = false;

    // 如果开启点击遮罩则需要监听遮罩的点击事件
    if (this.clickLayerClose) {
      maskService.emitter.on("click", () => {
        this.close();
      });
    }

    window.addEventListener("resize", this.getSteps, false);
  }

  getSteps() {
    const steps = Array.from(document.querySelectorAll(`[${this.selector}]`));
    this.steps = steps
      .sort((a, b) => a.dataset[this.introStep] - b.dataset[this.introStep])
      .map(el => {
        const { width, height, left, top } = getElementPosition(el);
        return {
          step: +el.dataset[this.introStep],
          info: el.dataset[this.introInfo],
          width,
          height,
          left,
          top,
          $el: el
        };
      });
  }

  goStep(v) {
    if (v > this.steps.length || v < 1) return;
    this.currentStep = v;

    // 看到最后一条了
    if (this.currentStep === this.steps.length) {
      this.read2end = true;
    }

    const { width, height, left, top, $el } = this.currentInfo;
    maskService.updateMaskStyle({ width, height, left, top });
    this.popperService.create($el, this.introBox);
  }

  next() {
    if (this.disabledNext) return;
    this.goStep(++this.currentStep);
  }

  prev() {
    if (this.disabledPrev) return;
    this.goStep(--this.currentStep);
  }

  /**
   * 关闭新手指南
   * @param {Boolean} admin 是否强制关闭
   */
  close(admin = false) {
    if (!admin && this.mustRead2End && !this.read2end) return;
    this.showIntroBox = false;
    this.popperService.destroy();
    maskService.destroy();
  }

  destory() {
    this.close(true);
    window.removeEventListener("resize", this.getSteps, false);
  }
}
export default new Intro();
