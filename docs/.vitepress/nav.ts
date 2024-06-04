import type { DefaultTheme } from 'vitepress';

export function getArticles(): DefaultTheme.SidebarItem[] {
    return [
        { text: '电脑设置-mac', link: '/article/setup-mac' },
        { text: '电脑设置-win', link: '/article/setup-win' },
    ];
}
