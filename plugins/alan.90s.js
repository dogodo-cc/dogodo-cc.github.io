/**
 *  此js文件，在使用 MUI 的核心代码基础上，添加了自己平时收集的常用方法
 *  致谢：MUI https://github.com/dcloudio/mui
 *
 *  author:alan
 *  date: 2017-12
 *  tel:151-0502-9536
 *  link:https://www.dogodo.cc
 */
var alan = (function (document, undefined) {
  var readyRE = /complete|loaded|interactive/;
  var idSelectorRE = /^#([\w-]+)$/;
  var classSelectorRE = /^\.([\w-]+)$/;
  var tagSelectorRE = /^[\w-]+$/;
  var translateRE = /translate(?:3d)?\((.+?)\)/;
  var translateMatrixRE = /matrix(3d)?\((.+?)\)/;

  var $ = function (selector, context) {
    context = context || document;
    if (!selector)
      return wrap();
    if (typeof selector === 'object')
      if ($.isArrayLike(selector)) {
        return wrap($.slice.call(selector), null);
      } else {
        return wrap([selector], null);
      }
    if (typeof selector === 'function')
      return $.ready(selector);
    if (typeof selector === 'string') {
      try {
        selector = selector.trim();
        if (idSelectorRE.test(selector)) {
          var found = document.getElementById(RegExp.$1);
          return wrap(found ? [found] : []);
        }
        return wrap($.qsa(selector, context), selector);
      } catch (e) {
      }
    }
    return wrap();
  };

  var wrap = function (dom, selector) {
    dom = dom || [];

    // Object.setPrototypeOf(obj, prototype)
    // 设置一个指定的对象的原型 ( 即, 内部[[Prototype]]属性）到另一个对象或  null。
    Object.setPrototypeOf(dom, $.fn);
    dom.selector = selector || '';
    return dom;
  };


  $.data = {};
  /**
   * extend(simple)
   * @param {type} target
   * @param {type} source
   * @param {type} deep
   * @returns {unresolved}
   */
  $.extend = function () { //from jquery2
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;

    if (typeof target === "boolean") {
      deep = target;

      target = arguments[i] || {};
      i++;
    }

    if (typeof target !== "object" && !$.isFunction(target)) {
      target = {};
    }

    if (i === length) {
      target = this;
      i--;
    }

    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];

          if (target === copy) {
            continue;
          }

          if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && $.isArray(src) ? src : [];

            } else {
              clone = src && $.isPlainObject(src) ? src : {};
            }

            target[name] = $.extend(deep, clone, copy);

          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    return target;
  };
  /**
   * mui noop(function)
   */
  $.noop = function () {
  };
  /**
   * mui slice(array)
   */
  $.slice = [].slice;
  /**
   * mui filter(array)
   */
  $.filter = [].filter;

  $.type = function (obj) {
    return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
  };
  /**
   * mui isArray
   */
  $.isArray = Array.isArray ||
    function (object) {
      return object instanceof Array;
    };
  /**
   * mui isArrayLike
   * @param {Object} obj
   */
  $.isArrayLike = function (obj) {
    var length = !!obj && "length" in obj && obj.length;
    var type = $.type(obj);
    if (type === "function" || $.isWindow(obj)) {
      return false;
    }
    return type === "array" || length === 0 ||
      typeof length === "number" && length > 0 && (length - 1) in obj;
  };
  /**
   * mui isWindow(需考虑obj为undefined的情况)
   */
  $.isWindow = function (obj) {
    return obj != null && obj === obj.window;
  };
  /**
   * mui isObject
   */
  $.isObject = function (obj) {
    return $.type(obj) === "object";
  };
  /**
   * mui isPlainObject
   */
  $.isPlainObject = function (obj) {
    return $.isObject(obj) && !$.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
  };
  /**
   * mui isEmptyObject
   * @param {Object} o
   */
  $.isEmptyObject = function (o) {
    for (var p in o) {
      if (p !== undefined) {
        return false;
      }
    }
    return true;
  };
  /**
   * mui isFunction
   */
  $.isFunction = function (value) {
    return $.type(value) === "function";
  };
  /**
   * mui querySelectorAll
   * @param {type} selector
   * @param {type} context
   * @returns {Array}
   */
  $.qsa = function (selector, context) {
    context = context || document;
    return $.slice.call(classSelectorRE.test(selector)
      ? context.getElementsByClassName(RegExp.$1)
      : tagSelectorRE.test(selector)
        ? context.getElementsByTagName(selector)
        : context.querySelectorAll(selector));
  };
  /**
   * ready(DOMContentLoaded)
   * @param {type} callback
   * @returns {_L6.$}
   */
  $.ready = function (callback) {
    if (readyRE.test(document.readyState)) {
      callback($);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        callback($);
      }, false);
    }
    return this;
  };
  /**
   * 将 fn 缓存一段时间后, 再被调用执行
   * 此方法为了避免在 ms 段时间内, 执行 fn 多次. 常用于 resize , scroll , mousemove 等连续性事件中;
   * 当 ms 设置为 -1, 表示立即执行 fn, 即和直接调用 fn 一样;
   * 调用返回函数的 stop 停止最后一次的 buffer 效果
   * @param {Object} fn
   * @param {Object} ms
   * @param {Object} context
   */
  $.buffer = function (fn, ms, context) {
    var timer;
    var lastStart = 0;
    var lastEnd = 0;
    var ms = ms || 150;

    function run() {
      if (timer) {
        timer.cancel();
        timer = 0;
      }
      lastStart = $.now();
      fn.apply(context || this, arguments);
      lastEnd = $.now();
    }

    return $.extend(function () {
      if (
        (!lastStart) || // 从未运行过
        (lastEnd >= lastStart && $.now() - lastEnd > ms) || // 上次运行成功后已经超过ms毫秒
        (lastEnd < lastStart && $.now() - lastStart > ms * 8) // 上次运行或未完成，后8*ms毫秒
      ) {
        run.apply(this, arguments);
      } else {
        if (timer) {
          timer.cancel();
        }
        timer = $.later(run, ms, null, $.slice.call(arguments));
      }
    }, {
      stop: function () {
        if (timer) {
          timer.cancel();
          timer = 0;
        }
      }
    });
  };
  /**
   * each
   * @param {type} elements
   * @param {type} callback
   * @returns {_L8.$}
   */
  $.each = function (elements, callback, hasOwnProperty) {
    if (!elements) {
      return this;
    }
    if (typeof elements.length === 'number') {
      [].every.call(elements, function (el, idx) {
        return callback.call(el, idx, el) !== false;
      });
    } else {
      for (var key in elements) {
        if (hasOwnProperty) {
          if (elements.hasOwnProperty(key)) {
            if (callback.call(elements[key], key, elements[key]) === false) return elements;
          }
        } else {
          if (callback.call(elements[key], key, elements[key]) === false) return elements;
        }
      }
    }
    return this;
  };
  $.focus = function (element) {
    if ($.os.ios) {
      setTimeout(function () {
        element.focus();
      }, 10);
    } else {
      element.focus();
    }
  };
  /**
   * trigger event
   * @param {type} element
   * @param {type} eventType
   * @param {type} eventData
   * @returns {_L8.$}
   */
  $.trigger = function (element, eventType, eventData) {
    element.dispatchEvent(new CustomEvent(eventType, {
      detail: eventData,
      bubbles: true,
      cancelable: true
    }));
    return this;
  };
  /**
   * getStyles
   * @param {type} element
   * @param {type} property
   * @returns {styles}
   */
  $.getStyles = function (element, property) {
    var styles = element.ownerDocument.defaultView.getComputedStyle(element, null);
    if (property) {
      return styles.getPropertyValue(property) || styles[property];
    }
    return styles;
  };
  /**
   * parseTranslate
   * @param {type} translateString
   * @param {type} position
   * @returns {Object}
   */
  $.parseTranslate = function (translateString, position) {
    var result = translateString.match(translateRE || '');
    if (!result || !result[1]) {
      result = ['', '0,0,0'];
    }
    result = result[1].split(",");
    result = {
      x: parseFloat(result[0]),
      y: parseFloat(result[1]),
      z: parseFloat(result[2])
    };
    if (position && result.hasOwnProperty(position)) {
      return result[position];
    }
    return result;
  };
  /**
   * parseTranslateMatrix
   * @param {type} translateString
   * @param {type} position
   * @returns {Object}
   */
  $.parseTranslateMatrix = function (translateString, position) {
    var matrix = translateString.match(translateMatrixRE);
    var is3D = matrix && matrix[1];
    if (matrix) {
      matrix = matrix[2].split(",");
      if (is3D === "3d")
        matrix = matrix.slice(12, 15);
      else {
        matrix.push(0);
        matrix = matrix.slice(4, 7);
      }
    } else {
      matrix = [0, 0, 0];
    }
    var result = {
      x: parseFloat(matrix[0]),
      y: parseFloat(matrix[1]),
      z: parseFloat(matrix[2])
    };
    if (position && result.hasOwnProperty(position)) {
      return result[position];
    }
    return result;
  };
  $.hooks = {};
  $.addAction = function (type, hook) {
    var hooks = $.hooks[type];
    if (!hooks) {
      hooks = [];
    }
    hook.index = hook.index || 1000;
    hooks.push(hook);
    hooks.sort(function (a, b) {
      return a.index - b.index;
    });
    $.hooks[type] = hooks;
    return $.hooks[type];
  };
  $.doAction = function (type, callback) {
    if ($.isFunction(callback)) { //指定了callback
      $.each($.hooks[type], callback);
    } else { //未指定callback，直接执行
      $.each($.hooks[type], function (index, hook) {
        return !hook.handle();
      });
    }
  };
  /**
   * setTimeout封装
   * @param {Object} fn
   * @param {Object} when
   * @param {Object} context
   * @param {Object} data
   */
  $.later = function (fn, when, context, data) {
    when = when || 0;
    var m = fn;
    var d = data;
    var f;
    var r;

    if (typeof fn === 'string') {
      m = context[fn];
    }

    f = function () {
      m.apply(context, $.isArray(d) ? d : [d]);
    };

    r = setTimeout(f, when);

    return {
      id: r,
      cancel: function () {
        clearTimeout(r);
      }
    };
  };
  $.now = Date.now || function () {
    return +new Date();
  };
  var class2type = {};
  $.each(['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'], function (i, name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });
  if (window.JSON) {
    $.parseJSON = JSON.parse;
  }
  /**
   * $.fn
   */
  $.fn = {
    each: function (callback) {
      [].every.call(this, function (el, idx) {
        return callback.call(el, idx, el) !== false;
      });
      return this;
    }
  };

  //------------------------ 开始添加自己的代码库

  /**
   *
   * @param {*} elem    要插入的元素对象
   * @param {*} tarElem 要插入元素的目标对象
   * 原理：在目标元素是父亲元素的最后一个子元素的情况下，则直接在父亲元素里追加 需要插入的元素，
   * 否则，在目标对象的下一个兄弟元素的前面插入 元素对象。
   */
  $.insertAfter = function (elem, tarElem) {
    var parent = tarElem.parentNode;
    if (parent.lastChlid === tarElem) {
      parent.appendChild(elem);
    } else {
      parent.insertBefore(elem, tarElem.nextSibling);
    }
  };

  /**
   * 查找兄弟元素
   * @param {*} o 需要匹配兄弟元素的对象
   */
  $.getSiblings = function (o) {
    var a = [];
    var p = o.previousSibling;
    while (p) {
      if (p.nodeType === 1) {
        a.push(p);
      }
      p = p.previousSibling;
    }
    a.reverse();

    var n = o.nextSibling;
    while (n) {
      if (n.nodeType === 1) {
        a.push(n);
      }
      n = n.nextSibling;
    }
    return a;
  };

  /**
   *
   * @param {*} elem
   */
  $.getElemPosition = function (elem) {
    var oPositon = elem.getBoundingClientRect();
    return {
      top: oPositon.top,
      bottom: oPositon.bottom,
      left: oPositon.left,
      right: oPositon.right,
    };
  };

  /**
   * 在连续整数中取得一个随机数
   * @param  {number}
   * @param  {number}
   * @param  {string} 'star' || 'end' || 'both' =>  随机数包括starNum || endNum || both
   * @return 一个随机数
   */
  $.getRandom = function (starNum, endNum, type) {
    var num = endNum - starNum;
    let result = 0;

    switch (type) {
      case 'star' :
        result = parseInt(Math.random() * num + starNum, 10);
      case 'end' :
        result = Math.floor(Math.random() * num + starNum) + 1;
      case 'both' :
        result = Math.round(Math.random() * num + starNum);
      default :
        result = Math.round(Math.random() * num + starNum);
    }

    return result;
  };

  // 获得数组中最小值
  $.getArrayMin = function (array) {
    return Math.min.apply(Math, array);
  };

  // 获得数组中最大值
  $.getArrayMax = function (array) {
    return Math.max.apply(Math, array);
  };

  // 数组去重复
  $.getArrayNoRepeat = function (array) {
    var noRepeat = [];
    var data = {};
    array.forEach(function (item) {
      if (!data[item]) {
        noRepeat.push(item);
        data[item] = true;
      }
    });
    return noRepeat;
  };

  // 获取元素基于文档的位置
  $.getOffset = function (el) {
    var rect = el.getBoundingClientRect(); // 返回元素的大小及其相对于视口的位置。
    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    }
  };

  // 检测浏览器对css的支持情况
  $.testProperty = function (property) {
    var root = document.documentElement;
    if (property in root.style) {
      root.classList.add(property.toLowerCase());
      return true;
    }

    root.classList.add('no-' + property.toLowerCase());
    return false;
  };


  //------------------------ 结束添加自己的代码库


  /**
   * 兼容 AMD 模块
   **/
  if (typeof define === 'function' && define.amd) {
    define('alan', [], function () {
      return $;
    });
  }

  return $;
})(document);

