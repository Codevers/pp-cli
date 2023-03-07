/*
 * @Author: wangsy Wsiyu980410+
 * @Date: 2022-08-05 15:55:37
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-22 19:49:06
 * @FilePath: \web_ahpy\src\utils\regExp.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** 
 * 8到12位密码格式
 */
export const str8To12Password = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[._~!@#$^&*])[A-Za-z0-9._~!@#$^&*]{8,12}$/;
/** 
 * 手机格式
 */
export const mobilePhone = /^1(3|4|5|6|7|8|9)\d{9}$/
/** 
 * 身份证号
 */
export const identity = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;