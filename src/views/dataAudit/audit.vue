<!--初审-->
<script setup>
import { onMounted, reactive, toRefs, ref, defineEmits, defineProps, watch } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import useRequest from '@/hooks/use-request';
import { useRoute, useRouter } from 'vue-router';
import { saveInfoApi, getInfoApi, auditApi, cityListApi, lockApi, provListApi } from './api.js';
import { getPath, getFileData, getImgindex } from '@/utils/index.js';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const router = useRoute();
const goPath = useRouter();
const flag = userStore.userInfo.regionLevel; //flag：  1   省评审  2   市评审

//pathUrl参数
//id-> declareInfoId
//taskId -> taskId
//flag 判断是否返回上个一页面
//type：true 可编辑 false 仅查看

const data = [
  'CITY_PASSED', //市通过
  'CITY_REJECTED', //市退回
  'PROVINCE_PASSED', //省通过
  'PROVINCE_REJECTED', //省退回企业
  'PROVINCE_REJECTED_NOMINATED' //省退回市推选
];

const fileType = ['pdf', 'doc', 'docx', 'xlsx', 'xls'];
const fileLog = {
  pdf: new URL(`../../assets/img/pdf.png`, import.meta.url).href,
  doc: new URL(`../../assets/img/word.png`, import.meta.url).href,
  docx: new URL(`../../assets/img/word.png`, import.meta.url).href,
  xlsx: new URL(`../../assets/img/excel.png`, import.meta.url).href,
  xls: new URL(`../../assets/img/excel.png`, import.meta.url).href
};
//判断是否是图片
const getfileType = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  return fileType.includes(testFile);
};
//获得图片log
const getFileLog = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  if (fileType.includes(testFile)) {
    return fileLog[testFile];
  }
};

const apiList = [
  {
    flag: 2,
    api: cityListApi
  },
  {
    flag: 1,
    api: provListApi
  }
];

let props = defineProps({
  type: {
    type: Boolean,
    default: true
  },
  updata: {
    type: Function
  },
  opinion: {
    type: String, //审核意见
    default: ''
  }
});
const state = reactive({
  detailFile: [],
  viewOpinion: '',
  opinions: ''
});

const { detailFile, viewOpinion, opinions } = toRefs(state);
const dialogVisible = ref(false);
const activeRow = ref({});
const textarea = ref(null);
//查询审批信息 (Auth)
const { run: getInfoFun } = useRequest(getInfoApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    state.detailFile = data.data.files;
    state.viewOpinion = data.data.opinion;
    state.opinions = '';
  }
});

//保存审批信息意见
const { run: saveFun } = useRequest(saveInfoApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    console.log(data);
  }
});
//处理申报信息
const { run: auditFun } = useRequest(auditApi, {
  manual: true,
  msgTxt: ['评审完成'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = true;
    } else {
      goBack();
    }
  }
});

//获得下一份 id
const { run: listFun } = useRequest(apiList.find((item) => item.flag == flag)?.api, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    let nextRow = data.data.data[0];
    if (nextRow) {
      activeRow.value = nextRow;
      lockFun({ taskId: nextRow.taskId });
    } else {
      ElMessage({
        message: `${flag == 2 ? '初审' : '复审'}已全部完成！`,
        type: 'warning'
      });
      goBack();
    }
  }
});

//解锁待办事项 api
const { run: lockFun } = useRequest(lockApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      const selection = activeRow.value.selectionType == '个人' ? 2 : 1;
      goPath.push({
        path: '/dataAudit/index',
        query: {
          id: activeRow.value.id,
          taskId: activeRow.value.taskId,
          type: true,
          selection
        }
      });
      let params = { declareInfoId: activeRow.value.id, taskId: activeRow.value.taskId };
      getInfoFun(params);
      updata({ declareInfoId: activeRow.value.id, taskId: activeRow.value.taskId });
    } else {
      ElMessage({
        message: data.Msg,
        type: 'warning'
      });
    }
  }
});
const emit = defineEmits(['last', 'updata']);
//返回上一项
const last = () => {
  emit('last');
  if (props.type) {
    saveFun({
      taskId: router.query.taskId,
      declareInfoId: router.query.id,
      opinion: opinions.value
    });
  }
};
//调用父组件 函数刷新页面
const updata = (params) => {
  emit('updata', params);
};
//认定操作
const operation = (state) => {
  const status = ['CITY_REJECTED', 'PROVINCE_REJECTED', 'PROVINCE_REJECTED_NOMINATED'];
  const opinion = props.opinion + opinions.value;
  if (status.includes(state) && opinion.length == 0) {
    ElMessage.error('退回失败！请输入审核意见。');
    return;
  }
  auditFun({
    id: router.query.id,
    taskId: router.query.taskId,
    state: state,
    opinion
  });
};

//返回待办
const goBack = () => {
  //其他页面进来的要传 flag
  if (router.query.flag) {
    goPath.go(-1);
    return;
  }
  if (flag == 2) {
    goPath.push({ path: '/municipalReview/backlog' });
  } else if (flag == 1) {
    goPath.push({ path: '/provinceReview/backlog' });
  }
};
//关闭下一份弹窗
const close = () => {
  dialogVisible.value = false;
  goBack();
};
//下一份
const next = () => {
  listFun({ PageIndex: 1, PageSize: 2 });
  dialogVisible.value = false;
};

