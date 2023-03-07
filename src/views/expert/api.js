/*
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-29 17:12:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-06 09:33:46
 */
import axios from 'axios'

//专家管理：获取分页
export const getProfessionalPage = (params) => axios.post("/api/manage/professionalInfo/page", params);
// 专家管理：新增
export const useCreateProfessionalApi = (params) => axios.post("/api/manage/professionalInfo/create", params);
// 专家管理：编辑更新
export const useUpdateProfessionalApi = (params) => axios.post("/api/manage/professionalInfo/update", params);
// 专家管理：启用/停用
export const useStopUseingApi = (params) => axios.post("/api/manage/professionalInfo/useOrStop", params);
// 专家管理：导出数据
export const useGetExcelApi = (params) => axios.post('/api/manage/professionalInfo/getExcel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
// 专家管理：上传文件
export const useUploadFilesApi = (params) => axios.post("/api/manage/professionalInfo/import", params);
// 专家管理：字典
export const getDicApi = (params) => axios.get('/api/manage/dictionary', { params })
// 专家管理：获取机构下拉
export const getOrganizationList = () => axios.get('/api/manage/organization/list')
//专家管理：重置密码
export const resetPasswordApi = (params) => axios.put('/api/manage/proficient/password/reset', params)