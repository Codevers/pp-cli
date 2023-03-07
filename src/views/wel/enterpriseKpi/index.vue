<!--我的填报-->
<script setup>
import { onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, CircleCloseFilled } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import useRequest from '@/hooks/use-request';
import {
  detailEditApi,
  detailReadApi,
  saveApi,
  getInfoApi,
  declareInfoApi,
  activityApi
} from '@/api/enterpriseKpi.js';
import { getFilePathApi } from '@/api/announcement.js';
import submitData from './submitData.vue';
import { getPath, getFileData, getImgindex } from '@/utils/index.js';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const { typeKey } = userStore.userInfo;

const router = useRoute();
const goPath = useRouter();
// 返回
const goBack = () => {
  goPath.go(-1);
};
const data = [
  'CITY_PASSED', //市通过
  'CITY_REJECTED', //市退回
  'PROVINCE_PASSED', //省通过
  'PROVINCE_REJECTED', //省退回企业
  'PROVINCE_REJECTED_NOMINATED' //省退回市推选
];

function getDisabled(row) {
  const { allowDeclare, opinion } = row;
  const status = ['CITY_REJECTED', 'PROVINCE_REJECTED'].includes(declareStatus.value);
  // allowDeclare == 整行内容是否可编辑 对应 认定规则配置  内容是否可填字段
  // returnAddFile == true 为 在市推选界面 退回申请
  if (returnAddFile.value && allowDeclare) {
    return true;
  }

  //必须 type 为 true   &&  市退回或省退回企业状态 && 当前行存在意见
  if (type.value && status && allowDeclare && opinion) {
    return true;
  }
  if (type.value && !status && allowDeclare) {
    return true;
  }
  return false;
}
const column = [
  {
    type: 'index',
    width: '60px',
    label: '序号'
  },
  {
    prop: 'subName',
    label: '评分项目',
    width: 100
  },
  {
    prop: 'score',
    label: '单项分值',
    width: 100,
    formatter: (row) => {
      let minScore = row.minScore != null ? row.minScore : ' ';
      return minScore + '~' + row.maxScore + '分';
    }
  },
  {
    prop: 'standardDescription',
    label: '评分标准说明',
    align: 'left',
    slotName: 'standardDescription'
  },
  {
    prop: 'selfRatingScore',
    label: '自评分',
    slotName: 'selfRatingScore',
    width: 130
  },
  {
    prop: 'declareDescription',
    label: '备注说明（对证明文件的描述）',
    align: 'left',
    showOverflowTooltip: true,
    slotName: 'declareDescription'
  },
  {
    prop: 'isPublicStr',
    label: '是否公示',
    width: 100,
    slotName: 'isPublicStr'
  },
  {
    prop: 'supportFiles',
    label: '证明文件(仅能上传三个pdf或图片)',
    width: 240,
    slotName: 'supportFiles'
  }
];

const state = reactive({
  type: true, //判断是否可编辑
  details: [],
  copyDetails: [],
  declareInfoId: '',
  activeName: 0,
  editRow: {},
  detailData: [],
  detailFile: [],
  detailId: '',
  activityTopic: '',
  submitForm: {},
  deleteFileIds: [] //删除文件id
});
// returnAddFile== true 为 在市推选界面 退回申请
const returnAddFile = ref(false);
const {
  type,
  details,
  declareInfoId,
  activeName,
  editRow,
  copyDetails,
  detailData,
  detailFile,
  detailId,
  activityTopic,
  submitForm,
  deleteFileIds
} = toRefs(state);
const declareStatus = ref(null); //活动状态
const saveBtn = ref(false); //判断是否是点击的  保存 按钮（只有保存按钮要保存成功提示）

