/**
 $ @Description 路由进度状态控制层
 $ @Author Peng.p
 $ @Date 2022-07-20 09:21:29
 $ @LastEditTime 2022-11-15 15:07:54
 */
import { useUserStoreWithOut } from '@/store/modules/user';
import { createPermissionGuard } from './permissionGuard';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
import nProgress from 'nprogress';
import { ElLoading } from 'element-plus'
export function setupRouterGuard(router) {
  createProgressGuard(router);
  createPermissionGuard(router);
}
const loadOptions = {
  lock: true,
  text: '系统加载中',
  background: 'rgba(255, 255, 255, 1)',
  customClass: 'init-load-transition'
}
let loadingInstance = null;
// 定义路由进度
export function createProgressGuard(router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();

  router.beforeEach(async () => {
    const withInHeader = document.getElementById('layoutHeader')
    // 登录后方可显示进度条
    userStore.getToken && withInHeader && nProgress.start();
    // 页面刷新时全局loading
    if (permissionStore.getUserRoutes.length === 0) {
      loadingInstance = ElLoading.service(loadOptions)
    }
    return true;
  });

  router.afterEach(async () => {
    nProgress.done();
    loadingInstance.close()
    return true;
  });
}
