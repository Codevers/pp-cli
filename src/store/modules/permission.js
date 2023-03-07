import { defineStore } from 'pinia'
import { store } from '@/store';
import { INDEX_DIR_KEY, PAGE_NO_INDEX_KEY } from '@/enums/cacheEnum'
import { transformObjToRoute } from '@/router/dynamic/importRoute.js'
import { transformObjToMenu } from '@/router/dynamic/importMenu.js'
import { getUserMenu, getCustomerMenu } from '@/api/common'
import { useUserStore } from './user'
import { appStoreWithOut } from './app'
import { router } from '@/router'

// permission store，定义与权限相关的状态
export const usePermissionStore = defineStore('permission', {
    state: () => ({
        // 路由是否动态创建
        isDynamicAddedRoute: false,
        // 侧栏菜单
        sideMenu: [],
        // 用户当前路由表
        userRoutes: []
    }),
    getters: {
        getIsDynamicAddedRoute() {
            return this.isDynamicAddedRoute;
        },
        getUserRoutes() {
            return this.userRoutes
        },
        isProvince() {
            const userStore = useUserStore()
            return userStore.userInfo.regionLevel === 1 ? true : false
        },
        isCity() {
            const userStore = useUserStore()
            return userStore.userInfo.regionLevel === 2 ? true : false
        }
    },
    actions: {
        setDynamicAddedRoute(added) {
            this.isDynamicAddedRoute = added;
        },
        setSideMenu(menu) {
            this.sideMenu = menu
        },
        setUserRoutes(list) {
            this.userRoutes = list
        },
        resetState() {
            this.isDynamicAddedRoute = false;
        },
        // 构建路由
        async buildRoutesAction() {
            const userStore = useUserStore()
            const { loginType } = userStore
            const GetMenuApi = loginType === "admin" ? getUserMenu : getCustomerMenu
            // 请求获取角色权限菜单<promise>
            try {
                let { data: roleMenu } = await GetMenuApi();
                // 设置工作台
                const getWorkbench = roleMenu.find(i => i.component.startsWith(INDEX_DIR_KEY));
                userStore.setHomePath(getWorkbench?.component || PAGE_NO_INDEX_KEY);
                userStore.setHomeTitle(getWorkbench?.name || '首页');
                // 设置首页禁止缓存
                appStoreWithOut.clearCacheAppName(userStore.getHomeRoutePath)
                // 转路由表
                const userRoutes = transformObjToRoute(roleMenu)
                // 转菜单
                const menuList = transformObjToMenu(roleMenu)
                // 侧栏菜单数据存储
                this.setSideMenu(menuList)
                // 添加路由
                this.addRouteToApp([userRoutes])
            } catch (error) {
                userStore.logout()
            }
        },
        // 将用户路由表添加进应用内
        addRouteToApp(userRoutes) {
            userRoutes.forEach((route) => {
                router.addRoute(route);
            });
            this.setDynamicAddedRoute(true);
        }
    },
})

// 需要在设置之外使用
export function usePermissionStoreWithOut() {
    return usePermissionStore(store);
}
export const permissionStore = usePermissionStore(store)