//返回已办列表
const goDaveDone = () => {
  if (router.query.flag) {
    goPath.go(-1);
    return;
  }
  if (flag == 2) {
    goPath.push({ path: '/municipalReview/haveDone' });
  } else if (flag == 1) {
    goPath.push({ path: '/provinceReview/haveDone' });
  }
};

//评审意见框获得焦点
const textareaFocus = () => {
  if (props.type) {
    textarea.value.focus();
  }
};

onMounted(() => {
  let params = { declareInfoId: router.query.id, taskId: router.query.taskId };
  getInfoFun(params);
});
</script>

<template>
  <div class="audit">
    <div class="main-header-area">
      <div class="main-title">证明材料</div>
    </div>
    <section class="file">
      <div class="fileBox" v-for="item in detailFile" :key="item.id">
        <a
          v-if="getfileType(item)"
          v-bind="item.suffix.toLowerCase() != 'pdf' ? { download: item.name } : {}"
          :href="getPath(item)"
          target="_blank"
        >
          <img class="img" :src="getFileLog(item)" />
        </a>
        <el-image
          v-else
          style="width: 42px; height: 42px"
          :src="getPath(item)"
          :preview-src-list="getFileData(detailFile)"
          :initial-index="getImgindex(item, detailFile)"
          fit="cover"
          preview-teleported
        />
        <!--   :preview-src-list="[getPath(item)]" -->

        <div class="fileDetail">
          {{ item.fileCategoryName }}
        </div>
      </div>
    </section>
    <div class="main-header-area">
      <div class="main-title">{{ flag == 2 ? '市初审意见' : '复审意见' }}</div>
    </div>
    <section class="textarea" @click="textareaFocus" :style="{ border: props.type ? '' : 'none' }">
      <div v-for="(item, i) in props.opinion.split('\n')" :key="i" class="opinion">
        {{ item }}
      </div>
      <textarea
        v-if="props.type"
        placeholder="请输入"
        maxlength="20000"
        v-model="opinions"
        ref="textarea"
      ></textarea>

      <div v-else>
        <div
          v-for="(item, i) in viewOpinion.split('\n')"
          :key="i"
          style="color: red; white-space: break-spaces"
        >
          {{ item }}
        </div>
      </div>
    </section>
    <section class="footer">
      <el-button type="primary" plain class="btn" @click="last">上一项</el-button>
      <div v-if="flag == 2">
        <el-button
          type="danger"
          class="btn"
          @click="operation('CITY_REJECTED')"
          v-show="props.type"
        >
          初审退回
        </el-button>
        <el-button type="primary" class="btn" @click="operation('CITY_PASSED')" v-show="props.type">
          初审通过
        </el-button>
      </div>

      <div v-if="flag == 1">
        <el-button
          type="danger"
          class="btn"
          @click="operation('PROVINCE_REJECTED_NOMINATED')"
          v-show="props.type"
        >
          退回市推选
        </el-button>
        <el-button
          type="primary"
          class="btn"
          @click="operation('PROVINCE_REJECTED')"
          v-show="props.type"
        >
          {{ router.query.selection == 2 ? '退回个人' : '退回企业' }}
        </el-button>
        <el-button
          type="primary"
          class="btn"
          @click="operation('PROVINCE_PASSED')"
          v-show="props.type"
        >
          复审通过
        </el-button>
      </div>
      <el-button type="primary" class="btn" v-show="!props.type" @click="goDaveDone">
        {{ router.query.flag ? '返回上一页' : '返回已办列表' }}
      </el-button>
    </section>

    <el-dialog
      v-model="dialogVisible"
      :title="flag == 2 ? '初审' : '复审'"
      width="30%"
      :before-close="close"
      center
    >
      <section class="accomplish">
        <img src="@/assets/img/accomplish.png" alt="" />
        <div>本次审核完成，请点击【下一份】继续进行</div>
      </section>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="next" class="nextBtn">下一份</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
.audit {
  .file {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 16px;
    .fileBox {
      margin-right: 80px;
      text-align: center;
      .img {
        height: 42px;
        width: 42px;
      }
      .fileDetail {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #323232;
        line-height: 20px;
      }
    }
  }
  :deep(.el-textarea__inner) {
    height: 200px;
    border: none;
    padding: 0 0;
  }

  .footer {
    width: 100%;
    margin-top: 50px;
    text-align: center;
    display: flex;
    justify-content: center;
    .btn {
      width: 120px;
      height: 40px;
      margin: 0 15px;
    }
  }
}
.accomplish {
  text-align: center;
  font-size: 16px;
  color: #272829;
  line-height: 24px;
  img {
    width: 303px;
    height: 213px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
}
.textarea {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  height: 250px;
  overflow: auto;
  //white-space: pre;
  .opinion:hover {
    cursor: no-drop;
  }
  textarea {
    width: 99%;
    min-height: 150px;
    font-size: 14px;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
      '微软雅黑', Arial, sans-serif;
    color: #333;
  }
}

.textarea:hover {
  border-color: #c0c4cc;
}

.textarea:focus-within {
  border-color: #409eff;
}

.dialog-footer {
  .nextBtn {
    width: 180px;
    height: 40px;
  }
}
</style>
