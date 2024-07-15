import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './custom.css';

// https://www.antdv.com/docs/vue/introduce-cn
import { Row, Col } from 'ant-design-vue';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.use(Row);
        app.use(Col);
    },
} satisfies Theme;
