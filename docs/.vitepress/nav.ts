import type { DefaultTheme } from 'vitepress';

export function getArticles(): DefaultTheme.SidebarItem[] {
    return [
        { text: '2024', items: [{ text: '我和黑莓', link: '/article/2024/blackberry.md' }] },
        { text: '2014', items: [{ text: '小小出租屋', link: '/article/2014/小小出租屋.md' }] },
        {
            text: '2013',
            items: [
                {
                    text: '我的小时候',
                    link: '/article/2013/我的小时候.md',
                },
                {
                    text: '武林高手',
                    link: '/article/2013/武林高手.md',
                },
            ],
        },
        {
            text: '2009',
            items: [
                {
                    text: '乡戏',
                    link: '/article/2009/乡戏.md',
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
                { text: 'Git 命令', link: '/work/note/git/index.md' },
                { text: '电脑设置-mac', link: '/work/note/setup-mac/index.md' },
                { text: '电脑设置-win', link: '/work/note/setup-win/index.md' },
            ],
        },
        {
            text: '学习',
            items: [
                { text: 'Emoji', link: '/work/study/emoji.md' },
                { text: 'JSON-Schema', link: '/work/study/json-schema/index.md' },
                { text: 'AST 语法树', link: '/work/study/ast/index.md' },
            ],
        },
        {
            text: '最佳实践',
            items: [
                { text: '埋点', link: '/work/pratices/埋点.md' },
                { text: '软连接', link: '/work/pratices/symlink/index.md' },
            ],
        },
        {
            text: '设计文档',
            items: [{ text: '短链接', link: '/work/design/short-url/index.md' }],
        },
    ];
}
