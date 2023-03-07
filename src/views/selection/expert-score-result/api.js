import axios from 'axios'
// 评分结果分页-企业
// export const GetScoreResultEnterprisePageApi = (params) => axios.post("/api/manage/scoreResult/enterprisePage", params);
// 评分结果分页-个人
// export const GetScoreResultPersonalPageApi = (params) => axios.post("/api/manage/scoreResult/personPage", params);
// 评分结果分页（8-25合并一个接口）
export const GetScoreResultPageApi = (params) => axios.get("/api/manage/proficient-score-record/result-page", { params });
// 导出Excel-企业
// export const ExportEnterpriseExcelApi = (params) => axios.post("/api/manage/scoreResult/enterpriseExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 导出Excel-个人
// export const ExportPersonalExcelApi = (params) => axios.post("/api/manage/scoreResult/personExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 导出Excel（8-25 二合一）
export const ExportExcelApi = (params) => axios.post("/api/manage/proficient-score-record/result-page-excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 退回专家评分
export const ScoreBackApi = (params) => axios.post("/api/workbench/proficient/socre/back", params);
// 获取活动下拉
export const GetActivityListNew = (params) => axios.get('/api/selection/activity/selecting/all', { params });

