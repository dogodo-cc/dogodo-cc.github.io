# 90s-2024

袁炜海博客站

mac 的命令行工具修改图片尺寸
sips -z 180 180 ./apple-touch-icon.png --out ./apple-touch-icon-180x180.png

## 制作 pwa 的图标

@vite-pwa/assets-generator 下载这个包（不加在 package.json 是因为它容易下载失败，影响正常工作流）

npx pwa-assets-generator --preset minimal-2023 docs/public/logo.png
