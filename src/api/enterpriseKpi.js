import axios from 'axios'
//查询申报明细（可编辑状态使用） (Auth)
export const detailEditApi = (params) => axios.get("/api/declare/detail/edit", { params })

//查询申报明细(只读状态使用) (Auth)
export const detailReadApi = (params) => axios.get("/api/declare/detail/read", { params })

// 保存申报明细
export const saveApi = (params) => axios.put("/api/declare/detail", params)
// 新增申报信息
export const infoApi = (params) => axios.post("/api/declare/info", params)
// 查询申报信息  
export const getInfoApi = (params) => axios.get("/api/declare/info/edit", { params })
// 查询申报信息
export const declareInfoApi = (params) => axios.get("/api/declare/info/read", { params })
//提交申报信息
export const saveInfoApi = (params) => axios.put("/api/declare/info", params)

//预览申报明细(只读状态使用) (Auth)
export const previewReadApi = (params) => axios.get("/api/declare/preview/read", { params })
//预览申报明细(编辑状态使用) (Auth)
export const previewEditApi = (params) => axios.get("/api/declare/preview/edit", { params })
//查询分组明细
export const groupApi = (params) => axios.get("/api/manage/fileSet/group", { params })
//查询申报明细 (Auth)
export const activityApi = (params) => axios.get("/api/desktop/activity", { params })

//保存申报信息 (Auth)
export const infoSaveApi = (params) => axios.post("/api/declare/info/save", params)


//企业申请报表
export const enterpriseApi = (params) => axios.get("/api/declare/table/enterprise", { params })
//个人申请报表
export const personalApi = (params) => axios.get("/api/declare/table/personal", { params })