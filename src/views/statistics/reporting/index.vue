<script setup>
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import usePageHooks from './hooks';
import useRequest from '@/hooks/use-request';
import { getActivitysByType, getCountByType } from '@/api/common';
import { downloadFileByBlob } from '@/utils/tools';
import { ExportReportExcelApi, GetReportList } from './api';
const route = useRoute();
let { tableColumn } = usePageHooks();
const searchFormRef = ref(null);
const declareType = ref(1);
const searchForm = reactive({
  id: ''
});
// 认定活动数量 - 上报情况统计
const { data: atyCount, run: getAtyCountByType } = useRequest(() => getCountByType({ type: 13 }), {
  deepData: true
});
// 认定活动数量 - 上报情况统计
const { data: reportList, run: getReportList } = useRequest(
  () => GetReportList({ id: searchForm.id }),
  {
    deepData: true,
    onSuccess(data) {
      for (let i of data) {
        for (let ii in i.value) {
          i[ii] = i.value[ii];
        }
      }
    }
  }
);
// 获取活动列表
const {
  loading: tableLoading,
  run: getActivityList,
  data: activityList
} = useRequest(() => getActivitysByType({ category: declareType.value, type: 13 }), {
  deepData: true,
  refreshDeps: [declareType],
  onSuccess: (data) => {
    searchForm.id = data.length ? data[0].id : '';
    getReportList();
    getAtyCountByType({ type: 13 });
  }
});

const { run: ExportReportExcel } = useRequest(ExportReportExcelApi, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});

watch(declareType, (newVal) => {
  resetSearchForm();
});

// 重置查询表单
function resetSearchForm() {
  searchFormRef?.value?.resetFields();
  getActivityList();
}
</script>

<template>
  <el-container class="main-content">
    <div class="header-tabs">
      <div :class="declareType === 1 && 'selected'" @click="declareType = 1">
        企业认定（{{ atyCount?.enterpriseActivityCount }}）
      </div>
      <div :class="declareType === 2 && 'selected'" @click="declareType = 2">
        个人认定（{{ atyCount?.personActivityCount }}）
      </div>
    </div>
    <el-header class="main-form-head" style="margin-bottom: 0">
      <!-- 数据查询 -->
      <el-form
        inline
        :model="searchForm"
        ref="searchFormRef"
        label-width="100px"
        class="auto-flex-form"
        @keyup.enter.native="getReportList"
      >
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="认定活动">
              <el-select v-model="searchForm.id" :clearable="false">
                <el-option :label="item.name" :value="item.id" v-for="item in activityList" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="10">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="getReportList">查询</el-button>
              <el-button @click="resetSearchForm">重置</el-button>
              <el-button type="primary" plain @click="ExportReportExcel(searchForm)">
                导出
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 查询内容 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">{{ route?.meta?.title }}</div>
      </div>
      <el-table-next
        class="main-table"
        :column="tableColumn"
        :data="reportList"
        height="100%"
        border
        v-loading="tableLoading"
      ></el-table-next>
    </el-main>
  </el-container>
</template>
<style lang="less" scoped>
.header-tabs {
  height: 42px;
  min-height: 42px;
  background-color: #eff2fa;
  display: flex;
  > div {
    padding: 0 15px;
    .abs-center;
    cursor: pointer;
    font-size: 15px;
    &.selected {
      border-top: 4px solid #007ffd;
      background-color: #fff;
      color: #007ffd;
    }
  }
}
.noScoreline {
  border-top: 1px solid #ccc;
  height: 1px;
  margin: 0 80px;
}
</style>
