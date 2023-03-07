<!-- 省级初评 - 待办 -->
<script setup>
import { onMounted, reactive, toRefs, ref, onUpdated } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { regionApi, todoListApi, todoExcelApi } from './api.js';
import { downloadFileByBlob } from '@/utils/tools';
const router = useRouter();
const route = useRoute();
//处理时间  年月日
const getTime = (time, num) => {
  return time?.slice(0, num);
};
const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    label: '所在市',
    prop: 'region',
    align: 'center'
  },
  {
    label: '认定类型',
    prop: 'selectionType',
    align: 'center'
  },
  {
    label: '认定对象',
    prop: 'session',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '提交人',
    prop: 'submitter',
    align: 'center'
  },
  {
    label: '提交手机号',
    prop: 'phone',
    align: 'center',
    width: 180
  },
  {
    label: '市推选日期',
    prop: 'chooseDate',
    align: 'center',
    width: 200,
    formatter: (row) => {
      return getTime(row.chooseDate, 10);
    }
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
  region: [],
  searForm: {
    region: '',
    selectionType: '',
    session: '',
    startTime: '',
    endTime: '',
    submitter: '',
    time: []
  }
});
const { region, searForm } = toRefs(state);
const searFormRef = ref(ElForm);
onMounted(() => {
  regionFun({ level: 2 });
});
//获得所在市数据 api
const { run: regionFun } = useRequest(regionApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      state.region = data.data[11].children;
    }
  }
});
//分页-列表
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
  searFormRef?.value?.resetFields();
  state.searForm.startTime = '';
  state.searForm.endTime = '';
  searchTable();
};
//导出
const exportData = () => {
  state.searForm.startTime =
    state.searForm.time && state.searForm.time[0] ? state.searForm.time[0] : '';
  state.searForm.endTime =
    state.searForm.time && state.searForm.time[1] ? state.searForm.time[1] : '';
  exportFun(searForm.value);
};
//资料初审
const audit = (row) => {
  const selection = row.selectionType == '个人' ? 2 : 1;
  router.push({
    path: '/dataAudit/index',
    query: { id: row.id, taskId: row.taskId, type: true, selection }
  });
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
        @keyup.enter.native="onSubmit"
      >
        <el-row :gutter="15">
          <el-col :span="8">
            <el-form-item label="所在市" prop="region">
              <el-select v-model="searForm.region">
                <el-option
                  v-for="item in region"
                  :key="item.cityCode"
                  :label="item.label"
                  :value="item.cityCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认定类型" prop="selectionType">
              <el-select v-model="searForm.selectionType">
                <el-option label="企业" value="ENTERPRISE" />
                <el-option label="个人" value="PERSONAL" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认定对象" prop="session">
              <el-input v-model.trim="searForm.session" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市推选日期" prop="time">
              <el-date-picker
                v-model="searForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="defaultTime"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提交人" prop="submitter">
              <el-input v-model.trim="searForm.submitter" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
        <div class="main-title">{{ route?.meta?.title }}</div>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        v-loading="tableLoading"
        class="main-table"
        border
      >
        <template #action="{ row }">
          <el-button link type="primary" size="small" @click="audit(row)">资料复审</el-button>
        </template>
      </el-table-next>

      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
  </el-container>
</template>

<style scoped lang="less"></style>
