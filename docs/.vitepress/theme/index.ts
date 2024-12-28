import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';

// 图片横向滚动的组件
import Pictures from './components/pictures-scroll-x.vue';
import Tip from './components/picture-tip.vue';

import Mermaid from './components/mermaid/Mermaid.vue';
import Lock from './components/lock.vue';

// https://www.antdv.com/docs/vue/introduce-cn
import { Row, Col } from 'ant-design-vue';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.use(Row);
        app.use(Col);
        app.component('Pictures', Pictures);
        app.component('Tip', Tip);
        app.component('Mermaid', Mermaid);
        app.component('lock', Lock);
    },
} satisfies Theme;
