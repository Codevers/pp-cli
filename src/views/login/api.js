/*
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-28 09:27:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-26 10:55:34
 */
import axios from 'axios'
// 登录：admin登录
export const useLoginAdminApi = (params) => axios.get('/api/public/manageUser/token', { params });
// 登录：企业、个人/专家登录
export const getLoginEntExpertApi = (params) => axios.post('/api/manage/customerLogin/loginCheck', params);
// 忘记密码：获取密保问题
export const useGetQuestionApi = (params) => axios.get('/api/manage/customerLogin/getQuestionByAccount', { params });
// 忘记密码：校验密保问题
export const useCheckAnswerApi = (params) => axios.post('/api/manage/customerLogin/checkAnswer', params);
// 忘记密码：校验密保问题通过后修改密码
export const useCheckPassApi = (params) => axios.post('/api/manage/customerLogin/changePasswordAfterCheckPass', params);
//登录：专家选择身份二次校验获取token
export const getCustomerToken = (params) => {
    const { token } = params;
    delete params.token;
    return axios.get('/api/manage/customerLogin/token', { params, headers: { 'Authorization': `Bearer ${token}` } })
};