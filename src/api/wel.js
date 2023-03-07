import axios from 'axios'
//查询认定标准列表
export const getActivity = (params) => axios.get('/api/selection/activity', { params });
//新增认定活动
export const addActivity = (params) => axios.post('/api/selection/activity', params);
//查询认定标准列表
export const getStandard = (params) => axios.get('/api/selection/standards/ddl', params);
//删除认定活动
export const delActivity = (params) => axios.delete('/api/selection/activity', { params });
//查询认定活动详情
export const detailActivity = (params) => axios.get('/api/selection/activity/detail', { params });
//更新认定活动
export const editActivity = (params) => axios.put('/api/selection/activity', params);
//导出认定活动
export const excelActivity = (params) => axios.post('/api/selection/activity/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
//发布认定活动
export const issueActivity = (params) => axios.put('/api/selection/activity/publish', params);
//结束认定活动
export const endActivityApi = (params) => axios.put('/api/selection/activity/end', params);
//查询我的待办
export const getTodoList = (params) => axios.get('/api/desktop/todo', { params });
//查询系统公告
export const userPageList = (params) => axios.post('/api/manage/announcement/userPage', params);
//活动进度
export const progressApi = (params) => axios.get('/api/desktop/progress', { params });

//获得上传文件分组
export const groupsApi = (params) => axios.get('/api/manage/dictionary', { params })

//通知公告管理导出
export const excelApi = (params) => axios.post('/api/manage/announcement/getExcel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } })

//系统公告导出
export const noticeApi = (params) => axios.post('/api/manage/announcement/userPageGetExcel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } })



//获得各省市列表 
export const getCityListApi = (params) => axios.get('/api/manage/organization-apply-num/list', { params })
//保存接口
export const saveSubmissionApi = (params) => axios.post('/api/manage/organization-apply-num/save', params)

