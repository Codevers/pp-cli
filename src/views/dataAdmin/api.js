
import axios from 'axios'

//查询排名列表-分页  
export const getListApi = (params) => axios.get('/api/manage/memberScoreRank/page', { params });
//批量导入
export const importApi = (params) => axios.post('/api/manage/memberScoreRank/import', params);





