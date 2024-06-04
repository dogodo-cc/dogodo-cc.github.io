var canvas, stage, container, stageWidth, stageHeight, manifest, preLoad, progressTxt, mainY, moveY, panlock, share, animate;
var bg = {};
var imgs = {};
var bgmIndex = 0;
var maxHeight = -13850;
var changeRate = 0.3;
var startPosition = 0.9;
var auBgmF = true;
var bgmObj = document.getElementById("auBgm");
mainY = 0;
panlock = true;


// 判断是PC端执行的操作
var platform = isMobile();
if (platform) {
    document.querySelector('meta[name="viewport"]').setAttribute("content", "width=640, user-scalable=no");
} else {
    document.querySelector("#main").className = "PCView";
    var img = new Image();
    img.src = "https://n.sinaimg.cn/news/hongkong20/img/pccover.png";
    img.className = "pccover";
    document.querySelector("body").appendChild(img);
    document.querySelector(".pccover").style.display = "block";
    document.querySelector('meta[name="viewport"]').setAttribute("content", "width=device-width,width=device-width,initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no");
}

bgmObj.oncanplay = function() {
    if (auBgmF) {
        bgmObj.play();
    }
};
bgmObj.onplay = function() {
    auBgmF = false;
};
document.addEventListener("touchstart", function() {
    if (auBgmF) {
        bgmObj.play();
        auBgmF = false;
    }
});
document.addEventListener("WeixinJSBridgeReady", function() {
    if (auBgmF) {
        bgmObj.play();
        auBgmF = false;
    }
});

// 判断是否支持触摸事件
var hasTouch = "ontouchstart" in window;
var startEvent = hasTouch ? "touchstart" : "mousedown";
var moveEvent = hasTouch ? "touchmove" : "mousemove";
var endEvent = hasTouch ? "touchend" : "mouseup";

