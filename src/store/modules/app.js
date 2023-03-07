import { defineStore } from 'pinia'
import { store } from '@/store';
import { GetDictionaryApi, GetRegionApi } from '@/api/common'
import { WithInRoutes } from '@/router/basic'
import { DestoryRoute } from '@/router/destoryRoute'
import { useUserStore } from './user'
// 获取字典 |文件类型（分组）：4 |是否启用：6 |数据权限：7 |组织机构类型：5 |专业：2 |单位类型：3 |发送人类别：9 | 计分规则：10
const Types = [4, 6, 7, 5, 2, 3, 9, 10]
// 默认安徽省
const AHCode = 340000
// 默认不缓存的路由
const GetDestoryRoutes = WithInRoutes.map(i => i.path)
// app store，定义与业务不相关的状态
export const useAppStore = defineStore('app', {
    state: () => ({
        // 侧栏展开状态
        sideExpandStatus: false,
        // 全局字典
        globalDict: [],
        // 安徽省城市
        globalCity: [],
        // 缓存页面
        cacheNames: [],
        // 路由缓存销毁列表
        destroyNames: [...GetDestoryRoutes, ...DestoryRoute],
        // 左侧:1
        // 顶部:2
        navMode: localStorage.getItem('navMode') || 1
    }),
    getters: {
        getGlobalDict() {
            return (category) => this.globalDict[category]
        },
        getGlobalCity() {
            return (code) => this.globalCity.find(i => i.provinceCode === code)?.children
        },
        getAHCity() {
            return this.globalCity.find(i => i.provinceCode === AHCode)?.children
        },
        getNavMode() {
            return localStorage.getItem('navMode') || this.navMode
        }
    },
    actions: {
        // 获取通用字典配置
        async getDictionary() {
            setTimeout(async () => {
                for (let item of Types) {
                    let res = await GetDictionaryApi({ category: item })
                    this.globalDict[item] = res.data
                }
            }, 5000)
        },
        // 获取全国数据
        async GetCity() {
            let res = await GetRegionApi({ province: '', city: '', area: '', level: '' })
            this.globalCity = res.data
        },
        // 生成缓存路由
        setCacheAppName(name) {
            this.destroyNames = this.destroyNames.filter(i => i !== name)
        },
        // 清除路由缓存
        clearCacheAppName(name) {
            this.destroyNames.push(name)
        },
        setNavMode(value) {
            this.navMode = value;
            localStorage.setItem('navMode', value);
        }
    },
})
// 需要在设置之外使用
export function useAppStoreWithOut() {
    return useAppStore(store);
}
export const appStoreWithOut = useAppStore(store)