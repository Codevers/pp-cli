<!-- 新建文件 -->
<script setup>
import { ref, defineEmits, defineExpose } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import useRequest from '@/hooks/use-request';
import {
  getFilePathApi,
  addFileApi,
  getFileDetailApi,
  editFileApi,
  getFileNameApi,
  filePathApi,
  getFileSetApi
} from '../api.js';
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;
const dialogVisible = ref(false);
const addFormRef = ref(ElForm);
const type = ref('add');
const maxSize = ref(0);
const fileType = ref([]); //允许上传文件格式
const addForm = ref({
  docName: '',
  publicTime: '',
  pubicOffice: '',
  enforceTime: '',
  fileList: [],
  systemAttachmentId: ''
});

const rules = {
  docName: [{ required: true, message: '请输入文件名', trigger: 'blur' }],
  publicTime: [{ required: true, message: '请选择发文日期', trigger: 'change' }],
  pubicOffice: [{ required: true, message: '请输入发文单位', trigger: 'blur' }],
  enforceTime: [{ required: true, message: '请选择实施日期', trigger: 'change' }],
  systemAttachmentId: [{ required: true, message: '请上传附件', trigger: 'change' }]
};
//调用父组件函数刷新列表
const emit = defineEmits(['searchTable']);
function open({ flag, id }) {
  type.value = flag;
  addForm.value = {}; //为什么 addFormRef?.value?.resetFields(); 报错
  addForm.value.systemAttachmentId = '';
  addForm.value.fileList = [];

  getFileSetFun({});

  if (flag == 'add') {
    dialogVisible.value = true;
  } else {
    getFileDetail({ id: id });
  }
}

defineExpose({
  open
});
// 获得弹窗标题
function getTitle() {
  if (type.value == 'add') {
    return '新建文件';
  }
  if (type.value == 'edit') {
    return '编辑文件';
  }
  if (type.value == 'lock') {
    return '查看文件';
  }
}

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

//新建文件 api
const { run: addFile } = useRequest(addFileApi, {
  manual: true,
  msgTxt: ['新建成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      emit('searchTable');
      dialogVisible.value = false;
    }
  }
});

//获取文件详情 api
const { run: getFileDetail } = useRequest(getFileDetailApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      addForm.value = data.data;
      addForm.value.fileList = [];
      getFileNameFun({ id: data.data.systemAttachmentId });
      dialogVisible.value = true;
    }
  }
});

//获取附件限制 api
const { run: getFileSetFun } = useRequest(getFileSetApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      maxSize.value = data.data[0]?.maxSize;
      fileType.value = data.data[0]?.suffix.split(',');
    }
  }
});

//获取文档名称 api
const { run: getFileNameFun } = useRequest(getFileNameApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      let obj = {};
      let fileList = [];
      obj.name = data.data.fileName + '.' + data.data.fileFormat;
      fileList.push(obj);
      addForm.value.fileList = fileList;
    }
  }
});

//更新文件信息 api
const { run: editFile } = useRequest(editFileApi, {
  manual: true,
  msgTxt: ['编辑成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      emit('searchTable');
      dialogVisible.value = false;
    }
  }
});

//const fileType = ['pdf', 'doc', 'docx', 'xlsx', 'xls']; //允许上传文件格式
// 获得返回的file文件id
const { run: getFilePath } = useRequest(getFilePathApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    addForm.value.systemAttachmentId = data.data.id;
    addFormRef.value.validateField('systemAttachmentId');
  },
  onError: (err) => {
    handleRemove();
    ElMessage.error(err?.msg || '上传文件失败');
  }
});
//监听文件上传
function handleChange(uploadFile, uploadFiles) {
  let testFile = uploadFile.name.substring(uploadFile.name.lastIndexOf('.') + 1).toLowerCase();
  if (!fileType.value.includes(testFile)) {
    ElMessage.error('格式不正确，请上传指定格式文件!');
    handleRemove();
    return;
  }
  if (uploadFile.size / 1024 / maxSize.value > 1) {
    ElMessage.error(`文件过大,请上传小于等于${maxSize.value}Kb文件!`);
    handleRemove();
    return;
  }
  let file = uploadFile.raw;
  let folderName = uploadFile.name;
  let formData = new FormData();
  formData.append('file', file);
  formData.append('folderName', folderName);
  getFilePath(formData);
}
//删除文件
function handleRemove() {
  addForm.value.fileList.pop();
  addForm.value.systemAttachmentId = addForm.value.fileList[0] || '';
}
//立即创建
async function creation() {
  await addFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (type.value == 'add') {
        addFile(addForm.value);
      } else {
        editFile(addForm.value);
      }
    }
  });
}
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="getTitle()" width="30%" destroy-on-close center>
    <el-form
      inline
      :model="addForm"
      :rules="rules"
      ref="addFormRef"
      label-width="auto"
      class="auto-flex-form"
    >
      <el-form-item label="文件名" prop="docName">
        <el-input
          v-model="addForm.docName"
          :disabled="type == 'lock'"
          maxlength="100"
          placeholder="请输入文件名"
        />
      </el-form-item>

      <el-form-item label="发文日期" prop="publicTime">
        <el-date-picker
          v-model="addForm.publicTime"
          type="date"
          :disabled="type == 'lock'"
          ref="publicTime"
          @focus="$refs.publicTime.handleOpen()"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择发文日期"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="发文单位" prop="pubicOffice">
        <el-input
          v-model="addForm.pubicOffice"
          :disabled="type == 'lock'"
          maxlength="100"
          placeholder="请输入发文单位"
        />
      </el-form-item>

      <el-form-item label="实施日期" prop="enforceTime">
        <el-date-picker
          v-model="addForm.enforceTime"
          type="date"
          :disabled="type == 'lock'"
          ref="enforceTime"
          @focus="$refs.enforceTime.handleOpen()"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择实施日期"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="相关文件" prop="systemAttachmentId">
        <!--   accept=".pdf, .xlsx, .xls, .doc, .docx" -->
        <el-upload
          ref="upload"
          v-model:file-list="addForm.fileList"
          class="upload-demo"
          :limit="1"
          :auto-upload="false"
          :disabled="addForm.systemAttachmentId.length"
          :on-change="handleChange"
          :on-remove="handleRemove"
        >
          <template #trigger>
            <el-button
              :type="addForm.systemAttachmentId.length ? 'info' : 'primary'"
              :disabled="addForm.systemAttachmentId.length"
            >
              上传附件
            </el-button>
          </template>
          <template #file="{ file }">
            <section class="fileData">
              <el-tooltip
                v-if="file.name?.length > 30"
                effect="dark"
                :content="file.name"
                placement="top"
              >
                <span @click="filePathFun({ id: addForm.systemAttachmentId })">
                  {{ file.name?.slice(0, 20) }}...
                </span>
              </el-tooltip>

              <div
                @click="filePathFun({ id: addForm.systemAttachmentId })"
                v-else
                style="color: #409eff"
              >
                {{ file.name }}
              </div>

              <el-icon v-if="type != 'lock'" @click="handleRemove()">
                <Close />
              </el-icon>
            </section>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ type == 'lock' ? '关闭' : '取消' }}</el-button>
        <el-button type="primary" @click="creation" v-if="type != 'lock'">
          {{ type == 'add' ? '立即创建' : '保存' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.upload-demo {
  width: 100%;
}
.fileData {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
  cursor: pointer;
  div {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
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
