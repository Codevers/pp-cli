import axios from 'axios'
// 数据大屏
export const GetLayoutData = (params) => axios.get("/api/Statistical/Analysis/dataScreen", { params });
