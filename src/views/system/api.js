import axios from 'axios'
// 字典集
// 文件类型（分组）：4 |是否启用：6 |数据权限：7 |组织机构类型：5
export const GetDictionaryApi = (params) => axios.get("/api/manage/dictionary", { params });

// 附件管理：查询
export const GetFilePageApi = (params) => axios.get("/api/manage/fileSet/page", { params });
// 附件管理：新增
export const CreateFileApi = (params) => axios.post("/api/manage/fileSet/create", params);
// 附件管理：删除
export const DeleteFileApi = (params) => axios.delete("/api/manage/fileSet/delete", { params });
// 附件管理：修改
export const ModifyFileApi = (params) => axios.put("/api/manage/fileSet/modify", params);
// 附件管理：详情
export const GetFileDetailApi = (params) => axios.get("/api/manage/fileSet", { params });
// 附件管理：检查记录是否被引用
export const CheckFileQuoteApi = (params) => axios.get("/api/manage/fileSet/used", { params });

// 角色管理：查询
export const GetRolePageApi = (params) => axios.get('/api/manage/manageRole/page', { params })
// 角色管理：新增
export const CreateRoleApi = (params) => axios.post('/api/manage/manageRole/create', params)
// 角色管理：删除
export const DeleteRoleApi = (params) => axios.delete('/api/manage/manageRole/delete', { params })
// 角色管理：修改
export const ModifyRoleApi = (params) => axios.put('/api/manage/manageRole/update', params)
// 角色管理：详情
export const GetRoleDetailApi = (params) => axios.get('/api/manage/manageRole', { params })
// 角色管理：列表
export const GetRoleListApi = (params) => axios.get('/api/manage/manageRole/list', { params })

// 菜单管理：查询
export const GetMenuApi = (params) => axios.get("/api/manage/menu/list", { params })
// 菜单管理：创建
export const CreateMenuApi = (params) => axios.post("/api/manage/menu/create", params)
// 菜单管理：删除
export const DeleteMenuApi = (params) => axios.delete("/api/manage/menu/delete", { params })
// 菜单管理：启用
export const EnableMenuApi = (params) => axios.put("/api/manage/menu/enable", params)
// 菜单管理：修改
export const ModifyMenuApi = (params) => axios.put("/api/manage/menu/modify", params)
// 菜单管理：详情
export const GetMenuDetailApi = (params) => axios.get("/api/manage/menu/get", { params })

// 用户管理：查询
export const GetUserApi = (params) => axios.get("/api/manage/manageUser/page", { params })
// 用户管理：创建
export const CreateUserApi = (params) => axios.post("/api/manage/manageUser/create", params)
// 用户管理：启用
export const EnableUserApi = (params) => axios.put("/api/manage/manageUser/enable", params)
// 用户管理：重置密码
export const ResetPasswordApi = (params) => axios.put("/api/manage/manageUser/password/reset", params)
// 用户管理：详情
export const GetUserDetailApi = (params) => axios.get("/api/manage/manageUser", { params })
// 用户管理：更新
export const ModifyUserApi = (params) => axios.put("/api/manage/manageUser", params)
// 用户管理：导出
export const ExportUserApi = (params) => axios.post("/api/manage/manageUser/excel", params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });



// 组织机构：列表（下拉）
export const GetOrganizationListApi = (params) => axios.get("/api/manage/organization/list", { params })
// 组织机构：分页查询
export const GetOrganizationPageApi = (params) => axios.get("/api/manage/organization/page", { params })
// 组织机构：创建
export const CreateOrganizationApi = (params) => axios.post("/api/manage/organization/create", params)
// 组织机构：列表
export const ModifyOrganizationApi = (params) => axios.put("/api/manage/organization", params)
// 组织机构：详情
export const GetOrganizationDetailApi = (params) => axios.get("/api/manage/organization", { params })
// 组织机构：删除
export const DeleteOrganizationApi = (params) => axios.delete("/api/manage/organization", { params })


// 安全检测
export const MenuHasRoleApi = (params) => axios.get("/api/manage/roleMenu/any/menu", { params })
export const RoleHasUserApi = (params) => axios.get("/api/manage/userRole/any/role", { params })



//获取服务器上传文件路径
export const getFilePathApi = (params) => axios.post('/api/public/file', params, { timeout: 100000 });

//获得文件列表
export const pageApi = (params) => axios.get("/api/manage/publicity-document/page", { params });

//导出
export const deriveApi = (params) => axios.post('/api/manage/publicity-document/excel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });

//新建文件
export const addFileApi = (params) => axios.post("/api/manage/publicity-document", params);

//获取文件详情
export const getFileDetailApi = (params) => axios.get("/api/manage/publicity-document", { params });

//更新文件信息
export const editFileApi = (params) => axios.put("/api/manage/publicity-document", params);

//公告
export const announcesApi = (id) => axios.put(`/api/manage/publicity-document/announces?id=${id}`);

//取消公告
export const cancelAnnouncesApi = (id) => axios.put(`/api/manage/publicity-document/announces/cancel?id=${id}`);

//删除 公告
export const delAnnouncesApi = (params) => axios.delete("/api/manage/publicity-document", { params });

//获得文件路径
export const filePathApi = (params) => axios.get("/api/public/file/path", { params });
//下载文件
export const downloadFileApi = (id) => axios.post(`/api/public/file/download?id=${id}`, {}, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } });

//获取文档名称
export const getFileNameApi = (params) => axios.get("/api/public/file/name", { params });

//获取附件限制
export const getFileSetApi = (params) => axios.get("/api/manage/publicity-document/file-set", { params });

