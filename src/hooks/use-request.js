/**
 $ @Description 对useRequest做二次包装
 $ @Author Peng.p
 $ @Date 2022-07-30 16:34:15
 $ @LastEditTime 2022-09-15 14:15:27
 */
import { useRequest as Request } from 'v3hooks' //插件地址：https://yanzhandong868.gitbook.io/v3hooks/
import { ElMessage } from 'element-plus'
// 接口响应结构
const { state, resData, message, code } = {
    state: 'success',
    resData: 'data',
    message: 'msg',
    code: 'code'
}

function messageLayout(message, type) {
    ElMessage({
        message,
        type,
    })
}
// 定义则会覆盖接口返回的msg，传[]则使用接口返回的msg，不传msgTxt则表示无任何提示（除了http错误）
function showSuccessMsg(data, msgTxt) {
    try {
        if (!msgTxt) return;
        if (data[state]) {
            messageLayout(msgTxt[0] || data[message], 'success')
        } else {
            messageLayout(msgTxt[1] || data[message], 'warning')
        }
    } catch (error) {
        console.error('请检测msgTxt类型是否正确');
    }
}
// 定义deepData为true时，showSuccessMsg会失效
export default function useRequest(getApi, rest = {}) {
    return Request(getApi, {
        ...rest,
        onSuccess: (data, params) => {
            !rest.deepData && showSuccessMsg(data, rest.msgTxt);
            const resState = rest.deepData ? true : data[state];
            rest?.onSuccess(data, resState, { success: resState, params: params[0] });
        },
        formatResult: (data) => {
            if (rest.deepData) return data.data;
            return data;
        }
    })
}
