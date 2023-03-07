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

// 内页路由（与权限无关，通常可以用于详情）
// 注意！path必须保持和组件路径一致（replace正则：'@/views|.vue'），避免页面被缓存
// 例如：导入路径：@/views/a/b/c.vue，则path为：/a/b/c
export const WithInRoutes = [
    {
        path: '/selection/standard/setStandard',
        name: '/selection/standard/setStandard',
        component: () => import('@/views/selection/standard/setStandard.vue')
    },
    {
        path: '/withIn/standardDetail',
        name: '/withIn/standardDetail',
        component: () => import('@/views/selection/standard/setStandard.vue')
    },
    {
        name: '/wel/announcement/lock-announcement',
        path: '/wel/announcement/lock-announcement',//查看通知公告页面
        component: () => import('@/views/wel/announcement/lock-announcement.vue')
    },
    {
        path: '/wel/enterpriseKpi/notice',//认定须知页面
        name: '/wel/enterpriseKpi/notice',
        component: () => import('@/views/wel/enterpriseKpi/notice.vue')
    },
    {
        path: '/wel/enterpriseKpi/index',//我的填报页面
        name: '/wel/enterpriseKpi/index',
        component: () => import('@/views/wel/enterpriseKpi/index.vue')
    },
    {
        name: '/dataAudit/index',
        path: '/dataAudit/index',//资料审核  省评市评-待办/已办页面使用
        component: () => import('@/views/dataAudit/index.vue')
    }
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