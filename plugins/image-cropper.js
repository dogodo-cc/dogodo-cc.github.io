class ImageCropper {
    constructor(image) {
        this.originImage = null;
        this.canvas = document.createElement('canvas');
        this.initImage(image).catch((error) => {
            console.error(error.message);
        });
    }

    /**
     * 初始化图片（支持图片地址和 HTMLImageElement）
     * @param {string|HTMLImageElement} image - 图片地址或图片元素
     */
    async initImage(image) {
        if (typeof image === 'string') {
            try {
                this.originImage = await this.loadImage(image);
            } catch (error) {
                throw new Error('图片加载失败，请检查图片地址是否有效！');
            }
        } else if (image instanceof HTMLImageElement) {
            this.originImage = image;
        } else {
            throw new Error('请传入有效的图片地址或 HTMLImageElement 对象！');
        }
    }

    /**
     * 异步加载图片
     * @param {string} url - 图片地址
     * @returns {Promise<HTMLImageElement>} - 返回加载后的图片元素
     */
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    /**
     * 裁剪图片
     * @param {number} sx - 裁剪起点 x 坐标
     * @param {number} sy - 裁剪起点 y 坐标
     * @param {number} sWidth - 裁剪宽度
     * @param {number} sHeight - 裁剪高度
     * @returns {string} - 裁剪后的图片数据 URL
     */
    crop(sx, sy, sWidth, sHeight) {
        if (!this.originImage) {
            throw new Error('图片未加载完成，无法裁剪！');
        }

        this.canvas.width = sWidth;
        this.canvas.height = sHeight;
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('无法获取 Canvas 的 2D 上下文！');
        }

        ctx.drawImage(this.originImage, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

        return this.canvas.toDataURL('image/jpeg', 1.0);
    }

    /**
     * 下载图片
     * @param {string} url - 图片数据 URL
     * @param {string} filename - 下载的文件名
     */
    downloadImage(url, filename = 'cropped-image.jpg') {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    /**
     * 裁剪并下载图片
     * @param {number} sx - 裁剪起点 x 坐标
     * @param {number} sy - 裁剪起点 y 坐标
     * @param {number} sWidth - 裁剪宽度
     * @param {number} sHeight - 裁剪高度
     * @param {string} filename - 下载的文件名
     */
    cropAndDownload(sx, sy, sWidth, sHeight, filename = 'cropped-image.jpg') {
        try {
            const croppedImageURL = this.crop(sx, sy, sWidth, sHeight);
            this.downloadImage(croppedImageURL, filename);
        } catch (error) {
            console.error(error.message);
        }
    }
}

export default ImageCropper;
