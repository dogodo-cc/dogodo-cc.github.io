
// 拖选框的默认样式
const defaultStyle = [
  'position: absolute',
  'border: 1px solid blue',
  'pointer-events: none',
  'transition: all .4s ease',
  'width: 0',
  'height: 0',
  'left: -2px',
  'top: -2px',
  'border-radius: 4px',
  'opacity: 1'].join(';');

// 计算el子元素在el内的offset偏移值
const getChildOffset = (el, child) => {
  let offsetLeft = 0;
  let offsetTop = 0;
  while (child !== el) {
    offsetLeft += child.offsetLeft;
    offsetTop += child.offsetTop;
    child = child.offsetParent;
  }
  return [offsetLeft, offsetTop];
};

const distTop = 2;
const distLeft = 4;

const updateStyle = (el, target, box) => {
  const [left, top] = getChildOffset(el, target);
  const width = target.offsetWidth;
  const height = target.offsetHeight;

  box.style.width = width + distLeft + 'px';
  box.style.height = height + distTop + 'px';
  box.style.left = (left - (distLeft / 2)) + 'px';
  box.style.top = (top - (distTop / 2)) + 'px';
};

export default {
  bind(el, binding) {
    let slideBox = null;

    // 确保 在计算 offsetLeft 等值的时候能依据指令容器 el
    el.style.position = 'relative';
    el.style.overflow = 'hidden';

    // let targetElement = null;


    // 获取指令参数
    const { className, monitor } = binding.value;

    el.addEventListener('mouseenter', () => {
      el.dataset.isDraging = true;

      // 只第一次创建，后续都一直复用
      if (slideBox) {
        slideBox.style.opacity = 1;
      } else {
        slideBox = document.createElement('div');
        slideBox.className = 'hi-slide-box';
        slideBox.style.cssText = defaultStyle;
        el.appendChild(slideBox);
      }
    }, false);

    el.addEventListener('mousemove', event => {
      const isDraging = el.dataset.isDraging === 'true';
      let { target } = event;

      if (isDraging) {
        while (!target.classList.contains(className)) {
          if (target === el) return false;
          target = target.parentNode;
        }
        event.preventDefault();
        slideBox.style.opacity = 1;

        updateStyle(el, target, slideBox);
      }
    }, false);

    el.addEventListener('mouseleave', () => {
      el.dataset.isDraging = false;
      slideBox.style.opacity = 0;
    }, false);


    const callback = function(mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // console.log(`childList: ${mutation}`);
        }
        else if (mutation.type === 'attributes') {
          if (mutation.target.classList.contains(monitor)) {
            slideBox && (slideBox.style.opacity = 0);
          }
        }
      }
    };
    el.observer = new MutationObserver(callback);
    const config = { attributes: true, childList: true, subtree: true };
    el.observer.observe(el, config);
  },
  inserted() {
  },
  unbind(el) {
    el.observer.disconnect();
  }
}
;
