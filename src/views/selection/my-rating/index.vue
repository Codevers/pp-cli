<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ViewModal from './component/ViewModal.vue';
import RateModal from './component/RateModal.vue';
import usePageHooks from './hooks';
import usePagination from '@/hooks/use-pagination';
import { exportApi, listApi, submitApi } from './api';
import useRequest from '@/hooks/use-request.js';
import { downloadFileByBlob } from '@/utils/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';

const { tableColumn } = usePageHooks();
const selectedRows = ref([]);
const viewModal = ref(null);
const rateModal = ref(null);
const searchFormRef = ref(null);
const router = useRouter();
const searchForm = reactive({
  selectObject: '',
  submitDate: []
});

const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, listApi);

//导出 api
const { run: exportFun } = useRequest(exportApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});

// 查询
function onSubmit() {
  searchTable();
}

// 重置
function resetQuery() {
  searchFormRef.value.resetFields();
  searchTable();
}

//导出
function exportData() {
  exportFun(searchForm);
}

// 批量提交
async function batchCommit() {
  await ElMessageBox.confirm('提交后不能修改，请确认是否提交', {
    type: 'warning',
    cancelButtonText: '否，我再想想'
  });
  const res = await submitApi({
    bindIdList: selectedRows.value.map((row) => row.id)
  });
  ElMessage({
    type: res.success ? 'success' : 'error',
    message: res.msg
  });
  searchTable();
}

async function openView(row) {
  viewModal.value.open(row);
}

function openRate(row) {
  rateModal.value.open(row);
}
</script>

<template>
  <el-container class="main-content">
    <!-- 数据查询 start -->
    <el-header class="main-form-head" style="margin-bottom: 0">
      <el-form
        inline
        :model="searchForm"
        ref="searchFormRef"
        label-width="auto"
        class="auto-flex-form"
        @keyup.enter.native="onSubmit"
      >
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="认定对象" prop="selectObject">
              <el-input v-model="searchForm.selectObject" placeholder="请输入认定对象" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="评分提交日期" prop="submitDate">
              <el-date-picker
                v-model="searchForm.submitDate"
                type="daterange"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="6" style="text-align: right">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" plain @click="exportData">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 数据查询 end -->
    <!-- 数据展示 start -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">我的评分列表</div>
        <el-button type="primary" @click.stop="batchCommit" :disabled="!selectedRows.length">
          评分提交
        </el-button>
      </div>
      <el-table-next
        class="main-table"
        height="100%"
        :column="tableColumn"
        :data="dataSource"
        border
        default-expand-all
        row-key="id"
        v-loading="tableLoading"
        @selection-change="(rows) => (selectedRows = rows)"
      >
        <template #operations="{ row }">
          <el-button link type="primary" size="small" @click="openView(row)">查看</el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="openRate(row)"
            :disabled="!!row.scoreSubmitTime || row.operatePermission === false"
          >
            评分
          </el-button>
        </template>
      </el-table-next>
      <div class="main-table-footer">
        <div></div>
        <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
      </div>
    </el-main>
    <!-- 数据展示 end -->
  </el-container>
  <!-- 弹窗 start -->
  <ViewModal ref="viewModal" />
  <RateModal ref="rateModal" @close="searchTable" />
  <!-- 弹窗 end -->
</template>

<style lang="less" scoped>
.main-content {
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.main-form-head {
  --el-header-height: auto;
  --el-header-padding: 0;
}

.main-table-content {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-table {
  flex: 1;
  overflow: hidden;
}

.main-table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;

  .pagination-div {
    padding-top: 0;
  }
}
</style>