/**
 * $.os
 * @param {type} $
 * @returns {undefined}
 */
(function ($, window) {
  function detect(ua) {
    this.os = {};
    var funcs = [

      function () { //wechat
        var wechat = ua.match(/(MicroMessenger)\/([\d\.]+)/i);
        if (wechat) { //wechat
          this.os.wechat = {
            version: wechat[2].replace(/_/g, '.')
          };
        }
        return false;
      },
      function () { // isMobile
        var phone = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
        for (let i = 0; i < phone.length; i++) {
          if (ua.indexOf(phone[i]) > 0) {
            return this.os.isMobile = true;
          }
        }
        return this.os.isMobile === true;
      },
      function () { //android
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        if (android) {
          this.os.android = true;
          this.os.version = android[2];

          this.os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
        }
        return this.os.android === true;
      },
      function () { //ios
        var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
        if (iphone) { //iphone
          this.os.ios = this.os.iphone = true;
          this.os.version = iphone[2].replace(/_/g, '.');
        } else {
          var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
          if (ipad) { //ipad
            this.os.ios = this.os.ipad = true;
            this.os.version = ipad[2].replace(/_/g, '.');
          }
        }
        return this.os.ios === true;
      },


    ];
    [].every.call(funcs, function (func) {
      return !func.call($);
    });
  }

  // 将detect方法 "挂在" $ 即alan 身上，这样detect里的 this，就指向了alan，且传了一个参数（ua）进去。
  detect.call($, navigator.userAgent);

})(alan, window);


