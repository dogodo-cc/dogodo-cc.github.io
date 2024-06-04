import { createPopper } from "@popperjs/core";

function getHtmlElement(selector) {
  if (selector instanceof HTMLElement) {
    return selector;
  }
  return document.querySelector(selector);
}

class Popper {

  constructor(modefier) {
    this.popperInstance = null;
    this.modifiers = [];
    modefier = Array.isArray(modefier) ? modefier : [modefier];
    this.modifiers.push(...modefier);
  }

  create(trigger, tooltip) {
    trigger = getHtmlElement(trigger);
    tooltip = getHtmlElement(tooltip);

    this.popperInstance = createPopper(trigger, tooltip, {
      modifiers: this.modifiers
    });
    setTimeout(() => {
      this.popperInstance.update();
    }, 0)
  }

  destroy() {
    this.popperInstance?.destroy();
    this.popperInstance = null;
  }
}

export default Popper;
