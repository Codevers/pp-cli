import axios from 'axios'
//个人会员 分页
export const getMemberList = (params) => axios.post('/api/manage/personCustomer/page', params);
//个人会员 导出
export const getMemberExcel = (params) => axios.post('/api/manage/personCustomer/getExcel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
//个人详情
export const getUserDetail = (params) => axios.get('/api/manage/personCustomer/getDetail', { params });
//获取个人用户明细
export const getPersonageDetail = (params) => axios.get('/api/manage/customerLogin/getPersonalUserDetailInfo', { params });
//个人会员 重置密码
export const passwordResetApi = (params) => axios.put('/api/manage/personCustomer/password/reset', params);


//企业会员 分页
export const getEnterpriselist = (params) => axios.post('/api/manage/enterpriseCustomer/page', params);
//企业会员 导出
export const getEnterpriseExcel = (params) => axios.post('/api/manage/enterpriseCustomer/getExcel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
//企业详情
export const getDetail = (params) => axios.get('/api/manage/enterpriseCustomer/getDetail', { params });
//获取企业用户明细
export const getEnterpriseDetail = (params) => axios.get('/api/manage/customerLogin/getEnterpriseUserDetailInfo', { params });
//企业会员 重置密码
export const enterprisePasswordReset = (params) => axios.put('/api/manage/enterpriseCustomer/password/reset', params);

//信用等级
export const getDictionary = (params) => axios.get('/api/manage/dictionary', { params })
//获得所在市数据
export const GetRegionApi = (params) => axios.get('/api/manage/dictionary/region', { params })

//企业信息同步
export const SyncCompanyApi = (params) => axios.post('/api/syncInfo/sync/company')
//人员信息同步
export const SyncPersonApi = (params) => axios.post('/api/syncInfo/sync/person')