function throttle(method, context) {
  if (method.timer) {
    clearTimeout(method.timer);
  }
  method.timer = setTimeout(function () {
    method.call(context);
  }, 500);
}

// 函数截流
(function ($, win) {

  // 将需要在 resize 事件中执行的func 都push到这里来，统一执行。
  // 如：alan.resizeFn.push(function(){});

  $.resizeFn = [];

  win.addEventListener('resize', function () {
    if ($.resizeFn.length === 0) return false;
    $.resizeFn.forEach(function (func) {
      throttle(func, win);
    })
  }, false);
})(alan, window);


// 固定时间内执行到截流函数

function throttlePro(fn, delay, mustRunDelay) {
  var timer = null;
  var t_start;
  return function () {
    var context = this, args = arguments, t_curr = +new Date();
    clearTimeout(timer);
    if (!t_start) {
      t_start = t_curr;
    }
    if (t_curr - t_start >= mustRunDelay) {
      fn.apply(context, args);

      t_start = t_curr;
    }
    else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  };
}

// 函数节流
function f(action) {
  let isRunning = false;
  return function () {
    if(isRunning) return;
    isRunning = true;
    window.requestAnimationFrame(() => {
      action();
      isRunning = false;
    })
  }
}



(function( $ ){
  'use strict';
  $.fn.toTop = function(opt){
    var elem = this;
    var doc = $('html, body');
    var options = $.extend({
      autoHide: true,
      offset: 420,
      speed: 500,
      position: true,
      right: 15,
      bottom: 30
    }, opt);
    elem.css({
      'cursor': 'pointer'
    });
    if(options.autoHide){
      elem.css('display', 'none');
    }
    if(options.position){
      elem.css({
        'position': 'fixed',
        'right': options.right,
        'bottom': options.bottom
      });
    }
    elem.click(function(){
      doc.animate({scrollTop: 0}, options.speed);
    });
    $(window).scroll(function(){
      var scrolling = $(window).scrollTop();

      if(options.autoHide){
        if(scrolling > options.offset){
          elem.fadeIn(options.speed);
        }
        else elem.fadeOut(options.speed);
      }
    });
  };
})(jQuery);

