const getImageSize = (url) => {
  return new Promise((resolve, reject) => {
    // 加载图片获取图片真实宽度和高度
    const image = new Image();
    image.onload = function () {
      const {
        width,
        height,
        naturalWidth,
        naturalHeight,
      } = image;
      resolve({
        width: naturalWidth ?? width,
        height: naturalHeight ?? height,
      });
    };
    image.onerror = reject;
    image.src = url;
  });
}

// 判断浏览器是否支持webp格式
const supportWebp = (() => {
  try {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0);
  } catch (err) {
    return false;
  }
})();

export {
  getImageSize,
  supportWebp
}