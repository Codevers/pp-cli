<!--提交认定资料-->
<script setup>
import { onMounted, reactive, toRefs, ref, defineEmits, defineProps, computed, watch } from 'vue';
import { CircleCloseFilled } from '@element-plus/icons-vue';
import { ElForm, ElMessage } from 'element-plus';
import useRequest from '@/hooks/use-request';

import { useRoute, useRouter } from 'vue-router';
import {
  saveInfoApi,
  previewReadApi,
  previewEditApi,
  groupApi,
  infoSaveApi
} from '@/api/enterpriseKpi.js';
import { getFilePathApi } from '@/api/announcement.js';
import { mobilePhone } from '@/utils/regExp.js';
import Preview from '@/components/Preview/index.vue';
import PrintDialog from './printDialog.vue';
import { getPath, getFileData, getImgindex } from '@/utils/index.js';
const router = useRoute();
const goPath = useRouter();

const reportPhoneNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入上报人手机号'));
    return;
  }
  if (mobilePhone.test(value)) {
    //合法的邮箱
    return callback();
  } else {
    callback(new Error('请输入正确手机号'));
  }
};
const rules = {
  reportName: [{ required: true, message: '请输入上报人姓名', trigger: 'blur' }],
  reportPhoneNum: [{ required: true, validator: reportPhoneNum, trigger: 'blur' }]
};
const column = [
  {
    type: 'index',
    width: '60px',
    label: '序号'
  },
  {
    prop: 'projectName',
    label: '申报项'
  },
  {
    prop: 'totalScore',
    label: '申报项分值'
  },
  {
    prop: 'selfRatingScore',
    label: '自评分'
  },
  {
    prop: 'option',
    label: '申报详情查看',
    width: 200,
    slotName: 'detail'
  }
];

const fileType = ['pdf', 'doc', 'docx', 'xlsx', 'xls'];
const fileLog = {
  pdf: new URL(`../../../assets/img/pdf.png`, import.meta.url).href,
  doc: new URL(`../../../assets/img/word.png`, import.meta.url).href,
  docx: new URL(`../../../assets/img/word.png`, import.meta.url).href,
  xlsx: new URL(`../../../assets/img/excel.png`, import.meta.url).href,
  xls: new URL(`../../../assets/img/excel.png`, import.meta.url).href
};
//判断是否是图片
const getfileType = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  return fileType.includes(testFile);
};

//判断是否是 pdf 文件
const affirmPdf = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  return testFile == 'pdf';
};

//获得图片log
const getFileLog = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  if (fileType.includes(testFile)) {
    return fileLog[testFile];
  }
};

const printDialog = ref(null);
//打开打印弹窗
const openPrint = () => {
  printDialog.value.open({ id: props.id });
};

//根据申报状态判断调用 可编辑/只读 接口
const getApi = () => {
  let type = router.query.type == 'true';
  if (type) {
    return previewEditApi;
  } else {
    return previewReadApi;
  }
};

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  detailData: {
    type: Array,
    default: []
  },
  detailFile: {
    type: Array,
    default: []
  },
  activityTopic: {
    type: String,
    default: ''
  },
  submitForm: {
    type: Object,
    default: {
      reportName: '',
      reportPhoneNum: ''
    }
  }
});

const state = reactive({
  type: true, //判断是否可编辑
  declareInfoFiles: [],
  totalPoints: 0,
  addFileList: [],
  group: [],
  fileData: [],
  uploadKey: {}
});
const { type, totalPoints, addFileList, declareInfoFiles, group, fileData, uploadKey } =
  toRefs(state);

const submitFormRef = ref(ElForm);
const preview = ref(null);
//计算属性获得 totalPoints
state.totalPoints = computed({
  get() {
    let count = props.detailData.reduce((total, cur) => {
      return total + Number(cur.selfRatingScore);
    }, 0);
    return count;
  }
});

//监听父组件传过来的 detailFile 改变 深拷贝，用于子组件操作数据
watch(
  () => props.detailFile,
  (newName, oldName) => {
    state.fileData = newName;
    let groupData = group.value;
    groupData.forEach((item) => {
      item.fileData = newName.filter((val) => val.fileCategoryKey == item.fileCategoryKey);
    });
    group.value = groupData;
  }
);

//获得允许上传文件的 格式
const getFileType = (suffix) => {
  let data = [];
  let accept = '';
  data = suffix.split(',');
  data.forEach((item) => {
    data.push('.' + item);
  });
  accept = data.toString();
  return accept;
};

//判断上传按钮是否可禁用
const getDisabled = (item) => {
  let type = router.query.type == 'true';
  if (type && item.maxNum == 0) {
    return false;
  }
  if (!type || item.maxNum <= item.fileData.length) {
    return true;
  }
  return false;
};

//获得所有要展示文件 数组
const getFile = (data) => {
  let fileData = [];
  data.forEach((item) => {
    fileData = [...fileData, ...item.fileData];
    //fileData = fileData.concat(item.fileData);
  });

  return fileData;
};

