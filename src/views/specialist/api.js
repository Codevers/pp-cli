
import axios from 'axios'


//专家待办-分页  
export const todoListApi = (params) => axios.get('/api/workbench/proficient/todo', { params });
//专家待办-导出  
export const todoExcelApi = (params) => axios.post('/api/workbench/proficient/todo/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
//提交
export const submitApi = (params) => axios.post('/api/workbench/proficient/socre/submit', params);


//专家已办-分页  
export const doneListApi = (params) => axios.get('/api/workbench/proficient/done', { params });
//专家已办-导出  
export const doneExcelApi = (params) => axios.post('/api/workbench/proficient/done/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });



//我的评分-分页 
export const alldoListApi = (params) => axios.get('/api/workbench/proficient/alldo', { params });
//我的评分-导出  
export const alldoExcelApi = (params) => axios.post('/api/workbench/proficient/alldo/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
