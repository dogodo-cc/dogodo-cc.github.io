import type { DefaultTheme } from 'vitepress';

export function getArticles(): DefaultTheme.SidebarItem[] {
    return [
        { text: 'Markdown Examples', link: '/article/markdown-examples' },
        { text: 'Runtime API Examples', link: '/article/api-examples' },
    ];
}
