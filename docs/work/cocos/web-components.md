---
sidebarDepth: 3
---

# 探讨 web-components 的正确使用姿势

## web-components 是什么？

[Web Components](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components) 是一组 Web 原生 API 的总称，允许开发人员创建可重用的自定义组件。

## 可以替代现代 UI 框架吗？

封装自定义元素，听着很熟悉，似乎解决了前端开发必须使用 `vue`、 `react` 等 UI 框架来实现代码复用的问题。

但是在 2021 这个时间节点，我们使用 UI 框架已经不再是纯粹的为了`组件复用`。我们更离不开的是声明式（数据驱动）的开发方式，以及 UI 框架的一系列周边带来的开发便捷。比如 vuex 做状态管理，vue-router 做路由管理等。

我们享受着 UI 框架带来的 `现代式` 开发，虽然他不是 web 标准，但是声明式的开发方式几乎已经成为了现代 web 前端的事实标准。

而 `web components` 可以看作只是丰富了 HTML 的原生标签。所以它无法和 `vue` `react` 等做一个正面比较，更别说 `web components` 的出现会取代它们。

## 那么，它适用于什么样的场景？

UI 组件库！当你希望你的 UI 组件可以在任何框架上运行（包括原生），那么使用 `web components` 可以达到目的。

由于它只是拓展了 HTML 的原生标签，所以你可以像使用 `div` 标签一样的方式来使用它。这样可以拓展你的 UI 组件库的受众。无论开发者使用的是 `vue` 还是 `react` 都可以调用你的组件。(^\_^ 当然包括原生开发)

## 以什么姿势使用为佳？

由于 `web components` 是一组原生的 API，所以它和原生一样，都属于命令式的开发方式。你需要使用 `const Ele = document.createElement` 来创建元素。当状态改变时，你还不能忘了 `Ele.value = xxx` 来更新视图。

想想都很恐怖，一夜回到解放前。如果是稍微复杂一点的组件，代码量将直线上升，且导致代码的可维护性降低。

所以我们希望既可以享受到 `web components` 通用性，又能享受高效的声明式开发。

`vue3` 推出了一个解决方案 —— [definecustomelement](https://v3.cn.vuejs.org/api/global-api.html#definecustomelement)。你可以使用 `vue` 的方式去封装组件，再通过 `definecustomelement` 转换成 `web components`。

关于这个话题，我觉得 vue 官网已经说得非常好了，不画蛇添足。[官方说明](https://v3.cn.vuejs.org/guide/web-components.html#%E5%9C%A8-vue-%E4%B8%AD%E4%BD%BF%E7%94%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E5%85%83%E7%B4%A0)

## 逼逼了这么久，我想说什么？

我们编辑器的 `UI kit` 选择了 `web components` 作为载体是非常明智的选择。这样给与了开发者最大的自由，它们可以任意的选择自己合适的 UI 框架。

但是 `UI kit` 是以原生的方式去开发的。我们让广大开发者爽了，但是却没让自己爽起来。我一直坚信，能服务大众的前提一定是先服务好自己。

所以我提议：以 `web components` 的方式去暴露组件，但是组件内部仍然以声明式的方式去书写。

好处：

-   代码维护性更强
-   开发效率更高

问题：

-   带来一点 vue 的运行时开销
-   依赖了 vue

我尝试反驳一下以上两个问题。

### 运行时开销

在性能问题没出现之前，说性能都是伪命题。

在 JQ 时代，也有人说，要使用原生 js。因为 JQ 会导致包体变大，然后踏上了原生的道路。接着发现很多 utils 需要封装，就特别有成就感的封装了自己的工具库，不断组合。最后发现，自己的工具库大过了 JQ，且 API 设计还不如或者仅次于 JQ 的优雅。舍弃了巨人的肩膀，又朝着巨人的方向前进。

以上例子纯属虚构！

### 依赖了 vue

情绪激昂的说：如果依赖 vue 会成一个问题，那么 vue 应该不会发展到 3.0。

慢条斯理的说：Vue 是 MIT 开源协议，所有源码公开。且全世界都在使用，经过无数实际项目验证的。我个人是找不出拒绝的理由。

## 2024 年 7 月补充

ui-kit 的定位是时间跨度需要长达 10 年以上，所以选择了面向浏览器的标准提供组件，选择了 web-component，抛弃了具有更好开发体验的 vue react 等框架。我也赞成这样的决定。它还有个更好的好处是可以适应所有 前端框架

但是在编写原生 web-component 的时候，只能是命令式的语法，这样的结果就是一个组件你有更多的关注点，数据和 dom 表现。导致的结果就是 bug 变多。

可维护变差也是不争的事实，除非能保证团队里所有人员都是编程高手，代码风格趋向统一，否则命令式的写法在多人协作上，就是一种增煽。这也是为什么 vue 的 options 式开发对多人协作是很友好的，不管水平高低，写出的组件基本是趋同的，因为组件强行区分了 data computed methods 和各种钩子，这种填鸭式的编程是有极大好处的 ，特别是多人协作。代码趋同是一个团队的福音。

回到编辑器目前的真实现状，就是每个接手 ui-kit 的人，看代码的过程都很痛苦，而且修 bug 的上手时间也更久。

如果引入 lit，首先它不是框架，是一个定位非常聚焦的库，只为 web-componet 服务，让装组件可以享受声明式的语法。

团队目前最大的质疑是对 lit 的不确定性，慎重是合理的，但是不能固执，首先 lit 的开发团队是谷歌背书的，这点在专业性上应该不用质疑，而且周下载量也非常大。

photoshop 在开发 web 版本的时候，也是选用了 lit 来构建他们的 web-component ，具体可以看 [Photoshop is now on the web!](https://medium.com/@addyosmani/photoshop-is-now-on-the-web-38d70954365a)

> Enabled by WebAssembly + Emscripten, Web Components + Lit, Service Workers + Workbox & new Web APIs. Chrome & Adobe enjoyed collaborating on it.

所以引入 lit 带来的好处如下：

1. 声明式语法替代命令式语法，代码逻辑更清晰，关注点减少
2. 代码量减少
3. 按照 lit 的模式开发，代码格式会趋同，对于团队的多人协作比较友好。
4. 构建更简单，lit 一切都是 js， html 和 css 都是以 js 的形式提供，所以整个组件库的构建流程可以非常简单，甚至 tsc 即可。

缺点：

1. 我们依赖了一个外部库，万一有 bug，在处理 bug 上可能不太可控，你需要等官方修复。
2. 万一 10 年后不维护了，怎么办。

其实以上两点如果很担忧，那么你一定非常害怕看到项目的 package.json 的 dependence，我们是否也应该抛弃 vue 和 electron。

...
