// 视频状态 readyState
// 0 = HAVE_NOTHING - 没有关于音频 / 视频是否就绪的信息
// 1 = HAVE_METADATA - 关于音频 / 视频就绪的元数据
// 2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧 / 毫秒
// 3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
// 4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放

// 事件顺序
// loadstart      => state:0
// durationchange => state:1 此时可以获取真实的duration，之前duration为NaN
// loadedmetadata => state:1 duration size 可以读取了
// loadeddata     => state:2
// progress       => state:3
// canplay        => state:4
// canplaythrough

export default class VideoHelper {
  constructor(videoSource) {
    this.video = document.createElement('video');
    this.video.setAttribute('crossOrigin', 'Anonymous'); // 避免 .toDataURL() 报错
    this.video.setAttribute('muted', 'muted');

    // 无需播放，保证currentTime不会自增，方便截到纯色图片时进行下一秒截图
    // this.video.setAttribute('autoplay', 'autoplay');

    this.video.src = videoSource;

    // just for 测试
    // this.video.width = 200;
    // this.video.height = 200;
    // this.video.style.cssText =
    //     'position:fixed;left: 0;top: 0;z-index: 1000;';
    // document.body.appendChild(this.video);

    this.canvas = null;
    this.canvasSmall = null; // 画一个很小的图片，用于验证是否单一颜色
    this.accuracy = 0.8; // 判断纯色图片的精准度 建议取值在 0.8 ~ 1 之间
    this.lock = false;
  }

  get currentTime() {
    return this.video.currentTime;
  }

  get duration() {
    return this.video.duration;
  }

  getVideoDuration() {
    return new Promise(resolve => {
      if (this.video.readyState >= 1) {
        resolve(this.duration);
      } else {
        this.video.onloadedmetadata = () => {
          resolve(this.video.duration);
        };
      }
    });
  }

  getVideoPoster(...res) {
    // eslint-disable-next-line
    return new Promise(async (resolve, reject) => {
      if (this.video.readyState === 4) {
        const image = await this.drawVideoToCanvas(...res);
        resolve(image);
      } else {
        this.video.oncanplaythrough = async () => {
          if (this.video.readyState === 4 && !this.lock) {
            const image = await this.drawVideoToCanvas(...res);
            resolve(image);
          }
        };
        setTimeout(() => {
          reject(new Error('视频加载超时!'));
        }, 2000);
      }
    });
  }

  /**
     * 想要截取第几秒的画面
     * @param {number} currentTime
     */
  drawVideoToCanvas(currentTime = 0.001) {
    if (currentTime > this.duration) {
      return Promise.reject(
        new Error(
          `currentTime: ${currentTime} is greatly than duration: ${this.duration}`
        )
      );
    }
    this.lock = true;
    this.canvas = this.canvas || document.createElement('canvas');
    const { videoWidth, videoHeight } = this.video;
    this.canvas.width = videoWidth;
    this.canvas.height = videoHeight;
    const ctx = this.canvas.getContext('2d');

    this.video.currentTime = currentTime;

    return new Promise(resolve => {
      this.video.ontimeupdate = () => {
        let isPurity = this._judgePurityPicture(
          this.video,
          videoWidth,
          videoHeight
        );
        // eslint-disable-next-line
        console.log(`尝试截第${this.currentTime}秒画面；图片是否接近纯色： ${isPurity}`);
        if (isPurity && this.currentTime + 1 < this.duration) {
          // 如果是纯色的图片，则取下一秒的截图，会再次触发 ontimeupdate
          this.video.currentTime = this.currentTime + 1;
        } else {
          this.video.ontimeupdate = null;
          this.video.oncanplaythrough = null; // chrome 不知道为什么会不断触发 疑难杂症
          this.lock = false;

          ctx.drawImage(this.video, 0, 0, videoWidth, videoHeight);
          const url = this.canvas.toDataURL('image/jpeg', 1);
          this.canvas.toBlob(blob => {
            resolve({
              url,
              blob,
            });
          });
        }
      };
    });
  }

  _judgePurityPicture(originImg, originWidth, originHeight) {
    this.canvasSmall = this.canvasSmall || document.createElement('canvas');
    const width = 100; // 设置太高影响获取像素的性能，太低会影响判断主颜色覆盖率的准确度
    const height = originHeight / (originWidth / width);
    this.canvasSmall.width = width;
    this.canvasSmall.height = height;
    const ctx = this.canvasSmall.getContext('2d');
    ctx.drawImage(originImg, 0, 0, width, height);
    const ImageData = ctx.getImageData(0, 0, width, height);
    const pixels = this._lineArray(Array.from(ImageData.data));

    if (this.accuracy === 1) {
      return pixels.every(pixel => {
        return pixel.every((o, index) => {
          return o === pixels[0][index];
        });
      });
    } else {
      return this._getMainColorPercent(pixels);
    }
  }

  // 如果主要颜色的占比超过阀值this.accuracy，认为是纯色
  _getMainColorPercent(pixels = []) {
    const o = {};
    pixels.forEach(pixel => {
      const key = pixel.join('');
      if (o[key]) {
        o[key] = o[key] + 1;
      } else {
        o[key] = 1;
      }
    });
    const values = Object.values(o);
    const mainColorNums = Math.max(...values);
    return mainColorNums / pixels.length >= this.accuracy;
  }

  _lineArray(arr = [], num = 4) {
    let count = Math.round(arr.length / num);
    let result = [];
    for (let i = 0; i < count; i++) {
      result.push(arr.splice(0, num));
    }
    return result;
  }
}
