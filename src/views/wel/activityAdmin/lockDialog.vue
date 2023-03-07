<!--查看活动-->
<script setup>
import { reactive, toRefs, ref, nextTick, watch } from 'vue';
import useRequest from '@/hooks/use-request';
import { detailActivity } from '@/api/wel.js';
import SubmissionDialog from './submissionDialog.vue';
import StandardPreview from '../../selection/standard/component/StandardPreview.vue';
//处理时间  年与日时分
const getTime = (time) => {
  return time?.slice(0, 16);
};

const state = reactive({
  lockData: {} //查看页面数据
});
//父级传过来的当期行
const parntRow = ref({});
const previewRef = ref(null);
const { lockData } = toRefs(state);
const lockDialog = ref(false);
const content = ref('');
const submissionDialog = ref(null);
const activityId = ref(null);
//获得详情-查看编辑时候都用
const { run: getdetailActivity } = useRequest(detailActivity, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    state.lockData = data?.data;
    content.value.contentDocument.body.innerHTML = data?.data.notice;
  }
});

const close = () => {
  lockDialog.value = false;
};

//打开认定标准弹窗
const openPreview = () => {
  previewRef.value.open({
    name: parntRow.value.standardName,
    id: parntRow.value.standardId
  });
};

//各省市上报数量
const setAmount = () => {
  submissionDialog.value.open({ types: 'view', id: activityId.value });
};

//打开弹窗并接受父组件参数
function open(row) {
  parntRow.value = row;
  activityId.value = row.id;
  lockDialog.value = true;
  getdetailActivity({ id: row.id });
}
// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});

//强制更改 iframe 中样式
watch(lockDialog, (newVal, oldVal) => {
  nextTick(() => {
    content.value.contentDocument.body.style.wordBreak = 'break-all';
  });
});
</script>

<template>
  <el-dialog
    v-model="lockDialog"
    :before-close="close"
    destroy-on-close
    title="认定活动查看"
    width="60%"
    center
  >
    <section class="lockContent">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="main-header-area">
            <div class="main-title">活动信息</div>
          </div>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="7">
          <div class="main-header-area">
            <div class="main-title">修改记录</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <section class="contentLeft">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="认定活动主题" :span="2" label-align="right" align="left">
                {{ lockData?.theme }}
              </el-descriptions-item>
              <el-descriptions-item label="认定类型" label-align="right" align="left">
                {{ lockData.sessionName }}
              </el-descriptions-item>
              <el-descriptions-item label="认定活动开始日期" label-align="right" align="left">
                {{ getTime(lockData.startTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="认定活动提交截止日期" label-align="right" align="left">
                {{ getTime(lockData.endTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="退回提交截止日期" label-align="right" align="left">
                {{ getTime(lockData.resubmitTime) }}
              </el-descriptions-item>

              <el-descriptions-item label="市级推选截止日期" label-align="right" align="left">
                {{ getTime(lockData.municipalDeadline) }}
              </el-descriptions-item>
              <el-descriptions-item label="文件分组" label-align="right" align="left">
                {{ lockData.fileCategoryName }}
              </el-descriptions-item>

              <el-descriptions-item label="认定标准" :span="2" label-align="right" align="left">
                <span @click="openPreview()" style="color: #409eff; cursor: pointer">
                  {{ lockData.standardName }}
                </span>
                <el-link type="primary" style="margin-left: 30px" @click="setAmount">
                  各市上报数量
                </el-link>
              </el-descriptions-item>

              <el-descriptions-item label="备注" :span="2" label-align="right" align="left">
                {{ lockData.remark }}
              </el-descriptions-item>
              <el-descriptions-item label-align="right" label-class-name="fwb">
                <template #label>
                  <div style="vertical-align: inherit">认定须知</div>
                </template>
                <!-- <div v-html="lockData.notice" class="notice"></div> -->
                <div class="notice">
                  <iframe
                    src="about:blank"
                    ref="content"
                    frameborder="0"
                    width="100%"
                    height="100%"
                    word-break="break-all"
                    id="notice"
                  ></iframe>
                </div>
              </el-descriptions-item>
            </el-descriptions>
          </section>
        </el-col>
        <el-col :span="1">
          <el-divider direction="vertical" style="height: 100%" border-style="dashed" />
        </el-col>
        <el-col :span="7">
          <section class="contentRight">
            <el-timeline>
              <el-timeline-item
                v-for="(activity, index) in lockData.history"
                :key="index"
                :timestamp="activity.operatorTime"
                color="#007ffd"
              >
                <div style="display: flex">
                  <h1 style="font-weight: bold; margin-right: 10px">
                    {{ activity.operatorName }}
                  </h1>
                </div>
                <div v-for="(item, index) in JSON.parse(activity.content)" :key="index">
                  {{ item }}
                </div>
              </el-timeline-item>
            </el-timeline>
          </section>
        </el-col>
      </el-row>
    </section>
    <SubmissionDialog ref="submissionDialog" />

    <!-- 认定标准 -->
    <StandardPreview ref="previewRef"></StandardPreview>
  </el-dialog>
</template>
<style scoped lang="less">
.lockContent {
  .contentLeft,
  .contentRight {
    height: 45vh;

    overflow: hidden;
    overflow-y: auto;
    :deep(.el-timeline-item__tail) {
      border-left: 1px solid rgba(36, 146, 252, 0.5);
    }
    :deep(.el-timeline-item__tail) {
      left: 5px;
    }
    :deep(.el-timeline-item__node--normal) {
      left: 0;
    }
  }
  .notice {
    width: 100%;
    height: 150px;
    overflow: hidden;
  }

  :deep(.fwb) {
    vertical-align: inherit !important;
  }
}
</style>