const dialogVisible = ref(false); //评选须知
const content = ref('');
const fullscreenLoading = ref(false); //上传文件 Loading
// 查询申报信息
const { run: getInfoFun } = useRequest(router.query.type == 'true' ? getInfoApi : declareInfoApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      state.detailData = data.data.details;
      state.detailId = data.data.id;
      state.detailFile = data.data.files;
      let submitForm = { reportName: data.data.linkman, reportPhoneNum: data.data.phone };
      state.submitForm = submitForm;
    } else {
      ElMessage.error(data.msg);
    }
  }
});
//查询申报明细  根据传入的 type判断调用编辑还是只读接口
const { run: detailFun } = useRequest(router.query.type == 'true' ? detailEditApi : detailReadApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      let details = data.data.details;
      returnAddFile.value = data.data.returnAddFile;
      //手动添加一个 提交认定资料页签  但是 projectName =='' 页面不显示tab页签名字
      let obj = {
        projectName: '',
        projectId: '00000000-0000-0000-0000-000000000000'
      };
      details.push(obj);
      state.details = details;
      state.copyDetails = JSON.parse(JSON.stringify(details));
      state.declareInfoId = data.data.id;
      state.activityTopic = data.data.title;
      declareStatus.value = data.data.declareStatus;
    } else {
      ElMessage.error(data.msg);
    }
  }
});
//保存申报明细
const { run: saveFun } = useRequest(saveApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      detailFun({ activityId: router.query.id });
      //每次保存 调用刷新数据
      getInfoFun({ activityId: router.query.id });
      //将缓存的 要删除的文件id 清空
      state.deleteFileIds = [];
      if (saveBtn.value) {
        ElMessage({
          message: '保存成功',
          type: 'success'
        });
      }
    }
  }
});

// 获得返回的file文件路径
const { run: getFilePath } = useRequest(getFilePathApi, {
  manual: true,
  msgText: [],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      //获得 文件数组 最后一个文件的下标 将路径赋值给 fileId
      let index = editRow.value.supportFiles.length - 1;
      editRow.value.supportFiles[index].fileId = data.data.id;
      //关闭 Loading
      fullscreenLoading.value = false;
    }
  },
  onError: (err) => {
    let lastIndex = editRow.value.supportFiles.length - 1;
    handleRemove(editRow.value.supportFiles[lastIndex]);
    ElMessage.error(err?.msg || '上传文件失败');
    //关闭 Loading
    fullscreenLoading.value = false;
  }
});

//查询申报明细 (Auth)
const { run: activityFun } = useRequest(activityApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    dialogVisible.value = true;
    if (isSuccess) {
      // state.activityTopic = data.data.activityTopic;
      nextTick(() => {
        content.value.contentDocument.body.innerHTML = data.data.selectionNotice;
      });
    }
  }
});

onMounted(() => {
  state.type = router.query.type == 'true';
  detailFun({ activityId: router.query.id });
});
//记录上传文件的当前行数据
const uploadFile = (row) => {
  state.editRow = row;
};
//删除
const del = (row, file) => {
  ElMessageBox.confirm('确定要删除当前文件?', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    //判断是否是删除 最新上传的 raw 存在，否则为列表中存在的
    if (file.raw) {
      handleRemove(file);
    } else {
      let data = deleteFileIds.value;
      data.push(file.id);
      state.deleteFileIds = data;
      row.supportFiles = row.supportFiles.filter((item) => item.id != file.id);
    }
  });
};

const fileTypes = ['pdf', 'xlsx', 'xls'];
const fileLog = {
  pdf: new URL(`../../../assets/img/pdf.png`, import.meta.url).href,
  xlsx: new URL(`../../../assets/img/excel.png`, import.meta.url).href,
  xls: new URL(`../../../assets/img/excel.png`, import.meta.url).href
};
//判断是否是图片
const getfileType = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  return fileTypes.includes(testFile);
};
//获得图片log
const getFileLog = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  if (fileTypes.includes(testFile)) {
    return fileLog[testFile];
  }
};

//判断是否是 pdf 文件
const affirmPdf = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  return testFile == 'pdf';
};

