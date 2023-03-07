import axios from 'axios'
// // 字典：分组
// export const GetGroupApi = (params) => axios.get("/api/manage/dictionary", { params });

// 认定标准：查询
export const GetStandardPageApi = (params) => axios.get("/api/selection/standards", { params });
// 认定标准：新增
export const CreateStandardApi = (params) => axios.post("/api/selection/standards", params);
// 认定标准：删除
export const DeleteStandardApi = (params) => axios.delete("/api/selection/standards", { params });
// 认定标准：修改
export const ModifyStandardApi = (params) => axios.put("/api/selection/standards", params);
// 认定标准：复制
export const CopyStandardApi = (params) => axios.post("/api/selection/standards/copy", params);
// 认定标准：启用
export const EnableStandardApi = (params) => axios.put("/api/selection/standards/status/enable", params);
// 认定标准：禁用
export const DisableStandardApi = (params) => axios.put("/api/selection/standards/status/disable", params);
// 认定标准：明细
export const GetStandardDetailApi = (params) => axios.get("/api/selection/standards/projects", { params });
// 认定标准明细生成：导出
export const ExportStandardApi = (params) => axios.post("/api/selection/standards/excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });


// 认定标准明细生成：新增
export const CreateStandardProjectApi = (params) => axios.post("/api/selection/standards/projects", params);
// 认定标准明细生成：删除
export const DeleteStandardProjectApi = (params) => axios.delete("/api/selection/standards/projects", { params });
// 认定标准明细生成：更新
export const ModifyStandardProjectApi = (params) => axios.put("/api/selection/standards/projects", params);
// 认定标准明细生成：导出
export const ExportStandardProjectApi = (params) => axios.post("/api/selection/standards/projects/excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });
// 认定标准明细生成：新增-子
export const CreateStandardChildProjectApi = (params) => axios.post("/api/selection/standards/projectSubs", params);
// 认定标准明细生成：删除-子
export const DeleteStandarChilddProjectApi = (params) => axios.delete("/api/selection/standards/projectSubs", { params });
// 认定标准明细生成：更新-子
export const ModifyStandardChildProjectApi = (params) => axios.put("/api/selection/standards/projectSubs", params);