function isMobile() {
    var b = navigator.userAgent;
    var c = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    for (var a = 0; a < c.length; a++) {
        if (b.indexOf(c[a]) > 0) {
            return true;
        }
    }
}
function isWeiXin() {
    var a = window.navigator.userAgent.toLowerCase();
    if (a.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
function init() {
    if (platform) {
        document.querySelector("body").addEventListener("touchmove", function(a) {
            a.preventDefault(); // 阻止了默认滑动事件
        });
        stageWidth = 640;
        stageHeight = 1136;
        canvas = document.getElementById("mainView");
        canvas.width = stageWidth;
        canvas.height = stageHeight;
        stage = new createjs.Stage(canvas);
        container = new createjs.Container();
        stage.addChild(container);
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", setStage);
        preLoad();
    }
}
function setStage() {
    stage.update();
}
function preLoad() {
    var c = new createjs.Container();
    container.addChild(c);
    c.x = 0;
    c.y = 0;
    var b = new createjs.Bitmap("https://n.sinaimg.cn/news/hongkong20/img/fbg.jpg");
    b.x = 0;
    b.y = 0;
    b.height = 1136;
    b.alpha = 1;
    container.addChild(b);
    var d = createjs.Tween.get(b, {
        loop: true
    }).to({
        x: -500
    }, 10000).to({
        x: 0
    }, 10000);
    var a = new createjs.Bitmap("https://n.sinaimg.cn/news/hongkong20/img/fimg.png");
    a.x = 0;
    a.y = 0;
    a.alpha = 1;
    container.addChild(a);
    progressTxt = new createjs.Text("", "20px Arial", "#ffffff");
    progressTxt.x = stageWidth / 2 - progressTxt.getMeasuredWidth() / 2;
    progressTxt.y = stageHeight / 1.5;
    progressTxt.alpha = 1;
    stage.addChild(progressTxt);
    progressTxt;
    setupManifest();
    startPreload();
}
function setupManifest() {
    manifest = [{
        src: "https://n.sinaimg.cn/news/hongkong20/img/fbg.jpg",
        id: "fBg",
        x: 0,
        s_x: 0,
        y: 0,
        s_y: 0,
    }, {
        src: "https://n.sinaimg.cn/news/hongkong20/img/fimg.png",
        id: "fImg",
        x: 0,
        s_x: 0,
        y: 0,
        s_y: 0,
    }, {
        src: "https://n.sinaimg.cn/news/hongkong20/img/ftxt.png",
        id: "fTxt",
        x: 75,
        s_x: 75,
        y: 810,
        s_y: 810,
    }, {
        src: "https://n.sinaimg.cn/news/hongkong20/img/share.png",
        id: "share",
    }];
    // 把需要预加载的图片push到manifest数组去
    for (var a = lData.imgs.length - 1; a >= 0; a--) {
        manifest.push(lData.imgs[a]);
    }
}
function startPreload() {
    preload = new createjs.LoadQueue(true);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}
function handleFileLoad(a) {}
function loadError(a) {}
function handleFileProgress(b) {
    progressTxt.text = "已加载 " + (preload.progress * 100 | 0) + " %";
    progressTxt.x = stageWidth / 2 - progressTxt.getMeasuredWidth() / 2;
    if (preload.progress === 1) {
        var c = "ftxt";
        imgs[c] = new createjs.Bitmap("https://n.sinaimg.cn/news/hongkong20/img/ftxt.png");
        imgs[c].x = 75;
        imgs[c].y = 810;
        imgs[c].alpha = 0;
        container.addChild(imgs[c]);
        var a = createjs.Tween.get(imgs[c]).to({
            alpha: 1
        }, 1000);
        var a = createjs.Tween.get(progressTxt).to({
            alpha: 0
        }, 1000).call(function() {
            resetAll(0);
            start();
        });
    }
}
function loadComplete(e) {
    for (var d = 0; d < lData.imgs.length; d++) {
        var c = lData.imgs[d];
        var f = c.id;
        var b = preload.getResult(f);
        if (c.animate) {
            var a = new createjs.SpriteSheet(c.animate);
            imgs[f] = new createjs.Sprite(a, "go");
            imgs[f].scaleX = c.scale;
            imgs[f].scaleY = c.scale;
        } else {
            if (f === "ebtn_2") {
                imgs[f] = new createjs.Bitmap("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANkAAABsCAMAAADQZ+eCAAABZVBMVEUAAAD///////////////////////////////////////////////8cHBz////////////////////////////////8/Pz///////////////////////////////////////////////////////////////8DAwP///8EBAQJCQkQEBAXFxcxMTFbW1sDAwMaGho6OjpLS0uPj4/5+fkKCgrLy8sYGBgmJiZDQ0NUVFSCgoLMzMyBgYHCwsJ6enq2trYKCgonJycgICASEhI5OTmioqKqqqr///8AAAC/v7+AgIBAQECqqqp/f38QEBDv7++fn58gICDPz8/f39/Z2dlgYGCvr69QUFAwMDCPj49wcHD7+/uHh4fW1taTk5P39/dHR0cKCgrm5ubAwMCXl5ft7e3p6enS0tK4uLh3d3fy8vLOzs7FxcWnp6egoKCdnZ1zc3MuLi4aGhrb29s4ODgZGRno2eh4AAAASHRSTlMABQMBECEKLBg5CQ0Vvx40KAsHFxwSKh8POBQkGTAaNS0rIDInJkD2I+/czcWheP20i2xbP+REpJtqZFVLS0A6OLGQh3FIIRIyjxERAAAIuElEQVR42uzTy46CMBiG4RnFU0vUUqAFz0QiCTtWXgLExMQFOw4aV+68/9W0QAmTzAXMb3ivoE++v1+qYdMAagrw9Ssl+oadEnZdtcpAVWN4oSpDGLq2xoUQIRhzrsGMc4wJQaix1TLpMhDBmuXqOqVTiFGq666lYSKHE7R6MgGTLpduzTnzRjDz2NzcUlfaBG04bCZDhFvUZIG/tA8TmB3spR8wk1qcoGY0MZlBuLtmK3u/Wewcx5nBS7x6t9js7RVbu5wYYrRmMmytvWMUnhLYncLo6K0tXI1WT6ZRdjwnn9D5yKhWjzaUk7nmKko+o2hluhg1MjmZHSbJ4xnD7vlIktCWo9Uyg1jbYC/+GHSYoIm/tg+2FjGkrDpGfyOGjOEnFBu/Osdaps+Xi4+RLZZzXcm4zuxdK8uKW35Rxf+2S6f8VmStbGcznUvZQMiod3Ba2atMsxhWWVq+Wplz8KiQDaRMo6NJKyvKewyve1m0ssmIako27cjeaQyx9N2RTRvZWMpmSpZDnEwcZK5kMykb/yG7xjC79jJw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");
            } else {
                if (f === "ebtn_1") {
                    imgs[f] = new createjs.Bitmap("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANkAAABsCAMAAADQZ+eCAAABVlBMVEUAAAD///////////////////////////////////////////////////8cHBz////////////////////////////////////////////////////////////////////////8/Pz///////////8DAwMEBAQJCQkuLi4QEBAXFxdbW1tKSkoaGho6OjqPj4/Hx8f5+fkCAgJOTk6FhYUICAjMzMx6enq2trYKCgokJCQLCwsnJycgICASEhJ6eno5OTnJycmioqKqqqr///8AAABAQECAgICqqqq/v79/f3/Z2dkwMDDPz88gICCPj4/v7++fn58QEBD7+/twcHBgYGDf39/W1taTk5MJCQn39/fn5+eGhoavr69HR0fAwMCXl5d2dnbr6+vS0tK4uLhQUFAZGRny8vLFxcWnp6ednZ2Kiorc3NzQ0NBtbW1TU1M4ODgTExMiYbmIAAAARHRSTlMABQMBChAhLDkYCQ4eFb80KBwHFxEZDSYMIhQwNxMrKTIqQCUk9e/en83FeG60i1tFP/dkTelLOjixqJ+Qh3FaSDkhErISiN4AAAbzSURBVHja7NNBjoIwFMbx0SmgtESxIFhRQoKJJBwDYiIrwwKixJUr73+AeXSKSDIHmGf4n6C/fK9fXd+qKdY6wNegTjTBXSccuKRqZcoIvkzZSup6m3KByF9TSjWcwcvXPgilTdEA1s7lU80RlsX5HGOcW5ZwNOq3wwFNTQaDEeoI7tqM6VhjzHa5cCiB2WA0NRnAdtxmG28Z7Q2c7aOlt2E23wFNjQaTrQgVLotDY7sIghnOgmCxNcKYuYKSFYymJqM7V/fS5JDj7pCknu7uqBxNTuY7nHnH/BM6eow7PowmZSYVdpzmn1Ea24KaSkY0zsIkz++3DHe3e54nIeMa+ZXBMbobA/4YdhjQ4K8ZGxfOsZVNzLWwvS0MmeEPFFvPFmtzImXUYsvFx8gWS2bRXhYFL1lZXZpTV/ZvO73VXKryJQsiJZuCjOv7XvaoizLDVVnUj1621znIpq1M47ox62RVfc3wda2rTjYzdK51svmb7FlkGCueb7K5kpGBrME4GRxkM5CRP2TnDGfnUYauUYavUYavUfbDbb3kuAoDURjeXJ0qleQHIJxZD7P/LVzbctpxQkho1Ibbn+QREuLHuMT/54gyqyozW/rAoNFAheVk7lLGKyjBS0ofuCASIs08EqPZ8LtlWLGjrDIA3OJt9IxlhlnGgT7hEX0dUMbVhGjiihrXfJm2sohCLnP8rUPZHUbET0/GBR7CZ/rMlJpymdC3LmV6Y8rpLm6X8QJveWGXds9clzK8sLeshScTHVlWjUg8NfaUOXts2UWKCYk0RnpLkEk9Z1WfMr2fIFrLFCt4YxlLQ09dNvOKuSl7Il3K/P1s9I9fo0F95e3XyG/KVdzrsuMnyIjEDPTkXVnE92VGy/JnKBsCFukPypjK0hOUqdv1Q1zKhqU9O3SCDFcUhqtpc5niweFlurhFvLnMdy9TESRBRBwiJyIBiYjmsqC8f88Y4Hz3ssKvlwlWCJGGCxHvP2cAbDNBDi+rDxekcj8o83TWsn3nDIGasisA32mCVHWCFPu/xtlTW4bI/oUyN9zKVG1awDRS/7KvpTKv1YYyi8xYIk1Vjc5ljMz8a+fcmtIGwjBcWggWEuOSwxooJBgKPWnroedzy4d2wJZWp9V2rFZn1I49/v+bfrskbBAP3JlNfe70IsMz2RdYsu93vNkqMLrNEcB93fG8ORuzxVNWY2v0rXTnQ5zMWt2TzTofRzZb7S53zsSsxYgE4P0iwv8W/xliozkardX3XR63d4vDfIzfE4vjkf1ZzNGcm52bnZvJx7mZfPzPZjE+Onwii0eY5QbMDvaaMrJ3MGB21Dnijc2mjGxuDJ0jDs5+982+rLXlO2/7ub32pW8WnP0ePtW+s7X5qR0Q49PS7QifNrd2hk61B00EN9KxaEvYRGhHOhZutGNBqJeY9ohHSWhWsMvET0bjZwUtSj4p24UUb2mlWUurDrDflJ19gDpraaULYbNOU+k0wO7W0mksD6Z4KV6s7QJMU1ULm3VYQCtbzsIcjMBSVGxpHWLH3IJjle2wDVnAm0b8+Tqcyt/PkTX9DeJHfd4nWiaoHfObZhpq7cHM9PhJoPkvIdb9CgB3x2PF9MyDmmqY7JaJprhpEIVWsyXP0wdh3fHZKeTeXPSxwc5bFLtxb2oWO9p6HPC8UrZKFWKY2BQPzZiabWoWURyf0okBXBd19TE0mwHoDEbs2uyYXsJavetOnD2U+o5CLM20mVjPrKc2mTc1wyKEqIdQHJr1UO06wLtoxK7eHPOyLl5OjQWEEMvQzPxkTwzNArVUDt0yZrlY1AZBW4Vmr0zdBljfbnK2WcQat/XShKOyy8WCYrFsZtArlwrEhBobfYKzT2w7HwVtNeJU9KlrAL+bnJ88Yne8iq9aGrtcHMDXPZlmg09CMaGGckihkDtEmk1rcL3ZuwC9luh3HrEreMNYWm28XDwoFFJci4sJxNCk1CFyvPuv3wTYXRER07NUtYoZNkElLogRSkJL2A2BomimVPVxgG8iYl6lFry98qk3MeLCiFwKvy/fWQfAXu9yL2KlqkM00w7DKiPBiA1amgH4E4mYwlaizGL9ERteA2BrZVVEjE27kdiLifERG5XnAOs/WiJi7INeZjE04yM2atlHAJ0gYi6LmNwrMYyZRvxqHRAeMSoiJq8Xn/HFt263AHjEvKwvf8SQ/qa0dgOQxgK+2ScgYlGz+4CMv6xQJQkRi5hZT1HsSZU6fP6X7BETZvny5QbU5x1FJUYSIibMbPMFNO4TYl0uJiJinGD84eOHrwxDK5r5REQMCX4hyb1+ljHNcLuaCK/+MM70ZG+/mpCVyM0CNU4qKStRjIYNuZgcMa6GcK1EeTEz7tbTSpIYqgXI6PUP8JnYfx865aUAAAAASUVORK5CYII=");
                } else {
                    imgs[f] = new createjs.Bitmap(b);
                }
            }
        }
        imgs[f].x = c.x;
        imgs[f].y = c.y;
        imgs[f].alpha = 0;
        container.addChild(imgs[f]);
    }
}
function start() {
    addShare();
    bindEvent();
}
function addShare() {
    share = new createjs.Container();
    share.x = 0;
    share.y = 0;
    share.alpha = 0;
    share.visible = false;
    stage.addChild(share);
    var a = preload.getResult("share");
    a.x = 0;
    a.y = 0;
    var b = new createjs.Bitmap(a);
    share.addChild(b);
}
function bindEvent() {
    var b = 0;
    var a = 0;
    canvas.addEventListener(startEvent, function(c) {
        if (panlock) {
            b = c.touches[0].clientY;
        }
    });
    canvas.addEventListener(moveEvent, function(d) {
        if (panlock) {
            a = d.touches[0].clientY - b;
            var c = mainY + a;
            if (c < 0 && c > maxHeight) {
                container.y = c;
                resetAll(c);
            }
        }
    });
    canvas.addEventListener(endEvent, function(f) {
        if (panlock) {
            if (mainY + a * 1.1 < 0 && mainY + a * 1.1 > maxHeight + 500) {
                mainY += a;
                var d = new createjs.Tween.get(container).to({
                    y: mainY + (a / 10)
                }, 300, createjs.Ease.circOut(300)).call(function() {
                    mainY += parseInt(a / 10);
                }).addEventListener("change", function(g) {
                    resetAll(container.y);
                });

                // 获取音乐索引
                var c = getBgmIndex(mainY);
                if (typeof c === "number") {
                    changeBgm(c);
                }
            } else {
                if (mainY + a * 1.1 >= 0) {
                    mainY = 0;
                    var d = new createjs.Tween.get(container).to({
                        y: mainY
                    }, 200, createjs.Ease.circOut(200));
                } else {
                    mainY = maxHeight;
                    var d = new createjs.Tween.get(container).to({
                        y: mainY
                    }, 500, createjs.Ease.circOut(500)).addEventListener("change", function(g) {
                        resetAll(container.y);
                    });
                    changeBgm(0);
                    panlock = false;
                }
            }
        }
    });
    imgs.ebtn_1.on("click", function() {
        mainY = 0;
        container.y = 0;
        for (key in imgs) {
            if (imgs.hasOwnProperty(key)) {
                imgs[key].alpha = 0;
            }
        }
        panlock = true;
    });
    imgs.ebtn_2.on("click", function() {
        share.visible = true;
        var c = createjs.Tween.get(share).to({
            alpha: 1
        }, 500);
    });
    share.on("click", function() {
        var c = createjs.Tween.get(share).to({
            alpha: 0
        }, 500);
    });
}
function resetAll(a) {
    var b = stageHeight * startPosition;
    a = Math.abs(a) + b;
    for (var c = 0; c < lData.imgs.length; c++) {
        var e = lData.imgs[c];
        var g = e.trigger || e.y;
        if (a > g) {
            var d = (a - g) / (stageHeight * changeRate) * (e.speed || 1);
            if (d > 1) {
                d = 1;
            } else {
                if (d < 0) {
                    d = 0;
                }
            }
            var f = e.id;
            imgs[f].alpha = d;
            imgs[f].x = parseInt(e.s_x) + (e.x - e.s_x) * d;
            imgs[f].y = parseInt(e.s_y) + (e.y - e.s_y) * d;
        }
    }
}

function getBgmIndex(b) {
    // bgm 数组是保存的是偏移量，传入的b是当前偏移量，如果b > （当前偏移量 + 1） 触发事件，改变音乐  return 音乐索引。
    for (var a = 0; a < bgm.length; a++) {
        if (b > bgm[a + 1]) {
            return a;
        }
    }
}
function changeBgm(a) {
    // 如果当前已经在播放 传入的音乐，则不执行，避免重复播放
    if (!(bgmIndex === a)) {
        bgmIndex = a;
        bgmObj.src = "https://n.sinaimg.cn/news/hongkong20/media/bgm-" + bgmIndex + ".mp3";
        bgmObj.play();
    }
}