<!-- 企业认定 - 我的认定 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { getListApi, excelApi } from './api.js';
import { downloadFileByBlob } from '@/utils/tools';
const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    label: '认定类型',
    prop: 'selectionType',
    align: 'center',
    width: 180
  },
  {
    label: '活动名称',
    prop: 'name',
    align: 'center',
    width: 180
  },
  {
    label: '活动开始时间',
    prop: 'startTime',
    align: 'center',
    width: 180
  },
  {
    label: '活动结束时间',
    prop: 'endTime',
    align: 'center',
    width: 180
  },
  {
    label: '提交人',
    prop: 'submitter',
    align: 'center',
    width: 180
  },
  {
    label: '提交人联系电话',
    prop: 'phone',
    align: 'center',
    width: 180
  },
  {
    label: '提交日期',
    prop: 'submitDate',
    align: 'center',
    width: 180
  },
  {
    label: '活动状态 ',
    prop: 'type',
    align: 'center',
    width: 180
  },
  {
    label: '申报状态 ',
    prop: 'applicationStatus',
    align: 'center',
    width: 180
  },
  {
    label: '审核意见 ',
    prop: 'opinion',
    align: 'center',
    width: 180,
    showOverflowTooltip: true
  },
  {
    label: '操作',
    align: 'center',
    width: 200,
    fixed: 'right',
    slotName: 'action'
  }
];
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const state = reactive({
  searForm: {
    name: '',
    startTime: '',
    endTime: '',
    submitter: '',
    time: []
  }
  // dataSource: [
  //   {
  //     name: '活动名称',
  //     selectionType: '1',
  //     startTime: '2022-08-16 11:31:11',
  //     endTime: '2022-08-16 11:31:11',
  //     submitter: '提交人',
  //     phone: '18530831325',
  //     submitDate: '2022-08-16 11:31:11',
  //     type: '1',
  //     applicationStatus: '0',
  //     opinion: '申报意见'
  //   }
  // ]
});

const { searForm } = toRefs(state);
const searFormRef = ref(ElForm);
const editRowId = ref('');
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, getListApi);

//查询
const onSubmit = () => {
  state.searForm.startTime =
    state.searForm.time && state.searForm.time[0] ? state.searForm.time[0] : '';
  state.searForm.endTime =
    state.searForm.time && state.searForm.time[1] ? state.searForm.time[1] : '';
  searchTable();
};
//重置
const resetQuery = () => {
  searFormRef.value.resetFields();
  state.searForm.entryTimeS = '';
  state.searForm.entryTimeE = '';
  searchTable();
};
//导出
const { run: exportFun } = useRequest(excelApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      downloadFileByBlob(data);
    }
  }
});
const exportData = () => {
  state.searForm.startTime =
    state.searForm.time && state.searForm.time[0] ? state.searForm.time[0] : '';
  state.searForm.endTime =
    state.searForm.time && state.searForm.time[1] ? state.searForm.time[1] : '';
  exportFun(searForm.value);
};
</script>
<template>
  <div class="main-content">
    <div class="main-form-head">
      <el-form
        :inline="true"
        :model="searForm"
        ref="searFormRef"
        label-width="80px"
        @keyup.enter.native="onSubmit"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input
            v-model.trim="searForm.name"
            placeholder="请输入"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="提交日期" prop="time">
          <el-date-picker
            v-model="searForm.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="defaultTime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="提交人" prop="nsubmitterame">
          <el-input
            v-model.trim="searForm.submitter"
            placeholder="请输入"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <div class="operationBtn">
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
            <el-button type="primary" plain @click="exportData">导出</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">企业认定我的认定列表</div>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        max-height="500"
        v-loading="tableLoading"
        border
      >
        <template #action="scope">
          <el-button link type="primary" size="small">查看</el-button>
          <el-button link type="primary" size="small">编辑</el-button>
          <el-button link type="primary" size="small">撤回</el-button>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </div>
  </div>
</template>

<style scoped lang="less">
.operationBtn {
  width: 100%;
  text-align: right;
}
</style>
