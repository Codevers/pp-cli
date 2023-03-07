<!-- 专家 - 待办 -->
<script setup>
import { onMounted, reactive, toRefs, ref, onUpdated } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { useRoute, useRouter } from 'vue-router';
import { todoListApi, todoExcelApi, submitApi } from './api.js';
import ViewModal from '../selection/my-rating/component/ViewModal.vue';
import RateModal from '../selection/my-rating/component/RateModal.vue';
import { downloadFileByBlob } from '@/utils/tools';
const goPath = useRouter();
const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    type: 'selection',
    width: '60',
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
  },
  multipleSelection: []
});

const { searForm, multipleSelection } = toRefs(state);
const searFormRef = ref(ElForm);
const viewModal = ref(null);
const rateModal = ref(null);
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, todoListApi);
//导出 api
const { run: exportFun } = useRequest(todoExcelApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});

//评分提交
const { run: submitFun } = useRequest(submitApi, {
  manual: true,
  msgTxt: ['提交成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      searchTable();
    }
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
//监听勾选
const handleSelectionChange = (val) => {
  let data = [];
  val.forEach((item) => {
    data.push(item.id);
  });
  state.multipleSelection = data;
};
//评分提交
const submit = () => {
  submitFun({ bindIdList: multipleSelection.value });
};

//预览上报详情
const lockDetail = (row) => {
  viewModal.value.open(row);
};
//评分
const grade = (row) => {
  rateModal.value.open(row);
};

onUpdated(() => {
  searchTable();
});
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
        <div class="main-title">待办事项</div>
        <el-button type="primary" @click="submit" :disabled="!multipleSelection.length > 0">
          评分提交
        </el-button>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        @selection-change="handleSelectionChange"
        class="main-table"
        border
        v-loading="tableLoading"
      >
        <template #action="{ row }">
          <el-button link type="primary" size="small" @click="lockDetail(row)">查看</el-button>
          <el-button link type="primary" size="small" @click="grade(row)">评分</el-button>
        </template>
      </el-table-next>

      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>

    <!-- 预览上报详情 -->
    <ViewModal ref="viewModal" />
    <RateModal ref="rateModal" @close="searchTable" />
  </el-container>
</template>

<style scoped lang="less"></style>
