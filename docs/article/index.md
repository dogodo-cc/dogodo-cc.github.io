<NavList :articles="articles"></NavList>

<script setup>
import NavList from '../.vitepress/theme/components/nav-list.vue'
import { getArticles } from '../.vitepress/nav.ts'

const articles = getArticles();
</script>
