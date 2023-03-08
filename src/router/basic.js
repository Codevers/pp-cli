import { LAYOUT, LOGIN, PUBLICITY, ERROR_COMPONENT, NOINDEX_COMPONENT } from './constant'
import { PAGE_NOT_FOUND_KEY, ROOT_ROUTE_NAME, PAGE_NO_INDEX_KEY } from '@/enums/cacheEnum'

// 基本路由（未登录或无权限时，可访问）
export const BasicRoute = [
    {
        path: '/login',
        name: 'LOGIN',
        meta: {
            ignoreAuth: true // 忽略token鉴权
        },
        component: LOGIN
    },
    {
        path: '/publicity/index',
        name: 'PUBLICITY',
        meta: {
            ignoreAuth: true // 忽略token鉴权
        },
        component: PUBLICITY
    },
];

// 根路由
export let rootRoute = {
    path: '/',
    name: ROOT_ROUTE_NAME,
    component: LAYOUT
}

// 详情路由（通常是一级路由，为了避免权限控制，可在此处加入白名单）
// 注意！path必须保持和组件路径一致
// 免缓存规则：replace正则：'@/views|.vue'）
// 例如：导入路径：@/views/a/b/c.vue，则path为：/a/b/c
export const WithInRoutes = [
    // demo
    // {
    //     path: '/selection/standard/setStandard',
    //     name: '/selection/standard/setStandard',
    //     component: () => import('@/views/selection/standard/setStandard.vue')
    // },
]

// 无效路由（无效路由、无权路由，不进行抽离了，跳转逻辑公用）
// export const PageNotFoundRoute = {
//     path: '/:path(.*)*',
//     name: PAGE_NOT_FOUND_KEY,
//     component: ERROR_COMPONENT
// }
export const PageNotFoundRoute = [
    {
        path: PAGE_NO_INDEX_KEY,
        name: PAGE_NO_INDEX_KEY,
        component: NOINDEX_COMPONENT
    },
    {
        path: '/:path(.*)*',
        name: PAGE_NOT_FOUND_KEY,
        component: ERROR_COMPONENT
    }
]