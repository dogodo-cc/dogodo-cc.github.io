import { defineConfig } from 'vitepress';
import { getArticles, getWorks } from './nav';

export default defineConfig({
    title: '甜甜的泥土',
    titleTemplate: '甜甜的泥土',
    description: '袁炜海的博客站，编程路上的一些记录',
    lang: 'zh-CN',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'keywords', content: '袁炜海,袁,炜海,yuanweihai,weihai,甜甜的泥土' }],
        ['meta', { 'http-equiv': 'Content-Type', content: 'text/html;charset=gb2312' }],
        ['meta', { name: 'baidu-site-verification', content: 'codeva-v1HZxWyEMq' }],
        ['meta', { name: 'msvalidate.01', content: '2E8DB63234FF33A1C2E4A568C972941F' }],
        ['meta', { name: 'sogou_site_verification', content: 'qBSg725BMX' }],
        ['meta', { name: '360-site-verification', content: '573feda693169838a20d65a27917bef9' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'zh-Hans' }],
        ['meta', { property: 'og:title', content: '甜甜的泥土 | 袁炜海的互联网自留地' }],
        ['meta', { property: 'og:site_name', content: '甜甜的泥土' }],
        ['meta', { property: 'og:image', content: 'https://wwww.90s.co/ywh.jpg' }],
        ['meta', { property: 'og:url', content: 'https://wwww.90s.co/' }],
    ],
    themeConfig: {
        // logo: { src: '/logo-black.png' },
        externalLinkIcon: true,

        nav: [
            {
                text: '文字',
                link: '/article/',
                activeMatch: '^/article/',
            },
            {
                text: '工作',
                link: '/work/',
                activeMatch: '^/work/',
            },
            {
                text: '工具',
                items: [
                    {
                        text: '空号检测',
                        link: 'http://konghao.90s.co',
                    },
                ],
            },
            // {
            //     text: '官网案例',
            //     items: [
            //         {
            //             text: '建发时尚周',
            //             link: 'https://90s.co/website/ifw/',
            //         },
            //         {
            //             text: '晋江青商会',
            //             link: 'https://90s.co/website/young/',
            //         },
            //         {
            //             text: '英合律师所',
            //             link: 'https://90s.co/website/yinghe/',
            //         },
            //     ],
            // },
        ],

        sidebar: {
            '/article/': getArticles(),
            '/work/': getWorks(),
        },

        docFooter: {
            prev: '上一篇',
            next: '下一篇',
        },

        outline: {
            label: '文章摘要',
        },

        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',

        socialLinks: [{ icon: 'github', link: 'https://github.com/dogodo-cc' }],
    },
    markdown: {
        lineNumbers: false,
    },
    sitemap: {
        hostname: 'https://www.90s.co',
    },
});
