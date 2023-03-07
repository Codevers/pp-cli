import axios from 'axios'
//通知公告 新增
export const create = (params) => axios.post('/api/manage/announcement/create', params);
//通知公告 删除
export const delAnnouncement = (params) => axios.get('/api/manage/announcement/deleteAnnouncement', { params });
//通知公告 详情
export const detailAnnouncement = (params) => axios.post('/api/manage/announcement/getDetail', params);
//查询消息公告列表
export const getAnnouncement = (params) => axios.post('/api/manage/announcement/page', params);
//通知公告 发布
export const issueAnnouncement = (params) => axios.post('/api/manage/announcement/publish', params);
//通知公告 更新
export const editAnnouncement = (params) => axios.post('/api/manage/announcement/update', params);
//通知公告 导出
export const getAnnouncementExcel = (params) => axios.post('/api/manage/announcement/getExcel', params, { responseType: 'blob', headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
//上传文件
export const uploadFile = (params) => axios.post('/api/manage/announcement/uploadFile', params);
//删除文件
export const deleteFileApi = (params) => axios.get("/api/manage/announcement/deleteFile", { params })
//获取服务器上传文件路径
export const getFilePathApi = (params) => axios.post('/api/public/file', params, { timeout: 100000 });

//通用接口 发送人类别：9
export const dictionaryApi = (params) => axios.get("/api/manage/dictionary", { params })

//公告的日志
export const announcementLog = (params) => axios.get("/api/manage/announcement/modify-log", { params })








