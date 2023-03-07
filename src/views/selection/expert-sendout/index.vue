<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import usePageHooks from './hooks';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { GetActivityList, GetActivityListNew } from '@/api/common';
import { STATUS_4 } from '@/config/dic-options';
import { activityCount, getActivityCount } from '@/hooks/use-global-data';
import { downloadFileByBlob } from '@/utils/tools';
import { ElMessageBox } from 'element-plus';
import { permissionStore } from '@/store/modules/permission';
import {
  GetProficentEnterprisePageApi,
  GetProficentPersonalPageApi,
  SendProficentApi,
  CancleAllocatedApi,
  SendAllocatedPersonalApi,
  SendAllocatedEnterpriseApi,
  ExportEnterpriseExcelApi,
  ExportPersonalExcelApi
} from './api';
import { appStoreWithOut } from '@/store/modules/app';
const declareType = ref(1);
const route = useRoute();
const { tableColumn } = usePageHooks(declareType);
const tableColumns = ref(tableColumn);
const searchFormRef = ref(null);
const router = useRouter();
const multipleSelection = ref([]);
const searchForm = reactive({
  activityId: '',
  selectionObj: '',
  isSend: false,
  date: [],
  expert: '',
  region: '',
  enterpriseName: ''
});
const otherColumn = {
  prop: 'enterpriseName',
  label: '认定对象从业单位',
  'min-width': 200,
  align: 'left',
  'show-overflow-tooltip': true
};

const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, GetProficentEnterprisePageApi, {
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
const { run: sendProficent } = useRequest(SendProficentApi, {
  manual: true,
  msgTxt: ['发送待办成功！'],
  onSuccess: (data, isSuccess) => {
    isSuccess && handleSerach();
  }
});

const { run: cancleAllocated } = useRequest(CancleAllocatedApi, {
  manual: true,
  msgTxt: ['取消成功！'],
  onSuccess: (data, isSuccess) => {
    isSuccess && handleSerach();
  }
});

const { run: sendAllocatedPersonal } = useRequest(() => SendAllocatedPersonalApi(searchForm), {
  manual: true,
  msgTxt: ['全部发送成功！'],
  onSuccess: (data, isSuccess) => {
    isSuccess && handleSerach();
  }
});

const { run: sendAllocatedEnterprise } = useRequest(() => SendAllocatedEnterpriseApi(searchForm), {
  manual: true,
  msgTxt: ['全部发送成功！'],
  onSuccess: (data, isSuccess) => {
    isSuccess && handleSerach();
  }
});
const { run: ExportExcelEnterprise } = useRequest(ExportEnterpriseExcelApi, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});
const { run: ExportExcelPersonal } = useRequest(ExportPersonalExcelApi, {
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
  declareType.value === 1 ? ExportExcelEnterprise(searchForm) : ExportExcelPersonal(searchForm);
}
function handleSerach() {
  searchTable(
    declareType.value === 1 ? GetProficentEnterprisePageApi : GetProficentPersonalPageApi
  );
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
function handleSelectionChange(val) {
  multipleSelection.value = val;
}
// 查看申报信息
function viewDeclareInfo({ declareId, taskId }) {
  const selection = declareType.value;
  router.push({
    path: '/dataAudit/index',
    query: { id: declareId, taskId: taskId, type: false, flag: true, selection }
  });
}
function setExpertUse(flag) {
  const ids = multipleSelection.value.map((i) => i.scoreSummaryId);
  const confirmTitle =
    flag === 1
      ? '确认取消已分配专家吗？'
      : flag === 2
      ? '是否确认发送专家待办事项？'
      : '是否确认一键发送全部专家待办事项';

  ElMessageBox.confirm(confirmTitle, '提示', {
    confirmButtonText: '是，确认',
    cancelButtonText: '否，我再想想',
    type: 'warning'
  }).then(() => {
    if (flag === 1) {
      cancleAllocated({ ids });
    }
    if (flag === 2) {
      sendProficent({ ids });
    }
    if (flag === 3) {
      declareType.value === 1
        ? sendAllocatedEnterprise(searchForm.model)
        : sendAllocatedPersonal(searchForm.model);
    }
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
        label-width="110px"
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
            <el-form-item label="已发待办" prop="isSend">
              <el-select v-model="searchForm.isSend">
                <el-option :label="item.value" :value="item.key" v-for="item in STATUS_4" />
              </el-select>
            </el-form-item>
            <el-form-item label="待办发送日期" prop="date">
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
            <el-form-item label="专家" prop="expert">
              <el-input v-model="searchForm.expert" />
            </el-form-item>
            <el-form-item label="所在市" prop="region" v-if="permissionStore.isProvince">
              <el-select v-model="searchForm.region">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in appStoreWithOut.getAHCity"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="认定对象从业单位"
              label-width="140px"
              prop="enterpriseName"
              v-if="declareType === 2"
            >
              <el-input v-model="searchForm.enterpriseName" />
            </el-form-item>
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
          <el-button type="primary" :disabled="!multipleSelection.length" @click="setExpertUse(1)">
            取消已分配专家
          </el-button>
          <el-button type="primary" :disabled="!multipleSelection.length" @click="setExpertUse(2)">
            发送专家待办
          </el-button>
          <el-button type="primary" @click="setExpertUse(3)" :disabled="!searchForm.activityId">
            一键发送全部待办
          </el-button>
        </div>
      </div>
      <el-table-next
        class="main-table"
        @selection-change="handleSelectionChange"
        :column="tableColumns"
        :data="dataSource"
        height="100%"
        border
        row-key="declareId"
        v-loading="tableLoading"
      >
        <template #expert="{ row }">
          <el-tag effect="light" v-for="item in row.expert" style="margin: 0 3px">
            {{ item.name }}
          </el-tag>
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
</style>
