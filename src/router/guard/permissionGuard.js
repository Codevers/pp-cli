/**
 $ @Description 路由权限控制层
 $ @Author Peng.p
 $ @Date 2022-07-20 09:21:29
 $ @LastEditTime 2022-09-28 17:12:11
 */
import { useUserStoreWithOut } from '@/store/modules/user';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
import { TOKEN_KEY } from '@/enums/cacheEnum'
import Cookies from 'js-cookie'
import { PageEnum } from '@/enums/pageEnum';
const LOGIN_PATH = PageEnum.BASE_LOGIN;

export function createPermissionGuard(router) {
  router.beforeEach(async (to, from, next) => {
    console.log(to, from);
    const permissionStore = usePermissionStoreWithOut();
    const userStore = useUserStoreWithOut();
    const stateToken = userStore.getToken;
    const cookieToken = Cookies.get(TOKEN_KEY)
    //const cookieToken = sessionStorage.getItem(TOKEN_KEY)
    const token = stateToken && cookieToken;
    const homePath = userStore.getHomePath;
    // 登录凭证失效时，跳入登录页（ignoreAuth避免login路由死循环）
    if (!token) {
      if (to.meta.ignoreAuth) return next();
      return next(LOGIN_PATH)
    }

    // 登录凭证未失效的情况下，强制跳入工作台
    if (to.path === LOGIN_PATH && token) {
      return next(homePath)
    }

    // 获取用户信息
    // 未存储走请求接口，已存储走userinfo
    if (!userStore.getIsAddedUserInfo) {
      console.log('载入用户信息');
      await userStore.getUserInfoAction();
    }

    // 控制路由载入只走一次
    if (permissionStore.getIsDynamicAddedRoute) {
      console.log('路由已载入完毕');
      return next();
    }

    // 载入路由表
    await permissionStore.buildRoutesAction();

    // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
    next({ path: to.fullPath, replace: true, query: to.query });

  });
}
