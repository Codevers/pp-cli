
import axios from 'axios'

//查询申报列表-分页  
export const getListApi = (params) => axios.get('/api/declare/list', { params });

export const excelApi = (params) => axios.post('/api/declare/list/excel', params);




