/* eslint class-methods-use-this: "off" */
import { reactive } from "vue";
import { throttle } from "lodash";

const hashReg = /^#\w{1}/;
const g = selecter => Array.from(document.querySelectorAll(selecter));

class ScrollInToView {
  constructor() {
    this.halfWindowHeight = window.innerHeight / 2;
    this.current = "#";
    this.layouts = [];
    this.layoutClass = ".layout";
    return reactive(this);
  }

  init() {
    this.scrollIntoHash();

    this.layouts = g(this.layoutClass)
      .map(element => ({
        id: "#" + element.id,
        offset: this.getElementTop(element),
        $layout: element
      }))
      .reverse();

    const watchScroll = () => {
      const { scrollTop } = document.documentElement;
      const layout = this.layouts.find(
        lay => lay.offset < scrollTop + this.halfWindowHeight
      );
      if (!layout) return;

      const { hash } = window.location;
      if (hash === layout.id) return;
      const url = window.location.href.replace(hash, layout.id);
      window.location.replace(url);
    };
    document.addEventListener(
      "scroll",
      throttle(watchScroll, 500, { leading: false, trailing: true }),
      false
    );
    window.addEventListener(
      "resize",
      throttle(this._resize.bind(this), 1000, {
        leading: false,
        trailing: true
      }),
      false
    );
    window.addEventListener("hashchange", () => this.updateActive(), false);
  }

  scrollIntoHash() {
    const { hash } = window.location;
    if (hashReg.test(hash)) {
      this.updateActive(hash);
      const $layout = this.layouts?.find(ele => ele.id === hash)?.$layout;
      if ($layout) {
        $layout.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  updateActive(hash = window.location.hash) {
    if (hashReg.test(hash)) {
      this.current = hash.replace("#", "");
    }
  }

  updateLayoutOffset() {
    this.layouts.forEach(layout => {
      layout.offset = this.getElementTop(layout.$layout);
    });
  }

  _resize() {
    this.halfWindowHeight = window.innerHeight / 2;
    this.updateLayoutOffset();
  }

  getElementTop(element) {
    let result = element.offsetTop;
    let current = element.offsetParent;

    while (current !== null) {
      result += current.offsetTop;
      current = current.offsetParent;
    }
    return result;
  }
}

export default new ScrollInToView();
