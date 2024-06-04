// 弹窗
let sharon = {
  toast: function (message) {
    let toast = document.createElement('div');
    toast.className = 'sharon-toast anim-bounceInOut';
    toast.innerHTML = message;
    document.body.appendChild(toast);
    toast.style.marginLeft = -(toast.offsetWidth / 2) + 'px';

    toast.addEventListener('webkitAnimationEnd', function () {
      toast.parentNode && toast.parentNode.removeChild(toast);
    });
  },
  createBox: function (exclusiveClass, opt) {
    sharon.createShade();

    // 弹窗
    let sharonBox = document.createElement('div');
    sharonBox.className = exclusiveClass + ' sharon anim-bounceIn';

    // 标题
    let titleTxt = opt.title || '信息';
    let title = `<div class="sharon-title">${titleTxt}</div>`;
    sharonBox.innerHTML = title;

    // 内容
    let content = document.createElement('div');
    content.className = 'sharon-content';

    // 说明是询问弹窗
    if (exclusiveClass === 'sharon-confirm') {
      opt.message && (content.innerHTML = opt.message);
    }

    // 说明是输入弹窗
    if (exclusiveClass === 'sharon-prompt') {
      let _input = document.createElement('input');
      if (opt.inputType) {
        _input.type = opt.inputType;
      } else {
        _input.type = 'text';
        _input.value = '';
      }
      content.appendChild(_input);
    }

    // 说明是普通弹窗
    if (exclusiveClass === 'sharon-alert') {

      content.innerHTML = opt.html;
    }

    sharonBox.appendChild(content);

    // 关闭按钮
    let closeBtn = '<span class="sharon-closeBtn"><a class="sharon-close" href="javascript:;"></a></span>';
    sharonBox.innerHTML += closeBtn;

    // 操作按钮
    if (opt.btn) {
      let yesBtn = opt.btn[0] || '确定';
      let noBtn = opt.btn[1] || '取消';
      let btn = `<div class="sharon-btn"><a class="yesBtn">${yesBtn}</a><a class="noBtn">${noBtn}</a></div>`;
      sharonBox.innerHTML += btn;
    }

    // 位置
    document.body.appendChild(sharonBox);

    setTimeout(() => {
      sharonBox.style.marginLeft = -(sharonBox.offsetWidth / 2) + 'px';
      sharonBox.style.marginTop = -(sharonBox.offsetHeight / 2) + 'px';
    },0);


    // 事件

    sharonBox.addEventListener('click', function (event) {
      let elem = event.target;
      if (elem.classList.contains('yesBtn')) {

        if (exclusiveClass === 'sharon-prompt') {
          // 输入弹窗需要验证
          let _val = sharonBox.querySelector('input').value;
          if (_val && opt.Reg.test(_val)) {
            sharon.closeSharon(elem);
            opt.yes && opt.yes();
            return true;
          } else {
            sharon.toast('输入格式不正确！');
          }
          return false;
        }

        sharon.closeSharon(elem);
        opt.yes && opt.yes();
      }
      if (elem.classList.contains('noBtn')) {

        sharon.closeSharon(elem);
        opt.no && opt.no();
      }
      if (elem.classList.contains('sharon-close')) {
        sharon.closeSharon(elem);
        opt.close && opt.close();
      }
      event.preventDefault();
      event.stopPropagation();
    });
  },
  confirm: function (opt) {
    sharon.createBox('sharon-confirm', opt);
  },
  prompt: function (opt) {
    sharon.createBox('sharon-prompt', opt);
  },
  alert: function (opt) {
    sharon.createBox('sharon-alert', opt);
  },
  closeSharon: function (elem) {
    //关闭窗口
    let SharonTips = elem.parentNode;
    while (!SharonTips.classList.contains('sharon')) {
      SharonTips = SharonTips.parentNode;
    }
    SharonTips.parentNode && SharonTips.parentNode.removeChild(SharonTips);

    sharon.removeShade();
  },
  createShade: function () {
    // 创建遮罩
    if (!document.querySelector('.sharon-shade')) {
      let shade = document.createElement('div');
      shade.className = 'sharon-shade';
      document.body.appendChild(shade);
    }
  },
  removeShade: function () {
    // 关闭遮罩
    let shade = document.querySelector('.sharon-shade');
    shade && shade.parentNode && shade.parentNode.removeChild(shade);
  }
};
