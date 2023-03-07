<!-- 附件管理 -->
<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import useRequest from '@/hooks/use-request';
import {
  uploadFile,
  getFilePathApi,
  detailAnnouncement,
  deleteFileApi
} from '@/api/announcement.js';
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;

const fileType = ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx', 'xlsx', 'xls']; //允许上传文件格式
const fileList = ref([]); //文件列表
const params = ref(null); //上传文件参数
const visible = ref(false); //控制弹窗展示
const parentRow = ref(null); //父级传过来的当前行数据
//打开弹窗并接受父组件参数
function open(row) {
  parentRow.value = row;
  lockFun({ id: row.id });
}

// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});

//调用查看获得文件列表
const { run: lockFun } = useRequest(detailAnnouncement, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    let fileData = data.data.accessory;
    fileData.forEach((item) => {
      item.name = item.fileName;
    });
    fileList.value = fileData;
    visible.value = true;
  }
});

const { run: uploadFun } = useRequest(uploadFile, {
  manual: true,
  msgTxt: ['上传成功'],
  onSuccess: (data, isSuccess) => {
    lockFun({ id: parentRow.value.id });
  }
});
// 获得返回的file文件路径
const { run: getFilePath } = useRequest(getFilePathApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    params.value.filePath = data.data.path;
    uploadFun(params.value);
  },
  onError: (err) => {
    let lastIndex = fileList.value.length - 1;
    handleRemove(fileList.value[lastIndex]);
    ElMessage.error(err?.msg || '上传文件失败');
  }
});

//监听文件上传
const handleChange = (uploadFile, uploadFiles) => {
  let testFile = uploadFile.name.substring(uploadFile.name.lastIndexOf('.') + 1).toLowerCase();
  if (!fileType.includes(testFile)) {
    ElMessage.error('格式不正确，请上传指定格式文件!');
    handleRemove(uploadFile);
    return;
  }

  if (uploadFile.size / 1024 / 1024 > 10) {
    ElMessage.error('文件过大,请上传小于等于10Mb文件!');
    handleRemove(uploadFile);
    return;
  }

  let data = {
    messageId: parentRow.value.id,
    filePath: '',
    fileName: uploadFile.name,
    fileType: uploadFile.raw.type,
    fileSize: uploadFile.size
  };
  params.value = data;
  let file = uploadFile.raw;
  let folderName = uploadFile.name;
  let formData = new FormData();
  formData.append('file', file);
  formData.append('folderName', folderName);
  getFilePath(formData);
};

//删除文件
const { run: deleteFileFun } = useRequest(deleteFileApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {}
});
const handleRemove = (uploadFile, uploadFiles) => {
  if (uploadFile.id) {
    deleteFileFun({ id: uploadFile.id });
    fileList.value = fileList.value.filter((item) => item.id != uploadFile.id);
  } else {
    fileList.value = fileList.value.filter((item) => item.uid != uploadFile.uid);
  }
};
// 当已发布状态时候阻止删除文件
const beforeRemove = (uploadFile, uploadFiles) => {
  if (parentRow.value.status == 1) {
    return false;
  }
};

function getPath(item, path = 'path') {
  const paths = item[path].split('/');
  paths[paths.length - 1] = encodeURIComponent(paths[paths.length - 1]);
  return baseUrl + paths.join('/');
}

const download = (file) => {
  const link = document.createElement('a');
  link.download = file.fileName;
  link.href = getPath(file);
  link.target = '_block';
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};
</script>

<template>
  <el-dialog v-model="visible" destroy-on-close title="附件管理" center width="50%">
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      accept=".jpg, .png, .jpeg, .pdf, .xlsx, .xls, .doc, .docx"
      :auto-upload="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :disabled="parentRow.status == 1"
    >
      <el-button type="primary" style="width: 100px" size="large" :disabled="parentRow.status == 1">
        附件上传
      </el-button>
      <template #tip>
        <div class="el-upload__tip">
          只能上传jpg、png、jpeg、pdf、doc、docx、xlsx、xls格式文件，大小不超过10Mb
        </div>
      </template>
      <template #file="{ file }">
        <section class="fileData">
          <!-- <el-tooltip
            v-if="file.fileName?.length > 50"
            effect="dark"
            :content="file.fileName"
            placement="top"
          >
            <span @click="download(file)">{{ file.fileName?.slice(0, 50) }}...</span>
          </el-tooltip> -->

          <span @click="download(file)" style="color: #409eff; font-size: 18px; cursor: pointer">
            {{ file.fileName }}
          </span>

          <el-icon @click="handleRemove(file)" v-show="parentRow.status != 1"><Close /></el-icon>
        </section>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" type="primary" style="width: 100px">关闭</el-button>
      </span>
    </template>

    <div v-show="!fileList.length" class="noContent">
      <img src="@/assets/img/nodata.png" alt="" class="noContent" />
    </div>
  </el-dialog>
</template>

<style scoped lang="less">
.el-upload__tip {
  font-size: 14px;
  margin: 10px 0;
}
.noContent {
  margin: 0 auto;
  width: 200px;
  height: 150px;
}
//上传文件css
:deep(.el-upload-list__item-name) {
  font-size: 18px;
}
:deep(.el-upload__tip) {
  margin: 10px 0 20px 0;
}

:deep(.el-icon) {
  font-size: 20px;
  cursor: pointer;
}
.fileData {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  div {
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    cursor: pointer;
  }
  :deep(.el-tooltip__trigger) {
    color: #409eff;
    font-size: 18px;
    cursor: pointer;
  }
}
.fileData:hover {
  color: #409eff;
}
</style>