//获得文件分组
const { run: getGroup } = useRequest(groupApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      let groupData = data.data;
      groupData.forEach((item) => {
        item.fileData = [];
      });
      state.group = groupData;
    }
  }
});
//确认提交
const { run: submitFun } = useRequest(saveInfoApi, {
  manual: true,
  msgTxt: ['提交成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      goPath.push({ path: '/mySelection/index' });
    }
  }
});

//记录每次点击 证明文件 按钮数据
const uploadBtn = (item) => {
  state.uploadKey = item;
};

//保存 && 删除 申报文件信息 (Auth)
const { run: infoSaveFun } = useRequest(infoSaveApi, {
  manual: true,
  msgTxt: ['操作成功'],
  onSuccess: (data, isSuccess) => {}
});

// 获得返回的file文件路径
const { run: getFilePath } = useRequest(getFilePathApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      const { fileCategoryId, fileCategoryKey, fileName } = uploadKey.value;
      //获得当前点击文件 分组的下标
      const index = group.value.findIndex(
        (item) => uploadKey.value.fileCategoryKey === item.fileCategoryKey
      );
      //当前点击文件分组下标 文件中的最后一个文件的下标
      const i = group.value[index].fileData.length - 1;
      group.value[index].fileData[i].fileId = data.data.id;
      group.value[index].fileData[i].fileCategoryId = fileCategoryId;
      group.value[index].fileData[i].fileCategoryKey = fileCategoryKey;
      group.value[index].fileData[i].fileCategoryName = fileName;
      state.fileData = getFile(group.value);

      let obj = {
        declareInfoId: props.id,
        addFileList: [
          {
            fileCategoryId: fileCategoryId,
            fileCategoryKey: fileCategoryKey,
            fileIds: [data.data.id]
          }
        ]
      };
      infoSaveFun(obj);
    }
  },
  onError: (err) => {
    //获得当前点击文件 分组的下标
    const index = group.value.findIndex(
      (item) => uploadKey.value.fileCategoryKey === item.fileCategoryKey
    );
    //当前点击文件分组下标 文件中的最后一个文件的下标
    const i = group.value[index].fileData.length - 1;
    const file = group.value[index].fileData[i];
    handleRemove(file);
    ElMessage.error(err?.msg || '上传文件失败');
  }
});

//预览上报详情
const lockDetail = (row) => {
  preview.value.open({ api: getApi(), id: router.query.id, projectName: row.projectName });
};

//监听文件上传
const handleChange = (uploadFile, uploadFiles) => {
  //获得允许上传文件的 格式
  const fileType = uploadKey.value.suffix?.split(',');
  let testFile = uploadFile.name.substring(uploadFile.name.lastIndexOf('.') + 1).toLowerCase();

  if (!fileType.includes(testFile)) {
    handleRemove(uploadFile);
    ElMessage.error(`格式不正确，请上传${uploadKey.value.suffix}格式文件!`);
    return;
  }

  if (uploadFile.size / 1024 / uploadKey.value.maxSize > 1) {
    handleRemove(uploadFile);
    ElMessage.error(`文件过大,请上传小于等于${uploadKey.value.maxSize}KB文件!`);
    return;
  }

  let file = uploadFile.raw;
  let folderName = uploadFile.name;
  let formData = new FormData();
  formData.append('file', file);
  formData.append('folderName', folderName);
  getFilePath(formData);
};
const handleRemove = (uploadFile, uploadFiles) => {
  fileData.value = fileData.value.filter((item) => item.uid != uploadFile.uid);
  let copyUploadKey = { ...uploadKey.value };
  let copyGroup = [...group.value];
  let index = group.value.findIndex(
    (item) => item.fileCategoryKey == uploadKey.value.fileCategoryKey
  );
  copyUploadKey.fileData = uploadKey.value.fileData.filter((item) => item.uid != uploadFile.uid);
  uploadKey.value = copyUploadKey;

  group.value[index] = copyUploadKey;
};
//文件删除
const del = (item) => {
  let data = group.value;
  let index = data.findIndex((val) => val.fileName == item.fileCategoryName);

  if (item.id) {
    data[index].fileData = data[index].fileData.filter((val) => val.id != item.id);
  } else {
    data[index].fileData = data[index].fileData.filter((val) => val.uid != item.uid);
  }
  let obj = {
    declareInfoId: props.id,
    deleteFileIds: [item.id || item.fileId]
  };
  infoSaveFun(obj);
  state.group = data;
  state.fileData = getFile(data);
};
//返回上一项
const emit = defineEmits(['last']);
const last = () => {
  emit('last');
};
//确认提交
const submit = () => {
  for (let item = 0; item < group.value.length; item++) {
    let index = fileData.value.findIndex(
      (val) => val.fileCategoryName == group.value[item].fileName
    );
    if (index == -1 && group.value[item].isMust) {
      ElMessage.error(`请上传${group.value[item].fileName}附件！`);
      return;
    }
  }

  submitFormRef.value.validate((valid) => {
    if (valid) {
      let params = {
        ...props.submitForm,
        declareInfoId: props.id
      };
      submitFun(params);
    }
  });
};