//文件上传
const fileType = ['jpg', 'png', 'pdf', 'jpeg', 'xlsx', 'xls'];
const handleChange = (uploadFile, uploadFiles, row) => {
  let testFile = uploadFile.name.substring(uploadFile.name.lastIndexOf('.') + 1).toLowerCase();
  if (!fileType.includes(testFile)) {
    ElMessage.error('格式不正确，请上传指定格式文件!');
    handleRemove(uploadFile);
    return;
  }

  if (uploadFile.size / 1024 / 1024 > 100) {
    ElMessage.error('上传失败，文件不得超过100Mb');
    handleRemove(uploadFile);
    return;
  }

  let file = uploadFile.raw;
  let folderName = uploadFile.name;
  let formData = new FormData();
  formData.append('file', file);
  formData.append('folderName', folderName);
  // 触发文件上传 Loading
  fullscreenLoading.value = true;
  getFilePath(formData);
};
//排除不符合文件格式的重新赋值
const handleRemove = (uploadFile) => {
  editRow.value.supportFiles = editRow.value.supportFiles.filter(
    (item) => item.uid != uploadFile.uid
  );
};

//获得新增文件id
const getAddFileList = (data) => {
  let fileData = [];
  data?.forEach((item) => {
    item.supportFiles?.forEach((val) => {
      if (val.fileId) {
        let fileObj = {
          templateId: item.templateId,
          fileId: val.fileId
        };
        fileData.push(fileObj);
      }
    });
  });
  return fileData;
};

watch(
  () => activeName.value,
  (newName, oldName) => {
    //查看状态下不需要保存
    if (type.value) {
      saveBtn.value = false;
      save(oldName);
    }
  }
);
//点击保存按钮保存
const onSave = (index) => {
  saveBtn.value = true;
  save(index);
};

//保存
const save = (index) => {
  const newId = '00000000-0000-0000-0000-000000000000';
  let data = details.value[index].projectSubs;
  let copyData = copyDetails.value[index].projectSubs;
  let addDetailList = [];
  let updateDetailList = [];
  data?.forEach((item, i) => {
    //判断是否是新增
    if (item.id == newId) {
      let { templateId, selfRatingScore, declareDescription } = item;
      let newObj = { templateId, selfRatingScore, declareDescription };
      if (selfRatingScore || declareDescription || selfRatingScore === 0) {
        addDetailList.push(newObj);
      }
    } else {
      //判断输入框中的参数是否改变
      if (
        item.selfRatingScore != copyData[i].selfRatingScore ||
        item.declareDescription != copyData[i].declareDescription
      ) {
        let { id, templateId, selfRatingScore, declareDescription } = item;
        let editObj = { id, templateId, selfRatingScore, declareDescription };
        updateDetailList.push(editObj);
      }
    }
  });
  let params = {
    declareInfoId: declareInfoId.value,
    selectionProjectId: details.value[index].projectId,
    addDetailList,
    updateDetailList,
    addFileList: getAddFileList(data),
    deleteFileIds: deleteFileIds.value
  };
  saveFun(params);
};
//提交评审资料 返回上一项
const last = () => {
  activeName.value = activeName.value - 1;
};

//返回上一项
const lastItem = () => {
  let index = activeName.value;
  activeName.value = index - 1;
};
//填报下一项
const nextItem = () => {
  let index = activeName.value;
  activeName.value = index + 1;
};
//提交认定资料
const selection = () => {
  state.activeName = details.value.length - 1;
  //查看状态下不需要保存
  if (!type.value) {
    getInfoFun({ activityId: router.query.id });
  }
};

const pdfUrl =
  typeKey === 0
    ? '/operationManual/安徽省工程造价咨询行业优秀企业申报系统操作手册.pdf'
    : typeKey === 1
    ? '/operationManual/安徽省工程造价咨询行业优秀个人申报系统操作手册.pdf'
    : '';
</script>

