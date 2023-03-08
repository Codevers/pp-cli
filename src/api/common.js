import axios from 'axios'
// 获取用户菜单
export const getUserMenu = () => axios.get("/api/public/menu/list")
// 获取用户信息
export const getUserInfo = (params) => axios.get("/api/public/manageUser/userInfo", { params })
// 获取区域，安徽: 340000
export const GetRegionApi = (params) => axios.get("/api/manage/dictionary/region", { params })
// 获取区域，安徽: 340000
export const getRegion = (params) => axios.get("/api/manage/dictionary/region", { params })
// 文件类型（分组）：4 |是否启用：6 |数据权限：7 |组织机构类型：5
export const GetDictionaryApi = (params) => axios.get("/api/manage/dictionary", { params });
// 获取admin用户详情信息
export const useGetAdminUserInfoApi = () => axios.get('/api/public/manageUser/userInfo');
// 获取用户详情信息
export const useGetUserInfoApi = () => axios.get('/api/manage/customerLogin/userInfo');
// 获取用户详情信息
export const getCustomerMenu = () => axios.get('/api/manage/customerMenu/list');
// 工作台：修改密码
export const useChangePasswordApi = (params) => axios.post('/api/manage/customerLogin/changePassword', params)
// 获取密保信息
export const getSecretInfo = () => axios.get('/api/manage/customerLogin/getQuestionAndAnswer');
// 工作台：修改管理员密码
export const useChangeAdminPasswordApi = (params) => axios.put('/api/public/manageUser/password', params)
// 获取认定活动（下拉字典）
export const GetActivityList = () => axios.get('/api/selection/activity/ddl');
// 获取正在认定活动（下拉字典）
export const GetActivityListNew = (params) => axios.get('/api/selection/activity/selecting', { params });
// 获取正在认定活动（下拉字典）数量
export const GetActivityCount = () => axios.get('/api/selection/activity/effective/count');
// 根据页面模块获取认定活动
export const getActivitysByType = (params) => axios.get('/api/selection/activity/type', { params });
// 根据页面模块获取认定活动数量
export const getCountByType = (params) => axios.get('/api/selection/activity/countByType', { params });
