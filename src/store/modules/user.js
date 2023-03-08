import { defineStore } from 'pinia'
import { store } from '@/store';
import Cookies from 'js-cookie'
import { TOKEN_KEY, LOGIN_TYPE } from '@/enums/cacheEnum'
import { usePermissionStore } from './permission'
import { appStoreWithOut } from '@/store/modules/app';
import { useTabsStore } from './tabs'
import { router, resetRouter } from '@/router'
import { PageEnum } from '@/enums/pageEnum';
import { useGetAdminUserInfoApi, useGetUserInfoApi } from '@/api/common';
import modifyPassword from '../../components/ModifyPassword/index.js'
// user store，定义与用户信息业务相关的状态
export const useUserStore = defineStore('user', {
    state: () => ({
        // 用户信息是否已存储
        isAddedUserInfo: false,
        // 用户信息
        userInfo: {},
        // 鉴权凭证
        token: Cookies.get(TOKEN_KEY) || '',
        // 首页
        homePath: '',
        // 首页的页签标题
        homeTitle: '',
        //登录类型
        loginType: Cookies.get(LOGIN_TYPE) ? Cookies.get(LOGIN_TYPE) : '',
        // 系统初次登陆加载状态
        loginLoading: false,
        // 登录须知 弹窗
        noticeDialog: true
    }),
    getters: {
        getToken() {
            return this.token
        },
        getUserInfo() {
            return this.userInfo;
        },
        getHomePath() {
            return this.homePath
        },
        getHomeRoutePath() {
            return '/' + this.homePath
        },
        getHomeRoute() {
            return {
                name: this.getHomeRoutePath,
                path: this.getHomeRoutePath,
                title: this.getHomeTitle
            }
        },
        getHomeTitle() {
            return this.homeTitle
        },
        getIsAddedUserInfo() {
            return this.isAddedUserInfo
        }
    },
    actions: {
        setAddedUserInfo(added) {
            this.isAddedUserInfo = added;
        },
        setToken(value) {
            Cookies.set(TOKEN_KEY, value, { expires: 10 });
            this.token = value
        },
        setUserInfo(value) {
            this.userInfo = value;
        },
        setHomePath(value) {
            this.homePath = value;
        },
        setHomeTitle(value) {
            this.homeTitle = value;
        },
        setLoginType(value) {
            Cookies.set(LOGIN_TYPE, value, { expires: 10 });
            this.loginType = value
        },
        setLoginState(value) {
            this.loginLoading = value
        },
        async login(token, type) {
            this.setToken(token);
            this.setLoginType(type);
            // 登录后，执行路由载入、用户信息存储
            this.afterLoginAction();
        },
        async afterLoginAction() {
            if (!this.getToken) return null;
            const permissionStore = usePermissionStore();
            // 获取用户信息并存储
            await this.getUserInfoAction();
            // 生成路由表
            await permissionStore.buildRoutesAction();
            // 进入首页
            await router.replace(this.homePath);
            this.setLoginState(false)
        },
        //  interface user {
        //      expiresIn: Number,
        //      homePath: String
        //      success: Boolean
        //      token: String
        //      tokenType: String
        //  }
        async getUserInfoAction() {
            if (!this.getToken) return null;
            try {
                // 接口获取用户信息
                let resInfo = {};
                if (this.loginType === "admin") {
                    resInfo = await useGetAdminUserInfoApi()
                } else {
                    resInfo = await useGetUserInfoApi()
                }
                const userInfo = resInfo?.success ? resInfo.data : {}
                this.getDictionaryAction();
                this.setUserInfo(userInfo);
                this.setAddedUserInfo(true)
                //挂载判断是否为新用户，新用户强制修改密码
                userInfo.isNew && modifyPassword()
            } catch (error) {
                this.logout()
            }
        },
        // 获取全局通用字典
        getDictionaryAction() {
            appStoreWithOut.getDictionary() // 通用字典
            appStoreWithOut.GetCity() //安徽市
        },
        // 退出登录，清除信息
        logout() {
            const tabsStore = useTabsStore()
            const permissionStore = usePermissionStore();
            this.setToken('');
            this.setUserInfo({});
            this.setLoginType('');
            tabsStore.resetTabs();
            permissionStore.sideMenu.splice(0);
            permissionStore.resetState();
            resetRouter()
            router.push(PageEnum.ROOT_PATH);
        },
        //登录须知弹窗
        setNoticeDialog() {
            this.noticeDialog = !this.noticeDialog
        }
    },
})

// 需要在设置之外使用
export function useUserStoreWithOut() {
    return useUserStore(store);
}
export const userStore = useUserStore(store)