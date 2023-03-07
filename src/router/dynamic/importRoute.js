/**
 $ @Description 动态路由处理（文件系统即路由）
 $ @Author Peng.p
 $ @Date 2022-07-21 09:21:29
 $ @LastEditTime 2022-09-28 16:59:59
 */
import { EXCEPTION_COMPONENT } from '../constant'
import { rootRoute, WithInRoutes, PageNotFoundRoute } from '../basic'
import { useUserStoreWithOut } from '@/store/modules/user';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
import { EXCEPTION_COMPONENT_KEY } from '@/enums/cacheEnum'
import loadsh from 'loadsh'
let dynamicViewsModules = null;

// 将权限数据变成路由对象
export function transformObjToRoute(roleList) {
    let routeList = loadsh.cloneDeep(roleList)
    const userStore = useUserStoreWithOut();
    const permissionStore = usePermissionStoreWithOut();
    if (routeList?.length) {
        asyncImportRoute(routeList);
        routeList = transformRouteToFlat(routeList)
    }
    routeList = routeList || []
    // 存储用户路由配置
    permissionStore.setUserRoutes(routeList)
    // 合并用户权限路由、内页路由、错误路由
    rootRoute.children = [...routeList, ...WithInRoutes, ...PageNotFoundRoute];
    // 此处定义默认首页，具体由菜单配置决定
    rootRoute.redirect = userStore.getHomePath;
    return rootRoute // :Array
}

// 处理路由component，通过用户菜单去关联路由
function asyncImportRoute(routes) {
    dynamicViewsModules = dynamicViewsModules || import.meta.glob('/src/views/**/*.vue');
    // 定义组件name值（用于keep-alive）
    for (const key in dynamicViewsModules) {
        dynamicViewsModules[key]().then(res => {
            let componetName = key.replace('/src/views', '').replace('.vue', '')
            res.default['name'] = res.default['name'] || componetName // 以路由地址作为name
        })
    }
    if (!routes) return;
    routes.forEach((item) => {
        const { component, children, path, name } = item;
        if (component) {
            item.component = dynamicImport(dynamicViewsModules, component);
            item.path = '/' + (path || component); //:String，如果未配置path，则默认将组件地址作为路由path
            item.meta = { title: name || '内容' } //配置页面可缓存
            item.name = item.path; //将路由地址作为name
        } else {
            // 未配置路由时，路由则显示异常
            item.component = EXCEPTION_COMPONENT
            item.meta = {} //配置页面可缓存
            item.title = item.name;
            item.name = EXCEPTION_COMPONENT_KEY
        }
        children && asyncImportRoute(children);
    });
}
// 路由匹配，返回component fn
function dynamicImport(dynamicViewsModules, component) {
    const keys = Object.keys(dynamicViewsModules);
    const matchKeys = keys.filter((key) => {
        const routePath = key.replace('/src/views', '');
        const startFlag = component.startsWith('/');
        const endFlag = component.endsWith('.vue');
        const startIndex = startFlag ? 0 : 1;
        const lastIndex = endFlag ? routePath.length : routePath.lastIndexOf('.');
        return routePath.substring(startIndex, lastIndex) === component;
    });
    if (matchKeys?.length === 1) {
        const matchKey = matchKeys[0];
        return dynamicViewsModules[matchKey];
    } else if (matchKeys?.length > 1) {
        console.warn('不要在相同目录内创建多个同名文件（.vue），导致动态导入报错');
        return;
    } else {
        console.warn(`在src/views/下找不到${component}.vue文件`);
        return EXCEPTION_COMPONENT;
    }
}
// 扁平化路由，同时过滤掉无效的路由（菜单节点），避免加入路由表
function transformRouteToFlat(routes) {
    let flatRoute = [];
    function filter(routes) {
        routes.forEach((item) => {
            const { children, path } = item;
            path && flatRoute.push(item)
            children && filter(children)
        })
    }
    filter(routes)
    return flatRoute;
}
