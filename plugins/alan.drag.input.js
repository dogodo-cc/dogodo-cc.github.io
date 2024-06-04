(function($){
  var DragInput = function(opt){
    this.opt = opt || {};
    this.dragInput = document.getElementById(this.opt.elem); // 初始化的对象
    this.dragBar = this.dragInput.querySelector('.drag-bar');
    this.valueBar = this.dragInput.querySelector('.value-bar');
    this.startBtn = this.dragInput.querySelector('.start-btn');
    this.endBtn = this.dragInput.querySelector('.end-btn');
    this.startBtnVal = this.startBtn.querySelector('span');
    this.endBtnVal = this.endBtn.querySelector('span');

    this.dragBarPosition = this.dragBar.getBoundingClientRect().left;
    this.dragBarWidth = this.dragBar.offsetWidth;
    this.mouseInBtn = 0; // 鼠标相对按钮的距离

    this.targetBtn = null; // 被拖动的按钮
    this.MIN = 0; // 可拖动最小距离（针对end）
    this.MAX = 0; // 可拖动最大距离（针对start）
    this.t = null;

    this.scale = this.opt.scale || [0,100,200,300,400];
    this.length = this.scale.length;
    this.from = this.scale[0];
    this.to = this.scale[this.length - 1];

    if (this.opt.slide) {
      this.step = 1;        // 每步走多少距离
    }else{
      this.stepNum = this.opt.stepNum || 16;            // 分几步走
      this.step = this.dragBarWidth / this.stepNum;     // 每步走多少距离
    }


    this.Percentage = this.to / this.dragBarWidth;    // 百分比
    this.initStartVal = this.opt.initStartVal;        // 初始化的开始值
    this.initEndVal = this.opt.initEndVal;            // 初始化的结束值
    this.init();
  }
  DragInput.prototype = {
    getMinAndMax:function(){
      this.MIN = parseInt(alan.getStyles(this.startBtn,'left'),10) + this.step;
      this.MAX = parseInt(alan.getStyles(this.endBtn,'left'),10) - this.step;
    },
    createScale:function(){
      var self = this;
      var scaleDiv = document.createElement('div');
      scaleDiv.className = 'scale';
      var percent = 100 / (self.length-1);
      for (var i = 0; i < self.length; i++) {
        var _html = '<span style="left: '+percent*i+'%"><ins>'+self.scale[i]+'</ins></span>';
        scaleDiv.innerHTML += _html;
      }
      this.dragInput.appendChild(scaleDiv);
    },
    dragBtnEvent:function(event){
      var self = this;
      var disX = event.clientX - self.dragBarPosition - self.mouseInBtn;
      var n = disX % self.step;

      disX = (n > self.step / 2) ?  disX + (self.step - n) : disX - n;

      // 限制拖动范围
      if (self.targetBtn.classList.contains('start-btn')) {
        disX < 0 && (disX = 0);
        disX > self.MAX && (disX = self.MAX);

        self.valueBar.style.left = disX + 'px';
        self.valueBar.style.width = (self.MAX - disX + self.step) + 'px';

        self.startBtnVal.innerHTML = (disX * self.Percentage).toFixed(0);
      }else{
        disX > self.dragBarWidth && (disX = self.dragBarWidth);
        disX < self.MIN && (disX = self.MIN);

        self.valueBar.style.width = (disX - self.MIN + self.step) + 'px';

        self.endBtnVal.innerHTML = (disX * self.Percentage).toFixed(0);
      }

      self.targetBtn.style.left = disX + 'px';
    },
    mouseupEvent:function(){
      var self = this;
      self.getMinAndMax();
      document.removeEventListener('mousemove',self._dragBtnEvent,false);
      document.removeEventListener('mouseup',self._mouseupEvent,false);
    },
    init:function(){

      this.createScale();

      this.startBtn.style.left = ((this.initStartVal / this.to * this.dragBarWidth) || 0) + 'px';
      this.endBtn.style.left = ((this.initEndVal / this.to * this.dragBarWidth) || this.dragBarWidth) + 'px';

      this.valueBar.style.width = (this.initEndVal - this.initStartVal) / this.to * this.dragBarWidth + 'px';
      this.valueBar.style.left =  (this.initStartVal / this.to ) * this.dragBarWidth + 'px';

      this.startBtnVal.innerHTML = this.initStartVal || this.from;
      this.endBtnVal.innerHTML = this.initEndVal || this.to;

      this.getMinAndMax();

      this._dragBtnEvent = this.dragBtnEvent.bind(this);
      this._mouseupEvent = this.mouseupEvent.bind(this);

      var self = this;
      this.dragBar.onmousedown = function(event){
        var target = event.target;
        if(target.classList.contains('drag-btn')){
          self.targetBtn = target;
          self.mouseInBtn = event.clientX - target.getBoundingClientRect().left;
          document.addEventListener('mousemove',self._dragBtnEvent,false);
          document.addEventListener('mouseup',self._mouseupEvent,false);
        }
        event.preventDefault();
        event.stopPropagation();
      };

      window.onresize = function(){
        clearTimeout(self.t);
        self.t = setTimeout(function(){
          self.dragBarPosition = self.dragBar.getBoundingClientRect().left;
        },200);
      };
    }
  }

  $.DragInput = DragInput;
})(alan);