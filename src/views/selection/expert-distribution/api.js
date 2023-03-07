import axios from 'axios'

// 企业-分页查询
export const GetEnterprisePageApi = (params) => axios.get("/api/manage/score/declare/enterprise/page", { params });
// 个人-分页查询
export const GetPersonalPageApi = (params) => axios.get("/api/manage/score/declare/personal/page", { params });
// 申报重选专家分页查询
export const GetExpertSelectPageApi = (params) => axios.get("/api/manage/professionalInfo/distribute/change/page", { params });
// 个人-导出
export const ExportEnterpriseExcelApi = (params) => axios.post("/api/manage/score/declare/enterprise/excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 企业-导出
export const ExportPersonalExcelApi = (params) => axios.post("/api/manage/score/declare/personal/excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 专家总数/未分配
export const GetExpertTotalApi = (params) => axios.get("/api/manage/professionalInfo/summary", { params });
// 分配专家
export const DistributeExpertApi = (params) => axios.post("/api/manage/score/distribute", params);
// 待分配任务数
export const GetUnassignedTaskApi = (params) => axios.get("/api/manage/score/declare/undistribute/count", { params });
// 指定分组数
export const GetAppointGroupListApi = (params) => axios.get("/api/selection/activity/group/number", { params });
// 活动一级评分项列表
export const GetScoreItemApi = (params) => axios.get("/api/selection/activity/projects", { params });
// 指定专家
export const ReplaceExpertApi = (params) => axios.put("/api/declare/proficient/change", params);
// 计分规则
export const GetScoreRuleApi = (params) => axios.get("/api/manage/dictionary/calculate-score-category", { params });