onMounted(() => {
  state.type = router.query.type == 'true';
  getGroup({ category: router.query.category });
});
</script>

<template>
  <div class="box">
    <div class="header">
      <h3>
        {{ activityTopic }}申请信息预览（自评总得分：
        <span style="color: red">{{ totalPoints }}</span>
        分）
      </h3>
      注：自评分仅为申请人自行预测分，非最终得分
    </div>

    <el-table-next :column="column" :data="props.detailData" border>
      <template #detail="{ row }">
        <el-link type="primary" @click="lockDetail(row)">预览上报详情</el-link>
      </template>
    </el-table-next>

    <div class="file">
      <span style="color: red">*</span>
      <el-button type="primary" style="margin-left: 5px" @click="openPrint">打印申报表</el-button>
      <h3>
        <span style="color: red">*</span>
        证明文件上传 (加盖公章的申请书)
      </h3>
      <div style="display: flex; margin-left: 40px">
        <el-upload
          v-for="item in group"
          :key="item.fileCategoryKey"
          :limit="item.maxNum"
          :accept="getFileType(item.suffix)"
          v-model:file-list="item.fileData"
          :disabled="getDisabled(item)"
          :auto-upload="false"
          :on-change="handleChange"
          :on-remove="handleRemove"
          @click="uploadBtn(item)"
          list-type="picture-card"
          class="uploadData"
        >
          <el-button :disabled="getDisabled(item)" :type="getDisabled(item) ? 'info' : 'primary'">
            {{ item.fileName }}
          </el-button>
        </el-upload>
      </div>

      <div class="fileData">
        <div class="fileImg" v-for="(file, i) in fileData" :key="i">
          <!-- <a
            v-if="file.name.split('.')[1].toLowerCase() == 'pdf'"
            :href="getPath(file)"
            target="_blank"
          > -->
          <a
            v-if="getfileType(file)"
            :href="getPath(file)"
            v-bind="!affirmPdf(file) ? { download: file.name } : {}"
            target="_blank"
          >
            <img class="img" :src="getFileLog(file)" />
          </a>
          <el-image
            v-else
            style="width: 80px; height: 80px"
            :src="getPath(file)"
            :preview-src-list="getFileData(fileData)"
            :initial-index="getImgindex(file, fileData)"
            fit="cover"
            preview-teleported
          />
          <p>{{ file.fileCategoryName }}</p>
          <el-icon class="delIcon" @click="del(file)" v-show="type">
            <CircleCloseFilled />
          </el-icon>
        </div>
      </div>
    </div>
    <el-divider style="margin-top: 45px" />
    <div class="footer">
      <el-form
        :inline="true"
        :model="props.submitForm"
        label-width="150px"
        ref="submitFormRef"
        :rules="rules"
      >
        <el-form-item label="上报人姓名" prop="reportName">
          <el-input
            v-model.trim="props.submitForm.reportName"
            :disabled="!type"
            placeholder="请输入"
            maxlength="20"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="上报人手机号码" prop="reportPhoneNum">
          <el-input
            v-model.trim="props.submitForm.reportPhoneNum"
            :disabled="!type"
            placeholder="请输入"
            maxlength="11"
            clearable
            style="width: 200px"
          />
        </el-form-item>
      </el-form>

      <section class="footer">
        <el-button class="btn" @click="last">上一项</el-button>
        <el-button type="primary" class="btn" @click="submit" v-show="type">
          我已确认无误，提交
        </el-button>
      </section>
    </div>
    <!-- 预览上报详情 -->
    <Preview ref="preview"></Preview>

    <PrintDialog ref="printDialog"></PrintDialog>
  </div>
</template>

<style scoped lang="less">
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .header {
    text-align: center;
    font-size: 12px;
    color: red;
    margin-bottom: 10px;
    h3 {
      font-size: 20px;
      font-weight: bold;
      color: black;
      line-height: 30px;
    }
  }
  .file {
    margin-top: 10px;
    h3 {
      font-size: 16px;
      font-weight: bold;
      color: black;
      line-height: 50px;
    }
  }
  .footer {
    width: 100%;
    margin-top: 20px;
    text-align: center;
    .btn {
      width: 150px;
      height: 40px;
      margin: 0 15px;
    }
  }
}

//证明文件
.uploadData {
  margin-right: 25px;
  :deep(.el-upload-list__item),
  :deep(.el-upload--picture-card) {
    //height: 80px;
    // width: 80px;
    --el-upload-picture-card-size: none;
    background-color: #fff;
    border: none;
  }

  :deep(.el-upload-list__item) {
    display: none;
  }
}
.fileData {
  display: flex;
  flex-wrap: wrap;
  margin: 15px 0 0 40px;
  .fileImg {
    width: 80px;
    height: 80px;
    margin: 25px 10px 0 0;
    position: relative;
    text-align: center;
    .img {
      width: 80px;
      height: 80px;
    }
    .delIcon {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>
