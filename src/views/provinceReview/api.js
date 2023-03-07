
import axios from 'axios'

//获得所在市数据
export const regionApi = (params) => axios.get('/api/manage/dictionary/region', { params })

//查询待认定列表（省站）-分页  
export const todoListApi = (params) => axios.get('/api/audit/todo/prov', { params });
//导出待认定列表（省站）
export const todoExcelApi = (params) => axios.post('/api/audit/todo/prov/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });



//查询已认定列表（省站）-分页  
export const doneListApi = (params) => axios.get('/api/audit/done/prov', { params });
//导出已认定列表（省站）
export const doneExcelApi = (params) => axios.post('/api/audit/done/prov/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
