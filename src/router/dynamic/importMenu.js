/**
 $ @Description 界面菜单处理
 $ @Author Peng.p
 $ @Date 2022-07-23 19:30:29
 $ @LastEditTime 2022-09-07 15:42:50
 */
import { useUserStoreWithOut } from '@/store/modules/user';
import loadsh from 'loadsh'

// 将权限数据变成菜单对象
export function transformObjToMenu(routeList) {
    let menuList = loadsh.cloneDeep(routeList)
    menuList = menuList.filter(menuRemoveHomeFilter)
    asyncImportMenu(menuList, 0);
    return menuList;
}

// 处理菜单配置
function asyncImportMenu(menu, level) {
    if (!menu) return;
    let levels = level || 0;
    levels++;
    const userStore = useUserStoreWithOut();
    menu.forEach((item) => {
        const { component, children, path } = item;
        const routePath = path || component;
        if (routePath !== userStore.getHomePath) {
            item.index = '/' + routePath
            item.level = levels
        }
        if (children?.length) {
            asyncImportMenu(children, levels);
        }
    });

}
// 过滤首页菜单
function menuRemoveHomeFilter(route) {
    const userStore = useUserStoreWithOut();
    const { component, path } = route;
    const routePath = path || component;
    return routePath !== userStore.getHomePath
}