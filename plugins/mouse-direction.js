
const dirMap = {
  'mouseenter': '进入',
  'mouseleave': '离开'
}
const dirName = ['上方','右侧','下方','左侧'];
export default {
  bind(el, binding) {

    // 获取指令参数
    const { cb } = binding.value;

    const fn = (e) => {
      const { width : w, height : h, left, top } = el.getBoundingClientRect();
      const x = ( e.clientX - left - ( w / 2 ) ) * ( w > h ? ( h / w ) : 1 );
      const y = (e.clientY - top - (h / 2)) * (h > w ? (w / h) : 1);

      const direction = Math.round( ( ( ( Math.atan2( y, x ) * ( 180 / Math.PI ) ) + 180 ) / 90) + 3 ) % 4;
      cb && cb(dirName[direction] + dirMap[e.type]);
    }

    el.addEventListener('mouseenter', fn, false);
    el.addEventListener('mouseleave', fn, false);
  },
  unbind() {
  }
};