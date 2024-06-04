class ImageCropper {
  constructor(image) {
    this.originImage = null;
    this.canvas = document.createElement("canvas");
    this.initImage(image);
  }

  initImage(image) {
    if (typeof image === "string") {
      const img = new Image();
      img.setAttribute("crossOrigin", "Anonymous");
      img.onload = () => {
        this.originImage = img;
      };
      img.src = image;
    } else if (image instanceof HTMLImageElement) {
      this.originImage = image;
    } else {
      throw new Error("请传入图片地址或者Image对象！");
    }
  }

  cropper(sx, sy, sWidth, sHeight) {
    this.canvas.width = sWidth;
    this.canvas.height = sHeight;
    this.canvas
      .getContext("2d")
      .drawImage(
        this.originImage,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        sWidth,
        sHeight
      );

    this.downloadImage(this.canvas.toDataURL("image/jpg", 1));
  }

  downloadImage(url) {
    const a = document.createElement("a");
    a.href = url;
    a.download = "cut-image.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

export default ImageCropper;
