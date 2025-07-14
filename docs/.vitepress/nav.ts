import type { DefaultTheme } from 'vitepress';

export function getArticles(): DefaultTheme.SidebarItem[] {
    return [
        {
            text: '2025',
            items: [
                { text: '个人数据存储方案', link: '2025/userdata/index.md' },
                { text: '自行车', link: '2025/bike/index.md' },
            ],
        },
        {
            text: '2024',
            items: [
                { text: '回忆-毕业十年', link: '2024/10years/index.md' },
                { text: '2024 年终总结', link: '2024/year-end/index.md' },
                { text: '云南旅行', link: '2024/yunnan/index.md' },
                { text: '骑行经验', link: '2024/bicycle/index.md' },
                { text: '我的桌面', link: '2024/desktop/index.md' },
                { text: '回忆-我和黑莓', link: '2024/blackberry/index.md' },
                { text: '回忆-暑假工和兼职', link: '2024/part-time-job/index.md' },
                { text: '回忆-我的租房经历', link: '2024/rental-houses/index.md' },
            ],
        },
        {
            text: '2013',
            items: [
                {
                    text: '我的小时候',
                    link: '2013/我的小时候.md',
                },
                {
                    text: '武林高手',
                    link: '2013/武林高手.md',
                },
            ],
        },
        {
            text: '2009',
            items: [
                {
                    text: '乡戏',
                    link: '2009/乡戏.md',
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
                { text: '关于本站', link: 'note/blog/index.md' },
                { text: 'Git 命令', link: 'note/git/index.md' },
                { text: '电脑设置-mac', link: 'note/setup-mac/index.md' },
                { text: '电脑设置-win', link: 'note/setup-win/index.md' },
            ],
        },
        {
            text: '学习',
            items: [
                { text: 'Emoji', link: 'study/emoji.md' },
                { text: 'JSON-Schema', link: 'study/json-schema/index.md' },
                { text: 'AST 语法树', link: 'study/ast/index.md' },
            ],
        },
        {
            text: '稿定科技',
            link: 'gaoding/index.md',
            items: [
                { text: '埋点', link: 'gaoding/maidian/index.md' },
                { text: 'Eslint', link: 'gaoding/eslint.md' },
                { text: '弃用css预处理语言', link: 'gaoding/弃用css预处理语言.md' },
                { text: 'headless', link: 'gaoding/headless/index.md' },
            ],
        },
        {
            text: '雅基软件',
            link: 'cocos/index.md',
            items: [
                { text: '软连接', link: 'cocos/symlink/index.md' },
                { text: '命名规范', link: 'cocos/命名规范.md' },
                { text: '项目工程之断舍离', link: 'cocos/项目工程之断舍离.md' },
                { text: 'web-components', link: 'cocos/web-components.md' },
                { text: 'GitHub名称映射', link: 'cocos/github-ids/index.md' },
                { text: 'Hello build', link: 'cocos/hello-build.md' },
                { text: '短链接', link: 'cocos/short-url/index.md' },
                { text: '多版本多语言文档', link: 'cocos/versions-i18n-docs/index.md' },
                { text: 'Creator 插件开发', link: 'cocos/create-cocos-plugin/index.md' },
            ],
        },
    ];
}
