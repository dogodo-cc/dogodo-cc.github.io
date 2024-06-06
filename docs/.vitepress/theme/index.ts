import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { defineComponent, h } from 'vue';

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component(
            'indentation',
            defineComponent({
                setup() {
                    return () => '\u00a0\u00a0\u00a0\u00a0';
                },
            })
        );
    },
} satisfies Theme;
