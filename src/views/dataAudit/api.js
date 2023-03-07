import axios from 'axios'

//查询审批详情
export const todoPreviewApi = (params) => axios.get('/api/audit/detail', { params });

//保存审批明细意见
export const saveDetailApi = (params) => axios.put('/api/audit/detail/comment', params);
//保存审批信息意见
export const saveInfoApi = (params) => axios.put('/api/audit/info/comment', params);
//处理申报信息 退回-通过
export const auditApi = (params) => axios.put('/api/audit/info', params);

//查询审批信息 (Auth)
export const getInfoApi = (params) => axios.get("/api/audit/info", { params });


//查询待认定列表（市站）-分页  
export const cityListApi = (params) => axios.get('/api/audit/todo/city', { params });
//查询待认定列表（省站）-分页  
export const provListApi = (params) => axios.get('/api/audit/todo/prov', { params });
//锁定评审任务
export const lockApi = (params) => axios.post('/api/audit/todo/lock', params);


