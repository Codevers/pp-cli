export function resultSuccess(data) {
    return {
        status: 200,
        success: true,
        msg: "成功",
        data
    };
}
export function resultError(data = null) {
    return {
        status: 404,
        success: false,
        msg: '错误',
        data
    };
}