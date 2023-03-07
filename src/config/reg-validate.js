export const rulePassword = {
    tip: '密码长度为8-12个字符，且包含数字、字母、符号3种组合，字母区分大小写',
    // rule: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$,^&*]{8,12}$/
    rule: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@;#$%^&*()_+`\-={}:";'<>?,.\/]).{8,12}$/
}
export const ruleAccount = {
    tip: '由数字或字母组成',
    rule: /^[0-9a-zA-Z_]{1,}$/
}
export const rulePhone = {
    tip: '手机号码格式错误',
    rule: /^1(3|4|5|6|7|8|9)\d{9}$/
}
export const ruleOnlyNumber = {
    tip: '请输入正整数',
    rule: /^\+?[1-9][0-9]*$/
}
export const ruleNumber = {
    tip: '请输入数字',
    rule: /^\d+$/
}
