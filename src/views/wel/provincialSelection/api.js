/*
 * @Description: 省认定结果确认
 * @Autor: wsy
 * @Date: 2022-08-18 09:51:49
 */
import axios from 'axios'

//企业分页
export const getEnterprisePage = (params) => axios.post("/api/manage/selectionResultConfirm/enterprisePage", params);
// 公示推选
export const batchWithdrawalApi = (params) => axios.post("/api/manage/selectionResultConfirm/push", params);
// 撤回
export const pushWithdrawApi = (params) => axios.post("/api/manage/selectionResultConfirm/pushWithdraw", params);
// 修改分数
export const updateScoreApi = (params) => axios.post("/api/manage/selectionResultConfirm/updateScore", params);
//获取认定活动下拉
export const getActivity = () => axios.get("/api/selection/activity/ddl");
//个人分页
export const getPersonPage = (params) => axios.post("/api/manage/selectionResultConfirm/personPage", params);
//获取有效认定活动下拉
export const getSelecting = (params) => axios.get("/api/selection/activity/selecting", { params });
//企业导出
export const getEntExcel = (params) => axios.post("/api/manage/selectionResultConfirm/getEnterpriseExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
//个人导出
export const getPersonExcel = (params) => axios.post("/api/manage/selectionResultConfirm/getPersonExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });