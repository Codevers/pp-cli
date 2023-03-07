import axios from 'axios'
// 查询列表
export const GetReportList = (params) => axios.get('/api/Statistical/Analysis/reportStatus', { params });
// 导出Excel
export const ExportReportExcelApi = (params) => axios.post("/api/Statistical/Analysis/reportStatus/excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });