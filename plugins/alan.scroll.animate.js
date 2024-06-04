// 滚动动画
(function ($) {
  /*
  * 需要在css文件里添加 .scroll-animate.animated {visibility: hidden;} 样式，解决"闪一下"的bug
  * .disable-hover {pointer-events: none;} 也需要加在样式表中
  * 如果滚动事件失效，查看body元素是否设置了 {height:100%}，它会影响滚动事件。
  * 如果不希望动画每次滚动都出现，可以给动画元素加 once 类名。
  * */

  var ScrollAnimate = function (opt) {
    this.opt = opt || {};
    this.className = this.opt.className || '.scroll-animate'; // 获取集合的class
    this.animateClass = this.opt.animateClass || 'animated';  // 动画依赖的class
    this.elem = document.querySelectorAll(this.className);    // 需要滚动展示的元素
    this.position = [];                                       // 所有元素的offsetTop距离数组
    this.windowHeight = ('innerHeight' in window) ? window.innerHeight : document.documentElement.clientHeight;
    this.time = null;
    this.body = document.body;

    // 视察滚动
    this.parallaxElems = document.querySelectorAll('.scroll-parallax');
    this.parallxPosition = [];
    this.init();
  };
  ScrollAnimate.prototype = {
    getPosition: function () {
      var self = this;
      if (self.elem.length === 0) {
        console.log('没有需要滚动动画的元素！');
        return;
      }

      self.position.length = 0;  // 重置数组
      // 遍历元素获取文档位置的同时，做一些初始化的工作
      [].slice.call(self.elem).forEach(function (elem) {
        if (elem.classList.contains('father')) {
          var children = elem.querySelectorAll(elem.dataset.child);
          var delay = parseFloat(elem.dataset.delay);
          [].slice.call(children).forEach(function (obj, index) {
            obj.classList.add('animated');
            obj.style.visibility = 'hidden';

            if (obj.dataset.delay) {
              obj.style.animationDelay = obj.dataset.delay + 's';
            } else {
              obj.style.animationDelay = delay * index + 's';
            }
          })
        } else if (elem.classList.contains('font-fadeIn')) {
          elem.style.visibility = 'hidden';
        } else {
          elem.classList.add('animated');
        }
        self.position.push(self.getOffsetTop(elem));
      });
    },
    getParallaxPosition: function () {
      var self = this;
      if (self.parallaxElems.length < 1) {
        console.log('没有需要滚动视差的元素！');
        return;
      }
      self.parallxPosition.length = 0;
      [].slice.call(self.parallaxElems).forEach(function (item) {
        self.parallxPosition.push(self.getOffsetTop(item));
      });
    },
    getOffsetTop: function (element) {
      var top;
      while (element.offsetTop === void 0) {
        element = element.parentNode;
      }
      top = element.offsetTop;
      while (element = element.offsetParent) {
        top += element.offsetTop;
      }
      return top;
    },
    scrollEvent: function () {
      var self = this;

      // 滚动期间屏蔽浏览器事件
      /*self.body.classList.add('disable-hover');
      clearTimeout(self.time);
      self.time = setTimeout(function () {
          self.body.classList.remove('disable-hover');
      },50);*/

      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      //console.log('滚动事件触发，滚动距离是' + scrollTop)
      self.position.forEach(function (item, index) {
        var currentElem = self.elem[index];
        var effect = currentElem.dataset.effect || 'fadeInUp';
        var flag = (scrollTop + self.windowHeight > item) ? true : false;

        // 判断当前元素是否有father，得知将动画应用到当前元素还是当前元素到子元素。
        if (currentElem.classList.contains('father')) {
          var children = currentElem.querySelectorAll(currentElem.dataset.child);

          if (flag) {
            [].slice.call(children).forEach(function (item) {

              if (item.style.visibility === 'hidden') {
                item.style.visibility = 'visible';

                // 判断是否为滚动数字效果的元素
                // 数字滚动的效果，默认都放在father的容器里，因为这个效果一般都是多个同时出现。
                if (item.classList.contains('count-up')) {
                  self.countUp(item, true);
                } else {
                  if (item.dataset.effect) {
                    item.classList.add(item.dataset.effect);
                  } else {
                    item.classList.add(effect);
                  }
                }

              }
            })
          } else {
            [].slice.call(children).forEach(function (item) {
              if (item.style.visibility === 'visible' && !item.classList.contains('once')) {
                if (item.classList.contains('count-up')) {
                  self.countUp(item, false);      // 传入false，告诉函数清空计时器。
                }

                if (item.dataset.effect) {
                  item.classList.remove(item.dataset.effect);
                } else {
                  item.classList.remove(effect);
                }

                if (!item.classList.contains('once')) {
                  item.style.visibility = 'hidden';
                }
              }
            });
          }
        } else if (currentElem.classList.contains('font-fadeIn')) {  // 文字淡入到效果
          if (flag && currentElem.style.visibility === 'hidden') {
            self.fontEffect(currentElem);
          } else if (!flag && currentElem.style.visibility === 'visible' && !currentElem.classList.contains('once')) {
            currentElem.style.visibility = 'hidden';
          }
        } else {
          if (flag) {
            currentElem.style.visibility = 'visible';
            currentElem.classList.add(effect);
            currentElem.style.animationDelay = currentElem.dataset.delay + 's';

          } else {
            if (currentElem.style.visibility === 'visible' && !currentElem.classList.contains('once')) {
              currentElem.classList.remove(effect);
              currentElem.style.visibility = 'hidden';
            }
          }
        }
      });


    },
    parallaxEvent: function () {
      var self = this;
      // 视差效果的判断
      // 调用方式：<div class="scroll-parallax" data-ratio=".1"></div>
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      self.parallxPosition.forEach(function (item, index) {
        var parallaxElem = self.parallaxElems[index];
        var ratio = parseFloat(parallaxElem.dataset.ratio) || .1;
        var direction = parallaxElem.dataset.direction || 'up';

        // 判断元素是否在第一屏
        if (item < self.windowHeight) {
          var y = scrollTop * ratio;
          y = (y > 500) ? 500 : y;
          if (direction === 'up') {
            y = y * -1;
          }
          parallaxElem.style.transform = "translateY(" + y + "px) translateZ(0)";
        } else {
          var flag = (scrollTop + self.windowHeight > item) ? true : false;
          if (flag) {
            var y = (scrollTop + self.windowHeight - item) * ratio;
            y = (y > 500) ? 500 : y;
            if (direction === 'up') {
              y = y * -1;
            }
            parallaxElem.style.transform = "translateY(" + y + "px) translateZ(0)";
          } else {
            parallaxElem.style.transform = "translateY(0) translateZ(0)";
          }
        }
      });

    },
    countUp: function (elem, isTrue) {
      // 使用方法
      // <span class="alan count-up" data-count-time="1000" data-count-sum="996"></span>

      if (isTrue) {
        elem.innerHtml = '';

        var time = elem.dataset.countTime;
        var sum = elem.dataset.countSum;
        var speed = Math.ceil(time / 100);
        var increment = Math.round(sum / speed);
        var number = 1;
        elem.countUpTime = setInterval(function () {
          if (number < sum) {
            number += increment;
            elem.innerText = number;
            //console.log(number);
          } else {
            elem.innerText = sum;
            clearInterval(elem.countUpTime);
          }
        }, 100);

        //console.log(speed);
      } else {
        //console.log('清空定时器');
        clearInterval(elem.countUpTime);

      }

    },
    fontEffect: function (elem) {
      var array = elem.dataset.text.split('');
      var delay = elem.dataset.delay;
      var effect = elem.dataset.effect || 'fadeIn';
      elem.innerHTML = '';
      var Fragment = document.createDocumentFragment();
      array.forEach(function (item, i) {
        var span = document.createElement("font");
        span.className = 'animated';
        span.classList.add(effect);
        if (delay) {
          span.style.animationDelay = delay * i + 's';
        } else {
          span.style.animationDelay = 0.1 * i + 's';
        }
        span.innerText = item;
        Fragment.appendChild(span);
      });
      elem.style.visibility = 'visible';
      elem.appendChild(Fragment);
    },
    init: function () {
      var self = this;

      self.scrollEvent = self.scrollEvent.bind(this);
      self.parallaxEvent = self.parallaxEvent.bind(this);

      setTimeout(function () {
        self.getPosition(); // 获取每个元素的位置，存放在一个数组。
        self.getParallaxPosition();
        self.scrollEvent();

        var _scrollEvent = throttlePro(self.scrollEvent, 100, 300);

        document.addEventListener('scroll', function () {
          _scrollEvent();
          self.parallaxEvent();
        }, false);


        // 改变窗口大小，重新初始化一些数据
        window.addEventListener('resize', function () {
          throttle(function () {
            self.windowHeight = ('innerHeight' in window) ? window.innerHeight : document.documentElement.clientHeight;
            self.getPosition();
            self.getParallaxPosition();

            self.scrollEvent();
            console.log('滚动插件提示：你拖动了窗口');
          });
        }, false);

      }, 0);
    }
  };

  $.scrollAnimate = ScrollAnimate;
})(alan);