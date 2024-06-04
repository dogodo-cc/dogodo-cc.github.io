
const downloadByLink = async (link, filename = 'download') => {
  const {origin: downloadOrigin} = new URL(link);
  const {origin: siteOrigin} = location;
  let href = link;
  // 如果下载的资源，不是在同一个域名下，a标签download设置无效，需要先将资源转为blob，在本地下载
  if (downloadOrigin !== siteOrigin) {
    href = await fetch(link).then(res => res.blob()).then(blob => window.URL.createObjectURL(blob));
  }

  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  
  if (href.includes('blob')) {
    window.URL.revokeObjectURL(href);
  }
}

const downloadByContent = (filename, content, type = 'application/json') => {
  if (!filename || !content || !type) {
    throw new Error('文件名、内容、类型均为必填项！');
  }
  const a = document.createElement('a');
  const blob = new Blob([content], {
    type,
  });
  a.download = filename;
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(blob);
}

export {
  downloadByLink,
  downloadByContent
}