<!--资料审核  省评市评-待办/已办页面使用-->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import useRequest from '@/hooks/use-request';
import { saveDetailApi, todoPreviewApi } from './api.js';
import { useUserStore } from '@/store/modules/user';
import Audit from './audit.vue';
import { getPath, getFileData, getImgindex } from '@/utils/index.js';
const router = useRoute();
const goPath = useRouter();
const userStore = useUserStore();
const flag = userStore.userInfo.regionLevel; //flag：  1   省评审  2   市评审
//pathUrl参数
//id-> declareInfoId
//taskId ->taskId
//type：true 可编辑 false 仅查看

const fileTypes = ['pdf', 'xlsx', 'xls'];
const fileLog = {
  pdf: new URL(`../../assets/img/pdf.png`, import.meta.url).href,
  xlsx: new URL(`../../assets/img/excel.png`, import.meta.url).href,
  xls: new URL(`../../assets/img/excel.png`, import.meta.url).href
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
    slotName: 'standardDescription',
    label: '评分标准说明',
    align: 'left',
    slotName: 'standardDescription'
  },
  {
    prop: 'declareDescription',
    label: '申报说明（对证明文件的描述）',
    align: 'left'
  },
  {
    prop: 'supportFiles',
    label: '证明文件',
    width: 200,
    slotName: 'supportFiles'
  },
  {
    prop: 'opinion',
    label: flag == 2 ? '市初审意见' : '复审意见',
    slotName: 'opinion'
  }
];
const auditPointInfo = ref({});
const commitPointInfo = ref({});
const state = reactive({
  activeName: 0,
  type: true,
  details: [],
  userInfo: {},
  opinion: ''
});
const { activeName, type, details, userInfo, opinion } = toRefs(state);
const saveBtn = ref(false); //判断是否是点击的  保存 按钮（只有保存按钮要保存成功提示）
//查询审批详情
const { run: getDetailFun } = useRequest(todoPreviewApi, {
  manual: true,
  msgText: [],
  onSuccess: (data, isSuccess) => {
    const obj = {
      projectName: '',
      projectId: '00000000-0000-0000-0000-000000000000'
    };

    const { auditDetail, enterpriseInfo } = data.data;
    console.log(enterpriseInfo);
    auditPointInfo.value = enterpriseInfo.auditPointInfo;
    commitPointInfo.value = enterpriseInfo.commitPointInfo;
    let details = auditDetail.details;
    details.push(obj);
    state.details = details;
    state.userInfo = auditDetail;
  }
});
//汇总审批意见
const collectOpinion = () => {
  let opinions = '';
  let num = 0;
  details.value.forEach((val, index) => {
    val.projectSubs?.forEach((item, i) => {
      if (item.opinion) {
        num = num + 1;
        opinions += num + ':' + val.projectName + '--' + item.subName + ':' + item.opinion + '\n';
      }
    });
  });
  state.opinion = opinions;
};

//保存审批信息意见
const { run: saveFun } = useRequest(saveDetailApi, {
  manual: true,
  msgText: [],
  onSuccess: (data, isSuccess) => {
    collectOpinion();
    if (saveBtn.value) {
      ElMessage({
        message: '保存成功',
        type: 'success'
      });
    }
  }
});

onMounted(() => {
  state.type = router.query.type == 'true';
  let params = { declareInfoId: router.query.id, taskId: router.query.taskId };
  getDetailFun(params);
});
// 返回
const goBack = () => {
  if (router.query.flag) {
    goPath.go(-1);
    return;
  }
  if (flag == 2) {
    if (type.value) {
      goPath.push({ path: '/municipalReview/backlog' });
    } else {
      goPath.push({ path: '/municipalReview/haveDone' });
    }
  } else if (flag == 1) {
    if (type.value) {
      goPath.push({ path: '/provinceReview/backlog' });
    } else {
      goPath.push({ path: '/provinceReview/haveDone' });
    }
  }
};

//点击保存按钮保存
const onSave = () => {
  saveBtn.value = true;
  save();
};

//保存
const save = () => {
  let detailList = [];
  let params = {
    declareInfoId: router.query.id,
    taskId: router.query.taskId,
    selectionProjectId: details.value[activeName.value].projectId,
    detailList
  };
  const data = details.value[activeName.value].projectSubs;
  data?.forEach((item) => {
    let obj = {
      id: item.id,
      opinion: item.opinion
    };
    detailList.push(obj);
  });
  saveFun(params);
};
// tab 切换
const handleClick = (tab, event) => {
  //查看状态下不需要保存
  if (type.value) {
    save();
    saveBtn.value = false;
  }
};

//返回上一项
const lastItem = () => {
  let index = activeName.value;
  if (type.value) {
    save();
    saveBtn.value = false;
  }
  activeName.value = index - 1;
};

//填报下一项
const nextItem = () => {
  let index = activeName.value;
  if (type.value) {
    save();
    saveBtn.value = false;
  }
  activeName.value = index + 1;
};

