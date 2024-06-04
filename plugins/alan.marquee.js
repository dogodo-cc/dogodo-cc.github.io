/*
* className:{String}    滚动容器的class
* step:{}               是否一步一步的滚
* speed:{Number}        速度
* */

(function ($) {
  let Marquee = function (opt) {

    this.elem = document.querySelector(opt.className);
    if (!this.elem) return console.log('找不到需要滚动的对象');
    this.speed = opt.speed || 40;
    this.step = opt.step || false;
    this.ul = this.elem.querySelector('ul');
    this.liHeight = this.elem.querySelector('li').offsetHeight;
    this.ulHeight = this.ul.offsetHeight;
    this.scrollY = 0;
    this.interval = null;
    this.timeout = null;
    this.init();
  };
  Marquee.prototype = {
    move: function () {

      this.scrollY--;
      this.ul.style.webkitTransform = `translateY(${this.scrollY}px)`;
      
      if (this.step && (-this.scrollY % this.liHeight === 0)) {
        clearInterval(this.interval);
        clearTimeout(this.timeout);
        this.interval = null;
        this.timeout = null;

        this.timeout = setTimeout(() => {
          this.interval = setInterval(this.move, this.speed);
        }, 2000);
      }

      if (-this.scrollY === this.ulHeight) {
        this.scrollY = 0;
        this.ul.style.transform = 'translateY(0px)';
      }

    },
    init: function () {
      this.move = this.move.bind(this);
      this.ul.innerHTML += this.ul.innerHTML;
      this.interval = setInterval(this.move, this.speed);

      this.elem.onmouseover = () => {
        clearInterval(this.interval);
        clearTimeout(this.timeout);
        this.interval = null;
      };
      this.elem.onmouseout = () => {
        if (this.interval === null) {
          this.interval = setInterval(this.move, this.speed)
        }
      };
    }
  };
  $.Marquee = Marquee;
})(alan);