<template>
  <div class="main-content" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="header">
      <div class="header-btn">
        <div class="head-title">{{ activityTopic }}</div>
        <!-- <el-button type="warning" round>认定通知</el-button> -->
        <a target="_blank" :href="pdfUrl">
          <el-button type="warning" round style="margin-left: 20px">认定申请操作手册</el-button>
        </a>
        <el-button
          type="warning"
          @click="activityFun({ activityId: router.query.id })"
          round
          style="margin-left: 20px"
        >
          申报须知
        </el-button>
      </div>
      <el-button class="goBack" type="primary" @click="goBack">返回</el-button>
    </div>

    <div style="margin-top: 14px">
      <div class="main-table-content">
        <el-button
          class="submit"
          type="primary"
          :plain="activeName !== details.length - 1"
          @click="selection"
        >
          提交认定资料
        </el-button>
        <el-tabs v-model="activeName" class="demo-tabs">
          <el-tab-pane v-for="(item, index) in details" :name="index" :key="item.projectId">
            <template #label>
              <div class="custom-tabs-label" v-if="item.projectName">
                <div>{{ item.projectName }}</div>
                <div>(满分{{ item.totalSocre }}分)</div>
              </div>
            </template>
            <template v-if="index != details.length - 1">
              <el-table-next
                :column="column"
                :data="item.projectSubs"
                height="520"
                border
                class="enterpriseKpi"
              >
                <template #standardDescription="{ row }">
                  <p>
                    {{ row.standardDescription }}
                  </p>
                  <p style="color: red" v-show="row.memo">备注：{{ row.memo }}</p>
                </template>
                <template #selfRatingScore="{ row }">
                  <el-input-number
                    v-if="getDisabled(row)"
                    v-model="row.selfRatingScore"
                    size="small"
                    :max="row.maxScore"
                    :min="row.minScore ?? -Infinity"
                    :precision="2"
                    :step="0.1"
                    placeholder="请输入"
                    :controls="false"
                    class="selfRatingScore"
                  />
                  <span v-else>{{ row.selfRatingScore }}</span>
                </template>
                <template #declareDescription="{ row }">
                  <div v-if="getDisabled(row)">
                    <el-input
                      v-model.warp="row.declareDescription"
                      maxlength="200"
                      show-word-limit
                      type="textarea"
                      clearable
                      placeholder="请输入"
                    />
                    <div style="color: red" v-show="row.opinion">审核意见:{{ row.opinion }}</div>
                  </div>
                  <span v-else>{{ row.declareDescription }}</span>
                </template>
                <template #supportFiles="{ row }">
                  <el-upload
                    v-model:file-list="row.supportFiles"
                    :limit="3"
                    :auto-upload="false"
                    :on-change="handleChange"
                    accept=".jpg,.png,.pdf,.jpeg,.xlsx,.xls"
                    :on-remove="handleRemove"
                    :disabled="!getDisabled(row)"
                    list-type="picture-card"
                    @click="uploadFile(row)"
                    class="enterpriseKpi"
                    :class="{ hide: row.supportFiles.length >= 3 }"
                  >
                    <template #file="{ file }">
                      <div class="fileImg">
                        <el-tooltip
                          class="box-item"
                          effect="dark"
                          :content="file.name"
                          placement="top"
                        >
                          <a
                            v-if="getfileType(file)"
                            v-bind="!affirmPdf(file) ? { download: file.name } : {}"
                            :href="getPath(file)"
                            target="_blank"
                          >
                            <img class="img" :src="getFileLog(file)" />
                          </a>
                          <el-image
                            v-else
                            style="width: 50px; height: 50px"
                            :src="getPath(file)"
                            :preview-src-list="getFileData(row.supportFiles)"
                            fit="cover"
                            preview-teleported
                            :initial-index="getImgindex(file, row.supportFiles)"
                          />
                        </el-tooltip>
                        <el-icon class="delIcon" @click="del(row, file)" v-show="getDisabled(row)">
                          <CircleCloseFilled />
                        </el-icon>
                      </div>
                    </template>
                    <el-icon v-if="row.supportFiles.length < 3">
                      <Plus />
                    </el-icon>
                  </el-upload>
                </template>
                <template #isPublicStr="{ row }">
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="选择公示的，外网页面将显示本评分子项的上传的相关证明文件"
                    placement="left"
                  >
                    <span>{{ row.isPublicStr }}</span>
                  </el-tooltip>
                </template>
                <el-table-column align="right">
                  <template #header>
                    <el-button type="primary">提交认定资料</el-button>
                  </template>
                </el-table-column>
              </el-table-next>
            </template>
            <template v-else>
              <submitData
                @last="last"
                :detailData="detailData"
                :detailFile="detailFile"
                :id="detailId"
                :submitForm="submitForm"
                :activityTopic="activityTopic"
              />
            </template>
          </el-tab-pane>
        </el-tabs>
        <section class="footer" v-show="activeName != details.length - 1">
          <el-button type="primary" class="btn" @click="lastItem" v-show="activeName != 0">
            上一项
          </el-button>
          <el-button class="btn" @click="onSave(activeName)" v-show="type">保存</el-button>
          <el-button
            type="primary"
            class="btn"
            @click="nextItem"
            v-show="activeName != details.length - 2"
          >
            下一项
          </el-button>
          <el-button
            type="primary"
            class="btn"
            @click="selection"
            v-show="activeName == details.length - 2"
          >
            下一项
          </el-button>
        </section>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" center title="申报须知" width="60%">
    <div class="box-card">
      <h3 class="title">“{{ activityTopic }}”认定须知</h3>
      <iframe src="about:blank" ref="content" frameborder="0" width="100%" height="460"></iframe>
    </div>
  </el-dialog>
