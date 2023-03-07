import axios from 'axios'
// 待办发送分页-企业
export const GetProficentEnterprisePageApi = (params) => axios.get("/api/manage/score/declare/send/enterprise/page", { params });
// 待办发送分页-个人
export const GetProficentPersonalPageApi = (params) => axios.get("/api/manage/score/declare/send/personal/page", { params });
// 发送专家待办
export const SendProficentApi = (params) => axios.post("/api/manage/score/decalre/proficent/send", params);
// 取消已分配专家
export const CancleAllocatedApi = (params) => axios.post("/api/manage/score/declare/distribute/proficent/cancel", params);
// 一键发送所有待办-个人
export const SendAllocatedPersonalApi = (params) => axios.post("/api/manage/score/decalre/proficent/all-send/personal", params);
// 一键发送所有待办-企业
export const SendAllocatedEnterpriseApi = (params) => axios.post("/api/manage/score/decalre/proficent/all-send/enterprise", params);
// 导出Excel-企业
export const ExportEnterpriseExcelApi = (params) => axios.post("/api/manage/score/declare/send/enterprise/excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 导出Excel-个人
export const ExportPersonalExcelApi = (params) => axios.post("/api/manage/score/declare/send/personal/excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });