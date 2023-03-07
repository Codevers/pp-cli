import { defineStore } from 'pinia';
import { store } from '@/store';
import { useUserStore } from './user'
import { PAGE_NOT_FOUND_KEY, PAGE_NO_INDEX_KEY } from '@/enums/cacheEnum'
import { usePermissionStore } from './permission'

// 同步页签数据（根据用户路由做同步，防止权限改动后，页签不变的情况）
function syncTabs() {
  let newTab = []
  const tabs = JSON.parse(window.sessionStorage.getItem('tabs')) || [useUserStore().getHomeRoute];
  const permissionStore = usePermissionStore()
  const userRouteList = permissionStore.getUserRoutes;
  for (let item of userRouteList) {
    const tab = tabs.find(i => i.path === item.path);
    tab && newTab.push(tab)
  }
  window.sessionStorage.setItem('tabs', JSON.stringify(newTab));
  return newTab
}
// tabs store，多页签模式
export const useTabsStore = defineStore('tabs', {
  state: () => ({
    // tabs: JSON.parse(window.sessionStorage.getItem('tabs')) || [useUserStore().getHomeRoute]
    tabs: syncTabs(),
    pageCloseName: ''
  }),
  actions: {
    resetTabs() {
      window.sessionStorage.removeItem('tabs');
      this.tabs = [];
    },
    // 设置缓存
    setStorage() {
      window.sessionStorage.setItem('tabs', JSON.stringify(this.tabs));
    },
    // 增加路由
    handleAddRoute(route) {
      if (!route.name) return;
      // 匹配不到路由
      if (PAGE_NOT_FOUND_KEY.includes(route.name)) return;
      this.tabs.push({
        name: route.name,
        path: route.path,
        title: route.meta?.title,
        // activePath: route.meta.activeMenu,
        query: route.query,
        params: route.params,
      });
      this.setStorage();
    },
    // 关闭路由
    handleClose(index) {
      this.tabs.splice(index, 1);
      this.setStorage();
    },
    // 关闭页签
    closePageNameTab(name) {
      this.pageCloseName = name;
    },
    // 关闭其他路由
    // handleCloseOther(index) {
    //   // 通过传入的下标，保存该路由与首页
    //   const obj = JSON.parse(JSON.stringify(this.tabs[index]));
    //   this.tabs = obj.name === userStore.getHomeRoutePath ? [
    //     useUserStore().getHomeRoute,
    //   ] : [
    //     useUserStore().getHomeRoute,
    //     obj,
    //   ];
    //   this.setStorage();
    // },
    // 关闭全部路由（未配置首页时，控制不显示“首页”页签）
    handleCloseAll() {
      const defaultRoute = useUserStore().getHomePath === PAGE_NO_INDEX_KEY ? [] : [useUserStore().getHomeRoute]
      this.tabs = defaultRoute
      this.setStorage();
    },
  },
});
// 需要在设置之外使用
export function useTabsStoreWithOut() {
  return useTabsStore(store);
}
