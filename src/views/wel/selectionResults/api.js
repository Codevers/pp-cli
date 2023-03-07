/*
 * @Description: 
 * @Autor: wsy
 * @Date: 2022-08-23 16:43:45
 */
import axios from 'axios'

//企业分页
export const getEnterprisePage = (params) => axios.post("/api/manage/filed/enterprisePage", params);
//个人分页
export const getPersonPage = (params) => axios.post("/api/manage/filed/personPage", params);
//归档
export const filedInfo = (params) => axios.post("/api/manage/filed/filed", params);
//企业导出
export const getEntExcel = (params) => axios.post("/api/manage/filed/getEnterpriseExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
//个人导出
export const getPersonExcel = (params) => axios.post("/api/manage/filed/getPersonExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
//活动结束
export const closeActivity = (params) => axios.put("/api/selection/activity/end", params);

//活动公示中申报信息
export const publicDeclare = (params) => axios.get("/api/selection/public-declare", { params });


