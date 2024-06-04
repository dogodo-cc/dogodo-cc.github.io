
export class DownloadService {

  download(url, filename) {
    const a = document.createElement('a');
    const isSupportDownload = 'download' in a;
    if (isSupportDownload) {
      a.href = url;
      a.download = filename;
      a.target = '_blank';
      a.click();
    } else {
      window.open(url);
    }
  }

  async downloadByLink(link, filename) {
    const { origin: downloadOrigin } = new URL(link);
    const { origin: siteOrigin } = location;
    let href = link;
    // 如果下载的资源，不是在同一个域名下，a标签download设置无效，需要先将资源转为blob，在本地下载
    // 如果不传名字进来，说明不需要重命名，默认即可
    if (downloadOrigin !== siteOrigin && filename) {
      href = await fetch(link)
        .then(res => res.blob())
        .then(blob => window.URL.createObjectURL(blob));
    }

    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    a.target = '_blank';
    a.click();

    if (href.includes('blob')) {
      window.URL.revokeObjectURL(href);
    }
  }
}

export default new DownloadService();
