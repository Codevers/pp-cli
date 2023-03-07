<script setup>
import { reactive, ref, computed, watch, nextTick } from 'vue';
import ExpertSetting from './component/ExpertSetting.vue';
import SelectExpert from './component/SelectExpert.vue';
import { useRoute, useRouter } from 'vue-router';
import usePageHooks from './hooks';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { STATUS_4 } from '@/config/dic-options';
import { GetActivityList, GetActivityListNew } from '@/api/common';
import { activityCount, getActivityCount } from '@/hooks/use-global-data';
import { downloadFileByBlob } from '@/utils/tools';
import { ElMessage } from 'element-plus';

import {
  GetEnterprisePageApi,
  GetPersonalPageApi,
  ExportEnterpriseExcelApi,
  ExportPersonalExcelApi
} from './api';
const route = useRoute();
const router = useRouter();
const { tableColumn } = usePageHooks();
const tableColumns = ref(tableColumn);
const previewRef = ref(null);
const selectExpert = ref(null);
const searchFormRef = ref(null);
const declareType = ref(1);
const multipleSelection = ref([]);

const searchForm = reactive({
  activityId: '',
  selectionObj: '',
  isDistribution: false,
  enterpriseName: '',
  date: [],
  expert: ''
});
const otherColumn = {
  prop: 'enterpriseName',
  label: '认定对象从业单位',
  width: 300,
  align: 'left'
};
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, GetEnterprisePageApi, {
  manual: true
});

const { run: getActivityList, data: activityList } = useRequest(
  () => GetActivityListNew({ activityCategory: declareType.value }),
  {
    deepData: true,
    refreshDeps: [declareType],
    onSuccess: (data) => {
      searchForm.activityId = data.length ? data[0].id : '';
      handleSerach();
      getActivityCount();
    }
  }
);

const { run: ExportEnterpriseExcel } = useRequest(ExportEnterpriseExcelApi, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});

const { run: ExportPersonalExcel } = useRequest(ExportPersonalExcelApi, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});

watch(declareType, (newVal) => {
  changeTableColumn(newVal);
  resetSearchForm();
});

function handleExportExcel() {
  declareType.value === 1 ? ExportEnterpriseExcel(searchForm) : ExportPersonalExcel(searchForm);
}

function handleSerach() {
  searchTable(declareType.value === 1 ? GetEnterprisePageApi : GetPersonalPageApi);
}
// 分配后改变条件重新查询
function confirmDistribution() {
  searchForm.isDistribution = true;
  getActivityList();
}

function handleSelectionChange(val) {
  multipleSelection.value = val;
}

// 根据认定类型切换表格column
function changeTableColumn(type) {
  if (type === 1) {
    tableColumns.value.splice(3, 1);
  }
  if (type === 2) {
    tableColumns.value.splice(3, 0, otherColumn);
  }
}
// 重置查询表单
function resetSearchForm() {
  searchFormRef?.value?.resetFields();
  getActivityList();
}
// 随机分配专家
function handleDistribution() {
  const hasDistribution = multipleSelection.value.some((i) => i.isDistribution === '是');
  if (!hasDistribution) {
    previewRef.value.open({
      activityId: searchForm.activityId,
      selectionList: multipleSelection.value,
      declareType: declareType.value
    });
  } else {
    ElMessage.warning('随机分配失败！您选择的记录包含已分配专家的数据，不能重复分配');
  }
}
// 专家替换
function handleReplaceExpert(scoreSummaryId, expertId) {
  selectExpert.value.open({ scoreSummaryId, expertId });
}
// 查看申报信息
function viewDeclareInfo({ declareId, taskId }) {
  const selection = declareType.value;
  router.push({
    path: '/dataAudit/index',
    query: { id: declareId, taskId: taskId, type: false, flag: true, selection }
  });
}
</script>

<template>
  <el-container class="main-content">
    <div class="header-tabs">
      <div :class="declareType === 1 && 'selected'" @click="declareType = 1">
        企业认定（{{ activityCount?.enterpriseCount }}）
      </div>
      <div :class="declareType === 2 && 'selected'" @click="declareType = 2">
        个人认定（{{ activityCount?.personalCount }}）
      </div>
    </div>
    <el-header class="main-form-head" style="margin-bottom: 0">
      <!-- 数据查询 -->
      <el-form
        inline
        :model="searchForm"
        ref="searchFormRef"
        label-width="90px"
        class="auto-flex-form"
        @keyup.enter.native="handleSerach"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="认定活动">
              <el-select v-model="searchForm.activityId" :clearable="false">
                <el-option :label="item.topic" :value="item.id" v-for="item in activityList" />
              </el-select>
            </el-form-item>
            <el-form-item label="认定对象" prop="selectionObj">
              <el-input v-model="searchForm.selectionObj" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="已分配" prop="isDistribution">
              <el-select v-model="searchForm.isDistribution">
                <el-option :label="item.value" :value="item.key" v-for="item in STATUS_4" />
              </el-select>
            </el-form-item>
            <el-form-item label="分配日期" prop="date">
              <el-date-picker
                v-model="searchForm.date"
                type="daterange"
                value-format="YYYY-MM-DD"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评分专家" prop="expert">
              <el-input v-model="searchForm.expert" />
            </el-form-item>
            <el-form-item
              label="认定对象从业单位"
              label-width="140px"
              prop="enterpriseName"
              v-if="declareType === 2"
            >
              <el-input v-model="searchForm.enterpriseName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="handleSerach">查询</el-button>
              <el-button @click="resetSearchForm">重置</el-button>
              <el-button type="primary" plain @click="handleExportExcel">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 查询内容 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">{{ route?.meta?.title }}</div>
        <div>
          <el-button
            type="primary"
            @click="handleDistribution()"
            :disabled="!searchForm.activityId"
          >
            随机分配专家
          </el-button>
        </div>
      </div>
      <el-table-next
        class="main-table"
        :column="tableColumns"
        :data="dataSource"
        height="100%"
        border
        row-key="declareId"
        v-loading="tableLoading"
        @selection-change="handleSelectionChange"
      >
        <template #expert="{ row }">
          <el-button
            link
            type="primary"
            v-for="item in row.expert"
            @click="handleReplaceExpert(row.scoreSummaryId, item.id)"
          >
            {{ item.name }}
          </el-button>
        </template>
        <template #operations="{ row }">
          <el-button link type="primary" size="small" @click="viewDeclareInfo(row)">
            查看申报资料
          </el-button>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
  </el-container>
  <SelectExpert ref="selectExpert" @reload="handleSerach"></SelectExpert>
  <ExpertSetting ref="previewRef" @reload="confirmDistribution"></ExpertSetting>
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
    font-size: 15px;
    cursor: pointer;
    &.selected {
      border-top: 4px solid #007ffd;
      background-color: #fff;
      color: #007ffd;
    }
  }
}
</style>
