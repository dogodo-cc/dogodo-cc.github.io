![](./assets/coding.jpeg)

<NavList :articles="articles"></NavList>

<script setup>
import NavList from '../.vitepress/theme/components/nav-list.vue'
import { getWorks } from '../.vitepress/nav.ts'

const articles = getWorks();
</script>

<style>
 @import url(../.vitepress/theme/custom-root.css);
</style>
