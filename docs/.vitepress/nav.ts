import type { DefaultTheme } from 'vitepress';

export function getArticles(): DefaultTheme.SidebarItem[] {
    return [
        { text: '2024', items: [{ text: '我和黑莓', link: '/article/2024/blackberry.md' }] },
        { text: '2014', items: [{ text: '小小出租屋', link: '/article/2014/small-room.md' }] },
        {
            text: '2013',
            items: [
                {
                    text: '我的小时候',
                    link: '/article/2013/childhood.md',
                },
                {
                    text: '武林高手',
                    link: '/article/2013/wulingaoshou.md',
                },
            ],
        },
        {
            text: '2009',
            items: [
                {
                    text: '乡戏',
                    link: '/article/2009/country-drama.md',
                },
            ],
        },
    ];
}

export function getWorks(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: '笔记',
            items: [
                { text: '电脑设置-mac', link: '/work/note/setup-mac/index.md' },
                { text: '电脑设置-win', link: '/work/note/setup-win/index.md' },
            ],
        },
        {
            text: '最佳实践',
            items: [{ text: '埋点', link: '/work/pratices/埋点.md' }],
        },
    ];
}
