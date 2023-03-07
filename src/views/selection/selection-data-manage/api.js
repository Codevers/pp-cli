import axios from 'axios';

// 企业分页：查询
export const enterprisePageApi = (data) =>
  axios.post('/api/manage/SelectionMaterialsManage/enterprisePage', data);

// 企业分页：导出
export const enterpriseExcelApi = (data) =>
  axios.post('/api/manage/SelectionMaterialsManage/getEnterpriseExcel', data, {
    responseType: 'blob'
  });

// 个人分页：查询
export const personPageApi = (data) =>
  axios.post('/api/manage/SelectionMaterialsManage/personPage', data);

// 个人分页：导出
export const personExcelApi = (data) =>
  axios.post('/api/manage/SelectionMaterialsManage/getPersonExcel', data, { responseType: 'blob' });

// 获取文件
export const getFilesApi = (data) =>
  axios.post('/api/manage/SelectionMaterialsManage/getFiles', data);

//预览申报明细(只读状态使用) (Auth)
export const previewReadApi = (params) => axios.get("/api/declare/preview/read", { params })  
