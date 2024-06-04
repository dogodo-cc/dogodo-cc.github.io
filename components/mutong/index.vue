<template>
  <div class="p-xxl">
    <Barrel
      :data="list"
      :height="150"
      :col-space="10">
      <template #default="{data}">
        <div class="card">
          <img
          :src="data.src">
        </div>
      </template>
    </Barrel>
  </div>
</template>
<script>
import Barrel from './barrel.vue';
import {data} from './mock';
export default {
  name: 'barrel-demo',
  components: {Barrel},
  data() {
    return {
      list: data
    }
  }
}
</script>
<style lang="postcss">
.card {
  & img {
    width: 100%;
    max-width: 100%;
  }
}
</style>
