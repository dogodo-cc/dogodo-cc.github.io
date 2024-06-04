// 遇到的问题笔记：
// defaultStyle 没有设置 pointer-events: none; 的时候，拖选框会影响触发 mouseup 事件，因为它是fixed布局，刚好挡在鼠标下面
// offsetLeft 相对于被定位的父元素的距离
// [].sort() 如果不写回调函数，默认排序顺序是在将元素转换为字符串，然后比较它们的UTF-16代码单元值序列时构建的，不是进行数值大小对比
// SVGElement 元素没有 offsetLeft 等属性 https://www.chromestatus.com/features/5724912467574784


// 拖选框的默认样式
const defaultStyle = 'position: absolute;border:1px solid blue;background-color: rgba(255, 255, 255, .4);pointer-events: none;';

// 拖选框的动态样式
const getSelectRectanglePosition = (offsetXStart, offsetYStart, offsetXEnd, offsetYEnd) => {
  const left = Math.min(offsetXStart, offsetXEnd);
  const top = Math.min(offsetYStart, offsetYEnd);
  const width = Math.abs(offsetXEnd - offsetXStart);
  const height = Math.abs(offsetYEnd - offsetYStart);
  return `${defaultStyle}left:${left + 'px'};top:${top + 'px'};width: ${width + 'px'};height: ${height + 'px'};`;
};

// 得到坐标轴数组
const getAxisArray = (start, len) => {
  let result = [start];
  while (len) {
    len--;
    result.push(++start);
  }
  return result;
};

// 计算当前每个子元素的位置信息
const getchildPosition = (el, className = 'item') => {
  const childrens = el.getElementsByClassName(className);
  const result = Array.from(childrens).map(item => {
    const { offsetLeft, offsetTop, offsetWidth, offsetHeight, dataset } = item;
    const axisX = getAxisArray(offsetLeft, offsetWidth);
    const axisY = getAxisArray(offsetTop, offsetHeight);
    const id = isNaN(dataset.id) ? dataset.id : +dataset.id;
    return { axisX, axisY, id };
  });
  return result;
};

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

// 思路： 如果child 是 SVGElement 元素，则找到它最近的 HTMLElement 元素
// SVGElement.getBoundingClientRect() - HTMLElement.getBoundingClientRect() + HTMLElement.offsetParent
const getSvgChildOffset = (el, target) => {
  let SVG = target;
  let spaceX = 0; // 元始target到svg的间隔 svg > path > use > circle
  let spaceY = 0;
  while (SVG.tagName.toUpperCase() !== 'SVG') {
    const { left: l1, top: t1 } = SVG.getBoundingClientRect();
    const { left: l2, top: t2 } = SVG.parentNode.getBoundingClientRect();
    spaceX += Math.abs(l1 - l2);
    spaceY += Math.abs(t1 - t2);
    SVG = SVG.parentNode;
  }

  // 得到 svgElement 的间隔
  const { left: svgLeft, top: svgTop } = target.getBoundingClientRect();

  let htmlElement = target;
  // 只要还是 svg 元素，就一直往上找
  while (htmlElement instanceof SVGElement) {
    htmlElement = htmlElement.parentNode;
  }
  // 得到 HTMLElement 的间隔
  const { left: htmlLeft, top: htmlTop } = htmlElement.getBoundingClientRect();

  const disX = Math.abs(svgLeft - htmlLeft);
  const disY = Math.abs(svgTop - htmlTop);

  const [offsetLeft, offsetTop] = getChildOffset(el, htmlElement);
  return [ offsetLeft + disX + spaceX, offsetTop - disY - spaceY ];
};

// 得到鼠标基于容器的真实偏移量
const getMouseAxis = (el, event) => {
  const { offsetX, offsetY, target } = event;
  const { scrollTop } = el;
  let result = [0, 0];

  if (target === el) {
    result = [offsetX, offsetY + scrollTop]; // el上触发，需要加上el自己的scrollTop
  } else {
    // const [offsetLeft, offsetTop] = getChildOffset(el, target);
    const [offsetLeft, offsetTop] = target instanceof HTMLElement ? getChildOffset(el, target) : getSvgChildOffset(el, target);
    result = [offsetX + offsetLeft, offsetY + offsetTop];
  }
  return result;
};

// 有些场景不允许在子元素上触发框选 ： 比如和拖动效果在一起使用的情况
// 当 onlyElTriger 为true，说明只能el自己触发框选
const isLegal = (onlyElTriger, el, target) => {
  return onlyElTriger ? el === target : true;
};

// 判断是否在中间
const justInMiddle = (start, val, end) => {
  const line = [start, val, end].sort((a, b) => a - b);
  return line[1] === val;
};

export default {
  bind(el, binding) {
    let selectRectangle = null;

    let offsetXStart = 0;
    let offsetYStart = 0;

    // 子元素的位置信息
    let childrensPosition = [];

    // 用于前后对比，避免重复触发回调事件
    let selected = '';

    // 确保 在计算 offsetLeft 等值的时候能依据指令容器 el
    el.style.position = 'relative';

    // 获取指令参数
    const { className, onlyElTriger = false, cb, clickCancel = false } = binding.value;

    // mousedown
    el.addEventListener('mousedown', event => {
      if (!isLegal(onlyElTriger, el, event.target) || event.button !== 0) return;

      el.dataset.isDraging = true;
      childrensPosition = getchildPosition(el, className);

      // 点击 清空上次的选择 为了减少误操作，最好不要
      // eslint-disable-next-line
            clickCancel && cb && cb([]); // ui 说要加就加吧，如果下次说要取消，记得怼回去

      const [x, y] = getMouseAxis(el, event);
      offsetXStart = x;
      offsetYStart = y;

      if (selectRectangle) {
        selectRectangle.parentNode && selectRectangle.parentNode.removeChild(selectRectangle);
      } else {
        selectRectangle = document.createElement('div');
      }
      selectRectangle.style.cssText = `${defaultStyle}left:${offsetXStart + 'px'};top:${offsetYStart + 'px'};`;
      el.appendChild(selectRectangle);
    }, false);

    // mousemove
    el.addEventListener('mousemove', event => {
      const isDraging = el.dataset.isDraging === 'true';

      if (isDraging) {
        event.preventDefault();

        const [moveX, moveY] = getMouseAxis(el, event);
        selectRectangle.style.cssText = getSelectRectanglePosition(offsetXStart, offsetYStart, moveX, moveY);

        // 判断哪些项目被选中
        const newSelected = childrensPosition.map(child => {
          const { axisX, axisY, id } = child;

          const isAcrossX = axisX.some(x => justInMiddle(offsetXStart, x, moveX));
          const isAcrossY = axisY.some(y => justInMiddle(offsetYStart, y, moveY));
          if (isAcrossX && isAcrossY) {
            return id;
          }
          return false;
        }).filter(v => v !== false);

        if (newSelected.toString() === selected) {
          // do nothing
        } else {
          selected = newSelected.toString();
          cb && cb(newSelected);
        }
      }
    }, false);

    // mouseup
    el.addEventListener('mouseup', () => {
      el.dataset.isDraging = false;
      selectRectangle && selectRectangle.parentNode && selectRectangle.parentNode.removeChild(selectRectangle);
    }, false);
  },
  inserted() {
  }
}
;
