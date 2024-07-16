import type { DefaultTheme } from 'vitepress';

export function getArticles(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: '2024',
            items: [
                { text: '我和黑莓', link: '/article/2024/blackberry/index.md' },
                { text: '骑行知识', link: '/article/2024/bicycle/index.md' },
                { text: '我的桌面', link: '/article/2024/desktop/index.md' },
                { text: '暑假工和兼职', link: '/article/2024/part-time-job/index.md' },
                { text: '我的租房经历', link: '/article/2024/rental-houses/index.md' },
            ],
        },
        {
            text: '2014',
            items: [
                {
                    text: '小小出租屋',
                    link: '/article/2014/小小出租屋.md',
                },
            ],
        },
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
                { text: '关于本站', link: '/work/note/blog/index.md' },
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
            text: '稿定科技',
            link: '/work/gaoding/index.md',
            items: [
                { text: '埋点', link: '/work/gaoding/埋点.md' },
                { text: 'Eslint', link: '/work/gaoding/eslint.md' },
                { text: '弃用css预处理语言', link: '/work/gaoding/弃用css预处理语言.md' },
                { text: 'headless', link: '/work/gaoding/headless/index.md' },
            ],
        },
        {
            text: '雅基软件',
            link: '/work/cocos/index.md',
            items: [
                { text: '软连接', link: '/work/cocos/symlink/index.md' },
                { text: '命名规范', link: '/work/cocos/命名规范.md' },
                { text: '项目工程之断舍离', link: '/work/cocos/项目工程之断舍离.md' },
                { text: 'web-components', link: '/work/cocos/web-components.md' },
                { text: 'GitHub名称映射', link: '/work/cocos/github-ids/index.md' },
                { text: 'Hello build', link: '/work/cocos/hello-build.md' },
                { text: '短链接', link: '/work/cocos/short-url/index.md' },
                { text: '多版本多语言文档', link: '/work/cocos/多版本多语言文档/index.md' },
            ],
        },
    ];
}
