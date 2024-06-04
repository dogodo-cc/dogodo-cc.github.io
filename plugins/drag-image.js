import { isFirefox } from '@/uxms/utils';

const OSS_PROCESS = '?x-oss-process=image/';

const getImageSize = url => {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = image;
      resolve({ width, height });
    };
    image.src = url;
  });
};

const removeOss = url => {
  if (!/\?x-oss-process=image/.test(url)) return url;
  return url.split(OSS_PROCESS)[0];
};

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  var min_size = Math.min(w, h);
  if (r > min_size / 2) r = min_size / 2;
  // 开始绘制
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
};

class CreateDragImage {
  constructor() {
    this.imageClassName = 'create-drag-image-class-name'; // 尽量保证唯一性
  }


  createDragImage(url, width = 164, height = 128) {
    this.removeDragImage();
    if (isFirefox) {
      return this.createDragImageByCanvas(url, width * 2, height * 2);
    } else {
      return this.createDragImageByImage(url, width, height);
    }
  }

  createDragImageByImage(url, width, height) {
    return new Promise(resolve => {
      const image = new Image();
      image.className = this.imageClassName;
      image.style.borderRadius = '10px';
      image.style.width = `${width}px`;
      image.style.height = `${height}px`;
      image.style.objectFit = 'cover';
      image.style.position = 'absolute'; // 不能用fixed，safari有兼容问题
      image.style.top = '-200vh';
      image.style.left = '-200vw';

      image.onload = () => {
        resolve(image);
      };
      image.src = url;
      document.body.appendChild(image); // 必须这样才能让样式生效
    });
  }

  async createDragImageByOss(url, width, height, borderRadius = true) {
    const { width: origin_w, height: origin_h } = await getImageSize(url);

    url = removeOss(url);

    // 原图比标准尺寸高，以 width 为准
    if (origin_h / origin_w > height / width) {
      const small_h = (width * origin_h) / origin_w;
      const crop_y = Math.round((small_h - height) / 2);

      url += `${OSS_PROCESS}resize,w_${width},image/crop,y_${crop_y},x_0,h_${height}`;
    } else {
      const small_w = (height * origin_w) / origin_h;
      const crop_x = Math.round((small_w - width) / 2);

      url += `${OSS_PROCESS}resize,h_${height},image/crop,x_${crop_x},y_0,w_${width}`;
    }
    if (url.includes('.png') && borderRadius) {
      url += ',image/rounded-corners,r_10';
    }
    return url;
  }

  createDragImageByCanvas(url, width = 164, height = 128) {
    return new Promise(resolve => {
      const IMG = new Image();
      IMG.setAttribute('crossOrigin', 'Anonymous');
      IMG.onload = () => {
        const { naturalWidth, naturalHeight } = IMG;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        // 原图宽高比例比标准的大（更高，以宽度为准，切同比例高）
        if (naturalHeight / naturalWidth > height / width) {
          // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
          const sHeight = (naturalWidth * height) / width;
          const sy = (naturalHeight - sHeight) / 2;
          canvas
            .getContext('2d')
            .drawImage(
              IMG,
              0,
              sy,
              naturalWidth,
              sHeight,
              0,
              0,
              width,
              height
            );
        } else {
          // 更矮，以高度为准切同比例宽
          const sWidth = (naturalHeight * width) / height;
          const sx = (naturalWidth - sWidth) / 2;
          canvas
            .getContext('2d')
            .drawImage(
              IMG,
              sx,
              0,
              sWidth,
              naturalHeight,
              0,
              0,
              width,
              height
            );
        }

        const coverImage = new Image();
        coverImage.setAttribute('crossOrigin', 'Anonymous');
        coverImage.onload = () => {
          const radiusCanvas = document.createElement('canvas');
          radiusCanvas.className = this.imageClassName;
          radiusCanvas.width = width;
          radiusCanvas.height = height;
          radiusCanvas.style.width = `${width}px`;
          radiusCanvas.style.height = `${height}px`;
          radiusCanvas.style.position = 'fixed';
          radiusCanvas.style.top = '-200vh';
          radiusCanvas.style.left = '-200vw';
          radiusCanvas.style.zIndex = 1000;
          const context = radiusCanvas.getContext('2d');

          // 创建图片纹理
          const pattern = context.createPattern(
            coverImage,
            'no-repeat'
          );

          // 这里使用圆角矩形
          context.roundRect(0, 0, width, height, 10);

          // 填充绘制的圆
          context.fillStyle = pattern;
          context.fill();

          document.body.appendChild(radiusCanvas); // 追加到body 才能让setDragImage 生效

          resolve(radiusCanvas);
        };
        coverImage.src = canvas.toDataURL('image/png', 1);
      };
      IMG.src = url;
    });
  }

  removeDragImage() {
    const images = Array.from(
      document.getElementsByClassName(this.imageClassName)
    );
    if (images.length) {
      images.forEach(image => {
        image.parentNode && image.parentNode.removeChild(image);
      });
    }
  }
}

export default new CreateDragImage();
