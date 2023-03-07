/*
 * @Description: 市级推选
 * @Autor: wsy
 * @Date: 2022-08-24 13:39:26
 * @LastEditTime: 2022-09-03 14:39:12
 */
import axios from 'axios'

//企业分页
export const getEnterprisePage = (params) => axios.post("/api/manage/selectionResultConfirm/cityEnterprisePage", params);
// 企业导出
export const getCityEntExcel = (params) => axios.post("/api/manage/selectionResultConfirm/getCityEnterpriseExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 个人导出
export const getCityPersonExcel = (params) => axios.post("/api/manage/selectionResultConfirm/getCityPersonExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
//个人分页
export const getPersonPage = (params) => axios.post("/api/manage/selectionResultConfirm/cityPersonPage", params);
// 推选
export const batchWithdrawalApi = (params) => axios.post("/api/manage/selectionResultConfirm/push", params);
//处理申报信息 退回-通过
export const auditApi = (params) => axios.put('/api/audit/info', params);