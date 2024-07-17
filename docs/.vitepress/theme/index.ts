import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';

// 图片横向滚动的组件
import PicturesScrollX from './components/pictures-scroll-x.vue';
import PictureTip from './components/picture-tip.vue';
import EmptyLine from './components/empty-line.vue';

// https://www.antdv.com/docs/vue/introduce-cn
import { Row, Col } from 'ant-design-vue';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.use(Row);
        app.use(Col);
        app.component('PicturesScrollX', PicturesScrollX);
        app.component('PictureTip', PictureTip);
        app.component('EmptyLine', EmptyLine);
    },
} satisfies Theme;