//初审
const selection = () => {
  if (type.value) {
    save();
    saveBtn.value = false;
  }
  state.activeName = details.value.length - 1;
};
//申报资料 返回上一项
const last = () => {
  activeName.value = activeName.value - 1;
};
//刷新详情
const updata = (params) => {
  getDetailFun(params);
  collectOpinion();
  state.activeName = 0;
};
</script>

<template>
  <div class="main-content">
    <div class="header">
      <section class="header-left">
        <div class="head-title">{{ userInfo.title }}</div>
        <div class="head-detail">
          <p>申报单位：{{ userInfo.unit }}</p>
          <p>申报联系人：{{ userInfo.linkman }} &emsp; {{ userInfo.phone }}</p>
          <p>申报时间：{{ userInfo.time }}</p>
        </div>
        <div class="head-detail" v-if="router.query.selection == 1">
          <p>
            申报时企业一级注册造价师 {{ auditPointInfo?.firstCostNum }} 人，二级注册造价师
            {{ auditPointInfo?.secondCostNum }}
            人，企业信用等级 {{ auditPointInfo?.creditLevel }}
          </p>
          <p>
            当前企业一级注册造价师 {{ commitPointInfo?.firstCostNum }} 人，二级注册造价师
            {{ commitPointInfo?.secondCostNum }} 人，企业实时信用 {{ auditPointInfo?.creditLevel }}
          </p>
        </div>
      </section>
      <el-button class="goBack" type="primary" @click="goBack">返回</el-button>
    </div>

    <div style="margin-top: 14px">
      <div class="main-table-content">
        <el-button class="submit" type="primary" plain @click="selection">
          {{ flag == 2 ? '初审' : '资料复审' }}
        </el-button>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in details"
            :name="index"
            :key="index"
            class="dataAudit"
          >
            <template #label>
              <div class="custom-tabs-label" v-if="item.projectName">
                <div>{{ item.projectName }}</div>
                <div>(满分{{ item.totalSocre }}分)</div>
              </div>
            </template>
            <section v-if="index != details.length - 1">
              <el-table-next :column="column" :data="item.projectSubs" height="520" border>
                <template #standardDescription="{ row }">
                  <p>
                    {{ row.standardDescription }}
                  </p>
                  <p style="color: red" v-show="row.memo">备注：{{ row.memo }}</p>
                </template>
                <template #supportFiles="{ row }">
                  <section class="file">
                    <div class="fileBox" v-for="item in row.supportFiles" :key="item.id">
                      <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="item.name"
                        placement="top"
                      >
                        <!-- <a
                          v-if="item.suffix.toLowerCase() == 'pdf'"
                          :href="getPath(item)"
                          target="_blank"
                        >
                          <img class="img" src="@/assets/img/pdf.png" />
                        </a> -->
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
                          :preview-src-list="getFileData(row.supportFiles)"
                          :initial-index="getImgindex(item, row.supportFiles)"
                          fit="cover"
                          preview-teleported
                        />
                      </el-tooltip>
                    </div>
                  </section>
                </template>
                <template #opinion="{ row }" v-if="type">
                  <el-input
                    v-model.opinion="row.opinion"
                    maxlength="200"
                    show-word-limit
                    type="textarea"
                    clearable
                    placeholder="请输入"
                  />
                </template>
              </el-table-next>
            </section>
            <section v-else>
              <Audit @last="last" :type="type" :opinion="opinion" @updata="updata" />
            </section>
          </el-tab-pane>
        </el-tabs>
        <section class="footer" v-if="activeName != details.length - 1">
          <el-button type="primary" class="btn" @click="lastItem" v-show="activeName != 0">
            上一项
          </el-button>
          <el-button class="btn" @click="onSave" v-if="type">保存</el-button>
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
</template>

<style scoped lang="less">
.main-content {
  overflow: auto;
}
.header {
  width: 100%;
  height: 90px;
  box-sizing: border-box;
  padding: 0 20px 0 35px;
  background-image: url('@/assets/img/kpiHeade.jpg');
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-left {
    width: 100%;
  }
  .head-title {
    font-weight: bold;
    font-size: 18px;
    color: white;
    margin-bottom: 7px;
  }
  .head-detail {
    display: flex;
    width: 100%;

    p {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      margin-right: 70px;
      line-height: 20px;
    }
  }
  .goBack {
    width: 89px;
    height: 36px;
  }
}
.main-table-content {
  position: relative;
  box-sizing: border-box;
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
  .custom-tabs-label {
    margin-bottom: 10px;
    div {
      text-align: center;
      height: 25px;
    }
  }
  .footer {
    width: 100%;
    margin-top: 35px;
    text-align: center;
    .btn {
      width: 120px;
      height: 40px;
      margin: 0 15px;
    }
  }
}
//证明文件
.file {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .fileBox {
    margin-right: 5px;
    padding: 0;
  }
  .img {
    height: 50px;
    width: 50px;
  }
}

.dataAudit {
  :deep(.el-table .cell) {
    white-space: break-spaces;
  }
}
</style>
