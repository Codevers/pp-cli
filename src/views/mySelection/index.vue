<!-- 我的认定 -->
<script setup>
import { onMounted, reactive, toRefs, ref, onUpdated } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { useRouter, useRoute } from 'vue-router';
import {
  getListApi,
  excelApi,
  previewApi,
  revokeApi,
  previewEditApi,
  previewReadApi
} from './api.js';
import { downloadFileByBlob } from '@/utils/tools';
const router = useRouter();
const route = useRoute();
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
//申报状态
const status = [
  'SAVED', //未提交
  'REVOKED', //已撤回
  'CITY_REJECTED', //市退回
  'PROVINCE_REJECTED' //省退回
];
// UnDeclared   未申报
// 'SUBMITTED' 已提交
//根据状态判断是否禁用按钮  编辑状态可用
const getStatus = (type) => {
  return status.includes(type);
};
//处理时间  年月日
const getTime = (time, num) => {
  return time?.slice(0, num);
};
//根据申报状态判断调用 可编辑/只读 接口
const getApi = (state) => {
  let type = status.includes(state);
  if (type) {
    return previewEditApi;
  } else {
    return previewReadApi;
  }
};
const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    label: '活动名称',
    prop: 'name',
    align: 'center',
    minWidth: 350,
    showOverflowTooltip: true
  },
  {
    label: '活动开始时间',
    prop: 'startTime',
    align: 'center',
    width: 140,
    formatter: (row) => {
      return getTime(row.startTime, 16);
    }
  },
  {
    label: '活动结束时间',
    prop: 'endTime',
    align: 'center',
    width: 140,
    formatter: (row) => {
      return getTime(row.endTime, 16);
    }
  },
  {
    label: '提交人',
    prop: 'submitter',
    align: 'center',
    width: 120
  },
  {
    label: '提交人联系电话',
    prop: 'phone',
    align: 'center',
    width: 120
  },
  {
    label: '提交日期',
    prop: 'submitDate',
    align: 'center',
    width: 150
  },
  {
    label: '活动状态 ',
    prop: 'type',
    align: 'center',
    width: 110
  },
  {
    label: '申报状态 ',
    prop: 'applicationStatus',
    align: 'center',
    width: 110
  },
  {
    label: '审核意见 ',
    prop: 'opinion',
    align: 'center',
    width: 200,
    showOverflowTooltip: true,
    formatter: (row) => {
      return row.opinion?.split('\n').join();
    }
  },
  {
    label: '操作',
    align: 'center',
    width: 180,
    fixed: 'right',
    slotName: 'action'
  }
];
const state = reactive({
  searForm: {
    name: '',
    startTime: '',
    endTime: '',
    submitter: '',
    time: []
  }
});
const { searForm } = toRefs(state);
const searFormRef = ref(ElForm);
const preview = ref(null);
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, getListApi);

//导出 api
const { run: exportFun } = useRequest(excelApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});

//撤回 api
const { run: revokeFun } = useRequest(revokeApi, {
  manual: true,
  msgTxt: ['撤回成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      searchTable();
    }
  }
});

//查询
const onSubmit = () => {
  state.searForm.startTime =
    searForm.value.time && searForm.value.time[0] ? searForm.value.time[0] : '';
  state.searForm.endTime =
    searForm.value.time && searForm.value.time[1] ? searForm.value.time[1] : '';
  searchTable();
};
//重置
const resetQuery = () => {
  searFormRef?.value?.resetFields();
  state.searForm.startTime = '';
  state.searForm.endTime = '';
  searchTable();
};
//导出
const exportData = () => {
  state.searForm.startTime =
    searForm.value.time && searForm.value.time[0] ? searForm.value.time[0] : '';
  state.searForm.endTime =
    searForm.value.time && searForm.value.time[1] ? searForm.value.time[1] : '';
  exportFun(searForm.value);
};

//查看
const lockDetail = (row) => {
  preview.value.open({ api: getApi(row.applicationStatusEnum), id: row.activityId });
};

//编辑
const edit = (row) => {
  router.push({
    path: '/wel/enterpriseKpi/index',
    query: { id: row.activityId, type: true, category: row.category }
  });
};
//撤回
const revocation = (row) => {
  revokeFun({ activityId: row.activityId });
};

onUpdated(() => {
  searchTable();
});
</script>
<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <el-form
        inline
        :model="searForm"
        ref="searFormRef"
        label-width="auto"
        class="auto-flex-form"
        @keyup.enter.native="onSubmit"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="活动名称" prop="name">
              <el-input v-model.trim="searForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提交日期" prop="time">
              <el-date-picker
                v-model="searForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="defaultTime"
                :editable="false"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="提交人" prop="submitter">
              <el-input v-model.trim="searForm.submitter" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <div class="operationBtn">
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="resetQuery">重置</el-button>
                <el-button type="primary" plain @click="exportData">导出</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">{{ route?.meta?.title }}</div>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        class="main-table"
        v-loading="tableLoading"
        border
      >
        <template #action="{ row }">
          <el-button
            link
            :type="row.applicationStatusEnum == 'UnDeclared' ? 'info' : 'primary'"
            :disabled="row.applicationStatusEnum == 'UnDeclared'"
            size="small"
            @click="lockDetail(row)"
          >
            查看
          </el-button>
          <el-button
            link
            size="small"
            :type="!getStatus(row.applicationStatusEnum) ? 'info' : 'primary'"
            :disabled="!getStatus(row.applicationStatusEnum)"
            @click="edit(row)"
          >
            编辑
          </el-button>

          <el-popconfirm
            :title="`您正在撤回${row.name}活动，请确认是否撤回？`"
            @confirm="revocation(row)"
            width=""
          >
            <template #reference>
              <el-button
                link
                size="small"
                :type="row.applicationStatusEnum == 'SUBMITTED' ? 'danger' : 'info'"
                :disabled="row.applicationStatusEnum != 'SUBMITTED'"
              >
                撤回
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>

    <!-- 预览上报详情 -->
    <Preview ref="preview"></Preview>
  </el-container>
</template>

<style scoped lang="less">
.operationBtn {
  width: 100%;
  text-align: right;
}
</style>
