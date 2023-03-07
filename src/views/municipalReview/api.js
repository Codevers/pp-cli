
import axios from 'axios'

//查询待认定列表（市站）-分页  
export const todoListApi = (params) => axios.get('/api/audit/todo/city', { params });
//导出待认定列表（市站）
export const todoExcelApi = (params) => axios.post('/api/audit/todo/city/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });

//查询已认定列表（市站）-分页  
export const doneListApi = (params) => axios.get('/api/audit/done/city', { params });
//导出已认定列表（市站）
export const doneExcelApi = (params) => axios.post('/api/audit/done/city/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });


//锁定评审任务
export const lockApi = (params) => axios.post('/api/audit/todo/lock', params);
