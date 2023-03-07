/*
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-08-02 16:43:31
 * @LastEditors: wangsy Wsiyu980410+
 * @LastEditTime: 2022-08-09 13:22:54
 */
import axios from 'axios'
// 日志：日志分页
export const useGetLogApi = (params) => axios.get("/api/manage/request-log/page", { params });
//日志：登录日志
export const useGetLoginLogApi = (params) => axios.get("/api/manage/login-log/page", { params });