/*
 * @Description: 
 * @Autor: wsy
 * @Date: 2022-08-26 10:55:25
 * @LastEditTime: 2022-08-26 10:58:17
 */
import axios from 'axios'
//获取外网公示分页列表
export const getPubilicityPage = (params) => axios.post('/api/manage/publicity/publicityResultPage', params)


//获取外网公示发布文件分页列表
export const getIssuePage = (params) => axios.get('/api/public/publicity-document', { params })

//获得文件路径
export const filePathApi = (params) => axios.get("/api/public/file/path", { params });

//获得证明文件
export const fileDataApi = (id) => axios.get(`/api/declare/public-attachment?declareInfoId=${id}`);