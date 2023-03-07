import axios from 'axios'
import { ElNotification } from 'element-plus'
import qs from 'qs'
import Cookies from 'js-cookie'
import { useUserStore } from '@/store/modules/user'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import loginLayout from '@/components/LoginLayout'
import { GetDictionaryApi } from '@/api/common'
const userStore = useUserStore();
// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
// 异常捕获
const errorHandle = (status, resMsg) => {
    switch (status) {
        case 401:
            ElNotification.error('登录信息已过期,请重新登录')
            userStore.logout()
            break
        case 404:
            ElNotification.error('请求的资源不存在')
            break
        case 500:
            ElNotification.error('服务器内部错误')
            break
        case 413:
            ElNotification.error('文件请求体过大')
            break
        default:
            ElNotification.error(resMsg || `请求出错，错误码：${status}`)
            break
    }
}
// 刷新token
function getNewToken() {
    return new Promise((resolve, reject) => {
        axios.post('oauth/token', {
            // grant_type: 'refresh_token',
            // refresh_token: store.state.permission.refreshToken
        }, {
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        }).then(res => {
            resolve(res)
        }).catch((error) => {
            reject(error)
        })
    })
}
axios.defaults.timeout = 25000
axios.defaults.baseURL = import.meta.env.VITE_API_PREFIX

/**
 * 序列化`get`参数
 * `axios`默认使用`qs`库进行序列化，`arrayFormat`为`brackets`，数组参数输出为：a[]=foo&a[]=bar
 * 根据接口需求修改`arrayFormat`为`repeat`，数组参数输出为：a=foo&a=bar
 */
axios.defaults.paramsSerializer = (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat' });
};

// before request
axios.interceptors.request.use(config => {
    const token = userStore.getToken && Cookies.get(TOKEN_KEY)
    //const token = userStore.getToken && sessionStorage.getItem(TOKEN_KEY)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// after request
axios.interceptors.response.use(res => {
    // loginLayout()
    //保存blob文件name
    let disposition = res.headers !== undefined ? res.headers["content-disposition"] : "";
    if (disposition !== null) {
        sessionStorage.setItem("blobName", disposition);
        return res.data;
    }

    return res.data
}, error => {
    const { response, config } = error
    const { status, data } = response;
    const { msg } = data;
    // 异常提示
    response && errorHandle(status, msg)
    // 登录凭证过期处理
    // if (status === 401) {
    //     if (!isRefreshing) {
    //         //保证token只刷一次
    //         isRefreshing = true;
    //         loginLayout().then((params) => {
    //             console.log('params', params)
    //             return GetDictionaryApi({ category: 5 }).then((res) => {
    //                 // 更新token
    //                 // userStore.setToken()
    //                 // 将所有队列中的请求进行重试
    //                 requests.forEach(cb => cb())
    //                 // 重试完清空队列
    //                 requests = []
    //                 return axios(config) //将第一次进入的请求进行重请求
    //             }).catch(error => {
    //                 console.log(error.response.status);
    //                 // 刷新token失败，退出重登录
    //             }).finally(() => {
    //                 isRefreshing = false
    //             })
    //         })

    //     } else {
    //         // 正在刷新token，返回一个未执行resolve的promise
    //         return new Promise((resolve) => {
    //             // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
    //             requests.push(() => {
    //                 resolve(axios(config))
    //             })
    //         })
    //     }
    // }
    return Promise.reject(error)
})

export default axios;
