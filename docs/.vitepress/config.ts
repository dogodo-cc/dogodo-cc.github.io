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
    ],
    themeConfig: {
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
                link: '/tools/tel',
                activeMatch: '^/tools/',
            },
            {
                text: '官网案例',
                items: [
                    {
                        text: '建发时尚周',
                        link: 'https://90s.co/website/ifw/',
                    },
                    {
                        text: '晋江青商会',
                        link: 'https://90s.co/website/young/',
                    },
                    {
                        text: '英合律师所',
                        link: 'https://90s.co/website/yinghe/',
                    },
                ],
            },
        ],

        sidebar: {
            '/article/': getArticles(),
            '/work/': getWorks(),
        },

        socialLinks: [{ icon: 'github', link: 'https://github.com/dogodo-cc' }],
    },
});
