import axios from 'axios';

// 我的评分：查询
export const listApi = (params) => axios.get('/api/workbench/proficient/alldo', { params });

// 我的评分：导出
export const exportApi = (params) =>
  axios.post('/api/workbench/proficient/alldo/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 查看专家评分
export const viewDetailApi = (params) => axios.get('/api/workbench/proficient/detail', { params });

// 查看专家评分（编辑）
export const editDetailApi = (params) =>
  axios.get('/api/workbench/proficient/score/edit', { params });

// 提交专家评分
export const commitScoreApi = (data) => axios.put('/api/workbench/proficient/score/commit', data);

// 保存专家评分
export const saveScoreApi = (data) => axios.put('/api/workbench/proficient/score/save', data);

// 批量提交评分
export const submitApi = (data) => axios.post('/api/workbench/proficient/socre/submit', data);

// 专家评分日志
export const scoreLogApi = (params) => axios.get('/api/declare/score-log', { params });
