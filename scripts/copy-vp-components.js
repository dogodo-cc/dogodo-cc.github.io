import { copyFile } from 'node:fs/promises';

const _custom = 'docs/.vitepress/theme/components/VPLocalNavOutlineDropdown.vue';
const _default = 'node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue';

try {
    console.log('拷贝自定义的组件去覆盖 vitepress 的默认组件');
    await copyFile(_custom, _default);
} catch (error) {
    console.error(error);
}
