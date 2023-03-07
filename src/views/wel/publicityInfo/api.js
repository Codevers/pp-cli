/*
 * @Description: 
 * @Autor: wsy
 * @Date: 2022-08-23 16:43:45
 */
import axios from 'axios'

//企业分页
export const getEnterprisePage = (params) => axios.post("/api/manage/publicity/enterprisePage", params);
//个人分页
export const getPersonPage = (params) => axios.post("/api/manage/publicity/personPage", params);
//公示
export const publicityInfo = (params) => axios.post("/api/manage/publicity/publicity", params);
//企业导出
export const getEntExcel = (params) => axios.post("/api/manage/publicity/getEnterpriseExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
//个人导出
export const getPersonExcel = (params) => axios.post("/api/manage/publicity/getPersonExcel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
//获取公示数量
export const getPublicityCount = (params) => axios.post("/api/manage/publicity/getPublicityCount", params);