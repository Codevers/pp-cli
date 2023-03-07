
import axios from 'axios'

//查询申报列表-分页  
export const getListApi = (params) => axios.get('/api/declare/list', { params });
//导出申报列表
export const excelApi = (params) => axios.post('/api/declare/list/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
//预览申报明细
export const previewApi = (params) => axios.get('/api/declare/preview', { params });//废弃
//撤回申报信息
export const revokeApi = (params) => axios.put('/api/declare/detail/revoke', params);

//预览申报明细(只读状态使用) (Auth)
export const previewReadApi = (params) => axios.get("/api/declare/preview/read", { params })
//预览申报明细(编辑状态使用) (Auth)
export const previewEditApi = (params) => axios.get("/api/declare/preview/edit", { params })




