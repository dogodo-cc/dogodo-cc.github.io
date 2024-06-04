import DragSort from './src/index.vue';

DragSort.install = function(Vue) {
  Vue.component(DragSort.name, DragSort);
};

export default DragSort;
