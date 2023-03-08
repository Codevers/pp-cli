import axios from "axios";

//获取正在进行的认定活动
export const getSelecting = (params) => axios.get("/api/desktop/selection", { params });
//查询我的事项
export const getIssue = (params) => axios.get("/api/desktop/issue", { params });
//查询统计看板
export const getCount = (params) => axios.get("/api/manage/customerLogin/getCustomerCount", { params });
//查询专家的事项
export const getTechnicalIssue = (params) => axios.get("/api/workbench/proficient/desk", { params });
