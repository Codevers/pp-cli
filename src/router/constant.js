// 容器组件，此项目架构用一个足够
export const LAYOUT = () => import('@/layouts/Layout.vue');

// 登录组件
export const LOGIN = () => import('@/views/login/login.vue')

// 外网公示组件
export const PUBLICITY = () => import('@/views/publicity/index.vue')

// 异常组件，当未从本地找到路由组件时，返回显示
export const EXCEPTION_COMPONENT = () => import('@/views/other/exception/exception.vue');

// 404组件，当访问不存在的路由时，返回显示
export const ERROR_COMPONENT = () => import('@/views/other/exception/pageNotFound.vue');

// 未定义首页时，返回显示
export const NOINDEX_COMPONENT = () => import('@/views/other/exception/pageNoIndex.vue');