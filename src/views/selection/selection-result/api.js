import axios from 'axios';

// 企业分页：查询
export const enterprisePageApi = (data) =>
  axios.post('/api/manage/scoreResult/selectionEnterprisePage', data);

// 企业分页：导出
export const enterpriseExcelApi = (data) =>
  axios.post('/api/manage/scoreResult/getSelectionEnterpriseExcel', data, { responseType: 'blob' });

// 个人分页：查询
export const personPageApi = (data) =>
  axios.post('/api/manage/scoreResult/selectionPersonPage', data);

// 个人分页：导出
export const personExcelApi = (data) =>
  axios.post('/api/manage/scoreResult/getSelectionPersonExcel', data, { responseType: 'blob' });