function timestampToTime(timestamp) {
  let date = new Date(timestamp);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = date.getDate() + ' ';
  let h = date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return Y + M + D;
}

/**
 **datestr:形如‘2017-06-12’的字符串
 **/
function getDate(datestr) {
  let alan = timestampToTime(datestr).trim();
  var temp = alan.split("-");
  if (temp[1] === '01') {
    temp[0] = parseInt(temp[0], 10) - 1;
    temp[1] = '12';
  } else {
    temp[1] = parseInt(temp[1], 10) - 1;
  }
  //new Date()的月份入参实际都是当前值-1
  var date = new Date(temp[0], temp[1], temp[2]);
  return date;
}

/**
 ***获取两个日期间的所有日期
 ***默认start<end
 **/
function getDiffDate(start, end) {
  var startTime = getDate(start);
  var endTime = getDate(end);
  var dateArr = [];
  while ((endTime.getTime() - startTime.getTime()) > 0) {
    var year = startTime.getFullYear();
    var month = startTime.getMonth().toString().length === 1 ? "0" + (parseInt(startTime.getMonth().toString(), 10) + 1) : (startTime.getMonth() + 1);
    var day = startTime.getDate().toString().length === 1 ? "0" + startTime.getDate() : startTime.getDate();
    dateArr.push(year + "-" + month + "-" + day);
    startTime.setDate(startTime.getDate() + 1);
  }
  return dateArr;
}

