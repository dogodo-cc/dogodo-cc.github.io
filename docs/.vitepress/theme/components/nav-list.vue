<template>
    <div class="nav-list">
        <dl v-for="year in articles" :key="year.text">
            <dt>
                <h3>{{ year.text }}</h3>
            </dt>
            <dd v-for="item in year.items" :key="item.text">
                <a :href="item.link.replace('.md', '')">{{ item.text }}</a>
            </dd>
        </dl>
    </div>
</template>
<script setup>
import { toRefs } from 'vue';
const props = defineProps({
    articles: {
        type: Array,
        required: true,
    },
});

const { articles } = toRefs(props);
</script>

<style>
.nav-list {
    display: flex;
    flex-wrap: wrap;

    dl {
        width: 25%;
    }

    dd {
        margin-inline-start: 0;
    }
}
@media (max-width: 750px) {
    .nav-list {
        display: block;
        dl {
            width: 100%;
            text-align: center;
        }
    }
}
</style>
