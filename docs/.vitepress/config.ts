import { defineConfig } from 'vitepress';
import { getArticles } from './nav';

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
                text: '工具',
                link: '/tools/tel',
                activeMatch: '^/tools/',
            },
        ],

        sidebar: {
            '/article/': getArticles(),
        },

        socialLinks: [{ icon: 'github', link: 'https://github.com/dogodo-cc' }],
    },
});
