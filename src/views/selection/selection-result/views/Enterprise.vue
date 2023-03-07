<script setup>
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import usePagination from '@/hooks/use-pagination.js';
import { enterpriseExcelApi, enterprisePageApi } from '../api.js';
import useRequest from '@/hooks/use-request.js';
import { downloadFileByBlob } from '@/utils/index.js';
import { appStoreWithOut } from '@/store/modules/app';
import { getActivitysByType } from '@/api/common.js';

const router = useRouter();
const activities = ref([]);
const tableColumn = [
  { label: '序号', prop: 'index', width: 60, fixed: true },
  { label: '所在市', prop: 'city', width: 160 },
  { label: '认定对象', prop: 'selectionObj', align: 'left' },
  { label: '公示开始日期', prop: 'publishTimeS', width: 160 },
  { label: '公示截止日期', prop: 'publishTimeE', width: 160 },
  { label: '当前状态', prop: 'status', width: 160 }
];
const selectedRows = ref([]);
const dialogVisible = ref(false);
const searchFormRef = ref(null);
const searchForm = reactive({
  activityId: '', // 必选参数
  city: '',
  selectionObj: ''
});
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, enterprisePageApi, {
  manual: true // 手动触发，等待`认定活动`下拉框的第一个活动id
});
// 认定活动 下拉数据
getActivitysByType({ category: 1, type: 'CITY_SELECTION_RESULT' }).then(
  ({ data }) => (activities.value = data)
);
watch(activities, () => {
  searchForm.activityId = activities.value[0]?.id;
  searchTable();
});

//导出 api
const { run: exportFun } = useRequest(enterpriseExcelApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});

// 查询
function onSubmit() {
  dataSource.value = [];
  searchTable();
}

// 重置
function resetQuery() {
  searchFormRef.value.resetFields();
  searchForm.activityId = activities.value[0]?.id;
  searchTable();
}

//导出
function exportData() {
  exportFun(searchForm);
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
            <el-form-item label="认定活动" prop="activityId">
              <el-select v-model="searchForm.activityId">
                <el-option :label="item.name" :value="item.id" v-for="item in activities" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在市" prop="city">
              <el-select v-model="searchForm.city">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in appStoreWithOut.getAHCity"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="认定对象" prop="selectionObj">
              <el-input v-model="searchForm.selectionObj" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0" style="text-align: right">
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
        <div class="main-title">认定结果列表</div>
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
      ></el-table-next>
      <div class="main-table-footer">
        <div></div>
        <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
      </div>
    </el-main>
    <!-- 数据展示 end -->
  </el-container>
  <!-- 弹窗 start -->
  <!-- 弹窗 end -->
</template>

<style lang="less" scoped></style>
