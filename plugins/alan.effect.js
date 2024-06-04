// 鼠标hover产生按压效果
function press_effect(className, angle) {
  let _className = className || '.press-effect';
  var _angle = angle || 2;
  var elems = document.querySelectorAll(_className);
  if (elems.length < 1) {
    return false;
  }
  [].slice.call(elems).forEach(function (elem) {

    elem.addEventListener('mouseout', function () {
      this.style.transform = 'perspective(300px) rotateY(0deg) rotateX(0deg)';
    }, false);

    elem.addEventListener('mousemove', function (event) {
      var w = this.clientWidth;
      var h = this.clientHeight;
      var y = (event.offsetX - w * .5) / w * _angle;
      var x = (1 - (event.offsetY - h * .5)) / h * _angle;
      this.style.transform = 'perspective(300px) rotateY(' + y + 'deg) rotateX(' + x + 'deg)';
    }, false);

  })
}


// 给当前导航加激活class
(function () {
  // 本地
  if (window.location.host.indexOf("0.0.0.0") >= 0 || window.location.host.indexOf("localhost") >= 0 || window.location.host.indexOf("90s.co") >= 0) {
    let href = window.location.href;
    let nav = document.querySelectorAll('.nav > a');
    if (!nav || nav.length === 0) {
      return;
    }

    [].slice.call(nav).forEach(item => {
      let link = item.getAttribute('href');
      if(href.includes(link)){
        item.classList.add('on');
      }
    })

  }
})();



// 视频播放按钮  在按钮元素加上 data-video='id'
function playPause(btn) {
  let id = btn.dataset.video;
  let video = document.getElementById(id);
  let videoCover = document.querySelector('.video-cover');

  video.onended = function () {
    btn.classList.remove('hide');
    videoCover.classList.remove('hide');
  }

  if (btn.dataset.hide === 'true') {
    btn.classList.add('hide');
    videoCover.classList.add('hide');
  }

  if (video.paused) {
    video.play();
    video.controls = true;
  } else {
    video.pause();
    video.controls = false;
  }
}


// 导航栏监听鼠标滚动方向的效果
// 如果需要让导航有监听滚轮的效果   只要加上 '.nav-scroll' 即可根据active 来做相应逻辑
(function ($) {
  var nav = document.querySelectorAll('.nav-scroll');
  if (!nav || nav.length === 0) return;
  console.log(999)

  function wheelEvent(event) {
    var e = event || window.event;

    var deltaY = e.deltaY * -30 ||    // wheel 事件
      e.wheelDeltaY / 4 ||    // mousewheel 事件  chrome
      (e.wheelDeltaY === undefined &&    // 如果没有2D属性
        e.wheelDelta / 4) ||    // 那么就用1D的滚轮属性
      e.detail * -10 ||    // firefox的DOMMouseScroll事件
      0;     // 属性未定义
    if ($.isMacWebkit) {
      deltaY /= 30;
    }

    // if ($.isFirefox() && e.type !== "DOMMouseScroll") {
    //   window.removeEventListener('DOMMouseScroll', wheelEvent, false);
    // }

    if (!e.ctrlKey) {
      if (deltaY > 0) {
        [].slice.call(nav).forEach(function (item) {
          item.classList.remove('active');
        })
      } else {
        [].slice.call(nav).forEach(function (item) {
          item.classList.add('active');
        })
      }
    }
  }

  // 监听鼠标滚轮的事件
  window.addEventListener('mousewheel', wheelEvent, false);

  // if ($.isFirefox()) {
  //   window.addEventListener('DOMMouseScroll', wheelEvent, false);
  // }
})(alan);



// 独立出来的文字展示效果，经常运用在轮播效果的回调函数里。
function font_effect(elems) {
  [].slice.call(elems).forEach(function (elem) {
    elem.style.visibility = 'visible';
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
  })
}
