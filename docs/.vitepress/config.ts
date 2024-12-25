import { defineConfig } from 'vitepress';
import { fileURLToPath, URL } from 'node:url';
import { getArticles, getWorks } from './nav';
import type { DefaultTheme } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';

const config = defineConfig({
    title: '甜甜的泥土',
    titleTemplate: '甜甜的泥土',
    description: '记录工作，生活，女儿成长',
    lang: 'zh-CN',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['meta', { name: 'keywords', content: '袁炜海,袁,炜海,yuanweihai,weihai,甜甜的泥土' }],
        ['meta', { 'http-equiv': 'Content-Type', content: 'text/html;charset=gb2312' }],
        ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no' }],

        // 搜索引擎站长 SEO
        ['meta', { name: 'baidu-site-verification', content: 'codeva-v1HZxWyEMq' }],
        ['meta', { name: 'msvalidate.01', content: '2E8DB63234FF33A1C2E4A568C972941F' }],
        ['meta', { name: 'sogou_site_verification', content: 'qBSg725BMX' }],
        ['meta', { name: '360-site-verification', content: '573feda693169838a20d65a27917bef9' }],

        // 分享的配置
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'zh-Hans' }],
        ['meta', { property: 'og:title', content: '甜甜的泥土 | 袁炜海的互联网自留地' }],
        ['meta', { property: 'og:site_name', content: '甜甜的泥土' }],
        ['meta', { property: 'og:image', content: 'https://weihai.dogodo.cc/maskable-icon-512x512.png' }],
        ['meta', { property: 'og:url', content: 'https://weihai.dogodo.cc/' }],

        // #region snippet
        ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
        ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' }],
        // #endregion snippet

        // 在手机上 默认用暗色主题，因为 manifest 配置那边主题是暗色的，体验效果更好
        // TODO: 需要研究下 少数派的 动态切换主题的方案
        [
            'script',
            {},
            `
            document.addEventListener("DOMContentLoaded", () => {
                if(/iPhone|iPod|iPad|android/i.test(navigator.userAgent)){
                    document.body.classList.add('wap');
                    localStorage.setItem("vitepress-theme-appearance", "dark");
                }
            });
            `,
        ],

        // 百度统计
        [
            'script',
            {},
            `
            var _hmt = _hmt || [];
            (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?b1cb86bb45fa83e84117593f53c47b78";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
            })();
            `,
        ],

        // 谷歌分析
        ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-5XLPMWJX5J' }],
        [
            'script',
            {},
            `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5XLPMWJX5J');`,
        ],
    ],
    themeConfig: {
        // logo: { src: '/logo.png' }, 不好看，暂时不用
        externalLinkIcon: true,

        nav: [
            {
                text: '文字',
                link: '/article/',
                activeMatch: '^/article/',
                // items: getArticles() as DefaultTheme.NavItemChildren[],
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
                        link: 'https://konghao.dogodo.cc',
                    },
                ],
            },
            // {
            //     text: '官网案例',
            //     items: [
            //         {
            //             text: '建发时尚周',
            //             link: 'website/ifw/',
            //         },
            //         {
            //             text: '晋江青商会',
            //             link: 'website/young/',
            //         },
            //         {
            //             text: '英合律师所',
            //             link: 'website/yinghe/',
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
        sidebarMenuLabel: '文章列表',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',

        socialLinks: [{ icon: 'github', link: 'https://github.com/dogodo-cc' }],

        footer: {
            message: '我的互联网自留地',
            copyright: '备案号:<a target="_blank" href="https://beian.miit.gov.cn/#/Integrated/index">闽ICP备20011002号-1</a>',
        },
    },
    markdown: {
        lineNumbers: false,
    },
    sitemap: {
        hostname: 'https://weihai.dogodo.cc/',
    },
    vite: {
        resolve: {
            // https://vitepress.dev/zh/guide/extending-default-theme#overriding-internal-components
            alias: [
                {
                    find: /^.*\/VPLocalNavOutlineDropdown\.vue$/,
                    replacement: fileURLToPath(new URL('./theme/components/VPLocalNavOutlineDropdown.vue', import.meta.url)),
                },
                {
                    find: /^.*\/VPDocOutlineItem\.vue$/,
                    replacement: fileURLToPath(new URL('./theme/components/VPDocOutlineItem.vue', import.meta.url)),
                },
            ],
        },
    },
});

export default withMermaid(config);
