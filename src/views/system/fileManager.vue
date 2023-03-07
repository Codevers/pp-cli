<!-- 文件管理 -->
<script setup>
import { reactive, ref } from 'vue';
import usePageHooks from './hooks/fileManager';
import useRequest from '@/hooks/use-request';
import usePagination from '@/hooks/use-pagination';
import AddFile from './components/addFile.vue';
import {
  pageApi,
  announcesApi,
  cancelAnnouncesApi,
  delAnnouncesApi,
  deriveApi,
  downloadFileApi,
  filePathApi
} from './api.js';
import { downloadFileByBlob } from '@/utils/tools';
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const { tableColumn } = usePageHooks();
const searchFormRef = ref(null);
const searchForm = reactive({
  docName: '',
  publicTime: [],
  pubicOffice: '',
  status: null
});
//分页-列表
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, pageApi);

//导出 api
const { run: exportFun } = useRequest(deriveApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});

//公告 api
const { run: announcesFun } = useRequest(announcesApi, {
  manual: true,
  msgTxt: ['发布成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      searchTable();
    }
  }
});

//取消公告 api
const { run: cancelAnnouncesFun } = useRequest(cancelAnnouncesApi, {
  manual: true,
  msgTxt: ['取消成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      searchTable();
    }
  }
});

//删除 api
const { run: delAnnouncesFun } = useRequest(delAnnouncesApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      searchTable();
    }
  }
});

//防止路径有特殊符号发生转译
function getPath(path) {
  const paths = path.split('/');
  paths[paths.length - 1] = encodeURIComponent(paths[paths.length - 1]);
  return baseUrl + paths.join('/');
}
//下载
const download = (path) => {
  const link = document.createElement('a');
  //link.download = file.fileName;
  link.href = getPath(path);
  link.target = '_block';
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};
//获得文件路径 api
const { run: filePathFun } = useRequest(filePathApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      download(data.data);
    }
  }
});

//下载文件 api
const { run: downloadFun } = useRequest(downloadFileApi, {
  manual: true,
  msgTxt: ['下载成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      downloadFileByBlob(data);
    }
  }
});

function downloadFile(params) {
  // downloadFun(params.id);
  filePathFun(params);
}

//重置
function rest() {
  searchFormRef.value.resetFields();
  searchTable();
}
//新建文件 ref
const addFileRef = ref(null);
//新建文件
function addFile() {
  addFileRef.value.open({ flag: 'add' });
}

//查看文件
function lockFile(id) {
  addFileRef.value.open({ flag: 'lock', id });
}
//编辑文件
function edit(id) {
  addFileRef.value.open({ flag: 'edit', id });
}
</script>
<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <!-- 数据查询 -->
      <el-form inline :model="searchForm" ref="searchFormRef" class="auto-flex-form">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="文件名" prop="docName">
              <el-input v-model="searchForm.docName" maxlength="100" placeholder="请输入文件名" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发文日期" prop="publicTime">
              <el-date-picker v-model="searchForm.publicTime" type="daterange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期" :default-time="defaultTime" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发文单位" prop="pubicOffice">
              <el-input v-model="searchForm.pubicOffice" maxlength="100" placeholder="请输入发文单位" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="已公告" :value="2" />
                <el-option label="新建" :value="1" />
                <el-option label="取消公告" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="searchTable">查询</el-button>
              <el-button @click="rest">重置</el-button>
              <el-button type="primary" @click="exportFun(searchForm)">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>

    <!-- 查询内容 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">文件管理</div>
        <el-button type="primary" @click="addFile">新建文件</el-button>
      </div>
      <el-table-next class="main-table" :column="tableColumn" :data="dataSource" border v-loading="tableLoading">
        <template #docName="{ row }">
          <span style="color: #409eff; cursor: pointer" @click="downloadFile({ id: row.systemAttachmentId })">
            {{ row.docName }}
          </span>
        </template>
        <template #option="{ row }">
          <el-button type="primary" size="small" link @click="lockFile(row.id)">查看</el-button>
          <el-button size="small" link :type="row.statusInt != 2 ? 'primary' : 'info'" :disabled="row.statusInt == 2"
            @click="edit(row.id)">
            编辑
          </el-button>
          <el-popconfirm title="您正在发布文件公告，请确认是否公告?" width="" @confirm="announcesFun(row.id)">
            <template #reference>
              <el-button link :type="row.statusInt != 2 ? 'primary' : 'info'" :disabled="row.statusInt == 2" size="small">
                公告
              </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm title="您正在取消文件公告，请确认是否取消?" width="" @confirm="cancelAnnouncesFun(row.id)">
            <template #reference>
              <el-button link :type="row.statusInt == 2 ? 'primary' : 'info'" :disabled="row.statusInt !== 2"
                size="small">
                取消公告
              </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm title="您正在删除文件公告，请确认是否删除?" width="" @confirm="delAnnouncesFun({ id: row.id })">
            <template #reference>
              <el-button link :type="row.statusInt == 1 ? 'danger' : 'info'"
                :disabled="row.statusInt == 2 || row.statusInt == 3" size="small">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination :total="total" :page="page" @pageChange="handlePageChange" />
    </el-main>
    <!-- 新建文件/编辑/查看 -->
    <AddFile @searchTable="searchTable" ref="addFileRef"></AddFile>
  </el-container>
</template>
<style scoped lang="less"></style>
