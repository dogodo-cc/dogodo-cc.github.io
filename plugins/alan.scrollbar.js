/*

 var ScrollBar = new alan.ScrollBar({
    elem:'.scroll-box',
    showBar:true,
    direction:vertical,landscape
 });

*/


// 自定义滚动条
(function ($, $$) {
  function ScrollBar(opt) {
    this.opt = opt || {};
    this.speed = this.opt.speed || 20;
    this.direction = this.opt.direction || 'vertical';          // 默认为垂直
    this.scrollBox = document.querySelector(this.opt.elem);     // 滚动主容器

    // 容器的高度  如果滚动方向是水平的，就取容器的宽度
    this.scrollBoxHeight = (this.direction === 'vertical') ? this.scrollBox.offsetHeight : this.scrollBox.offsetWidth;

    // 是否显示 自定义的滚动条
    if (this.opt.showBar) {
      this.scrollBar = this.scrollBox.querySelector('.scroll-bar');
      this.scrollBtn = this.scrollBox.querySelector('.scroll-btn');

      this.scrollBtnHeight = this.scrollBtn.offsetHeight;         // 按钮的高度
      this.scrollBarHeight = this.scrollBar.offsetHeight;         // 滚动条的高度

      this.MAXDIS = this.scrollBarHeight - this.scrollBtnHeight;  // 可拖动最大距离
      this.scrollBarPosition = this.scrollBar.getBoundingClientRect().top; // 滚动条基于文档的Y距离
    }

    this.scrollCon = this.scrollBox.querySelector('.scroll-con');

    // 文章可以滚动内容高度 or 宽度
    if (this.direction === 'vertical') {
      this.scrollConHeight = this.scrollCon.scrollHeight - this.scrollBoxHeight;
    } else {
      this.scrollConHeight = this.scrollCon.scrollWidth - this.scrollBoxHeight;
    }

    this.mouseClickPosition = 0;                                    // 鼠标点击在按钮的距离
    this.init();
  }

  ScrollBar.prototype = {
    scrollTheBox: function (dis) {

      var self = this;
      var _scrollTop = dis * self.scrollConHeight / self.MAXDIS;

      if (self.direction === 'vertical') {
        self.scrollCon.scrollTop = _scrollTop;
      }

      if (self.direction === 'landscape') {
        self.scrollCon.scrollLeft = _scrollTop;
      }

    },
    makeBtnMove: function (scrollDis) {
      var self = this;
      if (!self.opt.showBar) {
        return;  // 如果不显示滚动条，直接跳出。
      }

      var _moveY = scrollDis * self.MAXDIS / self.scrollConHeight;

      if (self.direction === 'vertical') {
        self.scrollBtn.style.top = _moveY + 'px';
      }

      if (self.direction === 'landscape') {
        self.scrollBtn.style.left = _moveY + 'px';
      }

    },
    mouseMoveEvent: function (event) {
      var self = this;
      var dis = event.clientY - self.scrollBarPosition - self.mouseClickPosition;

      // 限制范围
      dis > self.MAXDIS && (dis = self.MAXDIS);
      dis < 0 && (dis = 0);

      self.scrollBtn.style.top = dis + 'px';

      self.scrollTheBox(dis);
    },
    mouseUpEvent: function (event) {
      var self = this;
      self.scrollCon.classList.remove('scrolling');
      document.removeEventListener('mousemove', self._MoveEvent, false);
      document.removeEventListener('mouseup', self._UpEvent, false);

    },
    wheelEvent: function (event) {
      var self = this;
      var e = event || window.event;

      e.preventDefault();
      e.stopPropagation();

      var deltaY = e.deltaY * -30 ||    // wheel 事件
        e.wheelDeltaY / 4 ||    // mousewheel 事件  chrome
        (e.wheelDeltaY === undefined &&    // 如果没有2D属性
          e.wheelDelta / 4) ||    // 那么就用1D的滚轮属性
        e.detail * -10 ||    // firefox的DOMMouseScroll事件
        0;     // 属性未定义
      if ($.isMacWebkit) {
        deltaY /= 30;
      }

      if ($.isFirefox() && e.type !== "DOMMouseScroll") {
        self.scrollCon.removeEventListener('DOMMouseScroll', self._wheelEvent, false);
      }


      if (self.direction === 'vertical' && !e.ctrlKey) {
        if (deltaY > 0) {
          self.scrollCon.scrollTop -= self.speed;
        } else {
          self.scrollCon.scrollTop += self.speed;
        }
        self.makeBtnMove(self.scrollCon.scrollTop);
      }


      if (self.direction === 'landscape' && !e.ctrlKey) {
        if (deltaY > 0) {
          //self.scrollCon.scrollLeft -= self.speed;

          $$(self.scrollCon).stop().animate({
            scrollLeft: self.scrollCon.scrollLeft - self.speed
          }, 500, 'linear');
        } else {
          //self.scrollCon.scrollLeft += self.speed;

          $$(self.scrollCon).stop().animate({
            scrollLeft: self.scrollCon.scrollLeft + self.speed
          }, 500, 'linear');
        }
        self.makeBtnMove(self.scrollCon.scrollLeft);
      }

    },
    init: function () {
      this._MoveEvent = this.mouseMoveEvent.bind(this);
      this._UpEvent = this.mouseUpEvent.bind(this);
      this._wheelEvent = this.wheelEvent.bind(this);

      var self = this;


      if (self.opt.showBar) {
        // 拖动滚轮的事件
        self.scrollBtn.onmousedown = function (event) {
          var e = event || window.event;

          // 每次点击都获取一次按钮位置，以得到鼠标与按钮顶部的距离
          var scrollBtnPosition = this.offsetTop;
          self.mouseClickPosition = e.clientY - self.scrollBarPosition - scrollBtnPosition;

          self.scrollCon.classList.add('scrolling'); // 防止拖动的时候选中文字

          document.addEventListener('mousemove', self._MoveEvent, false);
          document.addEventListener('mouseup', self._UpEvent, false);
        };
      }


      // 监听鼠标滚轮的事件
      self.scrollCon.addEventListener('mousewheel', self._wheelEvent, false);

      if ($.isFirefox()) {
        self.scrollCon.addEventListener('DOMMouseScroll', self._wheelEvent, false);
      }
    }
  };
  $.ScrollBar = ScrollBar;
})(alan, jQuery);