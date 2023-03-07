<!-- 专家 - 已办 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { doneListApi, doneExcelApi } from './api.js';
// import Preview from '@/components/Preview/index.vue';
import { downloadFileByBlob } from '@/utils/tools';
import ViewModal from '../selection/my-rating/component/ViewModal.vue';
const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    label: '认定对象',
    prop: 'session',
    align: 'center'
  },
  {
    label: '待办发送日期',
    prop: 'sendDate',
    align: 'center'
  },
  {
    label: '评分项',
    prop: 'scoringItems',
    align: 'center'
  },
  {
    label: '我的评分结果',
    prop: 'scores',
    align: 'center'
  },
  {
    label: '评分提交日期',
    prop: 'scoreSubmitTime',
    align: 'center'
  },
  {
    label: '操作',
    align: 'center',
    width: 200,
    fixed: 'right',
    slotName: 'action'
  }
];
const state = reactive({
  searForm: {
    selectObject: ''
  }
});

const { searForm } = toRefs(state);
const searFormRef = ref(ElForm);
const viewModal = ref(null);
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, doneListApi);
//导出 API
const { run: exportFun } = useRequest(doneExcelApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});

//查询
const onSubmit = () => {
  searchTable();
};
//重置
const resetQuery = () => {
  searFormRef.value.resetFields();
  searchTable();
};

//导出
const exportData = () => {
  exportFun(searForm.value);
};

//预览上报详情
const lockDetail = (row) => {
  viewModal.value.open(row);
};
</script>
<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <el-form
        :inline="true"
        :model="searForm"
        ref="searFormRef"
        label-width="auto"
        class="auto-flex-form"
        @submit.native.prevent
        @keyup.enter.native="onSubmit"
      >
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="认定对象" prop="selectObject">
              <el-input v-model="searForm.selectObject" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" plain @click="exportData">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">已办事项</div>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        v-loading="tableLoading"
        class="main-table"
        border
      >
        <template #action="{ row }">
          <el-button link type="primary" size="small" @click="lockDetail(row)">查看</el-button>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
    <!-- 预览上报详情 -->
    <ViewModal ref="viewModal" />
  </el-container>
</template>

<style scoped lang="less"></style>