</template>

<style scoped lang="less">
.main-content {
  overflow: auto;
}

.header {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding: 0 20px;
  background-image: url('@/assets/img/kpiHeade.jpg');
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-btn {
    display: flex;
  }

  .head-title {
    font-weight: bold;
    font-size: 18px;
    margin-left: 35px;
    margin-right: 50px;
    color: white;
    line-height: 32px;
  }

  .goBack {
    width: 89px;
    height: 36px;
  }
}

.main-table-content {
  position: relative;

  .submit {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 122px;
    height: 42px;
    z-index: 1000;
  }

  :deep(.el-tabs__nav) {
    padding-bottom: 10px;
    width: 80%;
    overflow-y: hidden;
  }

  :deep(.el-tabs__item) {
    padding: 0 10px 0 10px;
    font-weight: 300;
    color: #606266;
  }

  :deep(.el-tabs__item.is-active) {
    font-weight: 500;
  }

  .selfRatingScore {
    width: 100px;

    :deep(.el-input__wrapper) {
      padding: 14px 7px;
    }
  }

  .custom-tabs-label {
    margin-bottom: 10px;

    div {
      text-align: center;
      height: 25px;
    }
  }

  .footer {
    width: 100%;
    margin-top: 50px;
    text-align: center;

    .btn {
      width: 120px;
      height: 40px;
      margin: 0 15px;
    }
  }
}

//证明文件
.enterpriseKpi {
  :deep(.el-upload-list__item) {
    height: 50px;
    width: 50px;
    margin: 0 5px 0 0;
    transition: none !important; //去除动画效果
  }

  :deep(.el-upload--picture-card) {
    width: 50px;
    height: 50px;
  }

  .fileImg {
    position: relative;

    .img {
      width: 50px;
      height: 50px;
    }

    .delIcon {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
}

.enterpriseKpi {
  :deep(.el-table .cell) {
    white-space: break-spaces;
  }
}

.hide {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}

.box-card {
  box-sizing: border-box;
  height: 60vh;
  overflow-y: auto;
  // margin-top: 14px;
  .title {
    height: 36px;
    text-align: center;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 700;
    color: #323232;
    line-height: 26px;
  }
}
</style>
