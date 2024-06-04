/**
 * @author alan
 * @description 业务场景：路由参数和筛选参数关联，获取列表数据，路由前进后退更新列表数据，刷新页面保留筛选状态
 *  
 */


class SearchService {
  constructor() {
    this.vm = null;
  }

  init(vm) {
    this.vm = vm;
  }
}

export default new SearchService();
