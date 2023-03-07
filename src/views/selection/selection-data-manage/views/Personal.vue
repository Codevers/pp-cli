<script setup>
import { computed, inject, reactive, ref, onMounted } from 'vue';
import usePagination from '@/hooks/use-pagination.js';
import { getFilesApi, personExcelApi, personPageApi, previewReadApi } from '../api.js';
import useRequest from '@/hooks/use-request.js';
import { downloadFileByBlob } from '@/utils/index.js';
import { buildZip } from '@/utils/exportZip.js';
import { ElMessage } from 'element-plus';
import { getActivitysByType } from '@/api/common.js';

import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const regionLevel = userStore.userInfo.regionLevel; // regionLevel 1   省  2   市  用于判断是否展示   所在市 列 和 搜索所在市

const activities = ref([]);
const activityStatus = inject('activityStatus');
const declareStatus = inject('declareStatus');
const selectionResults = inject('selectionResults');

const tableColumn = [
  { type: 'selection', width: 50, fixed: true },
  { label: '序号', prop: 'index', width: 60, fixed: true },
  { label: '认定对象', prop: 'person', slotName: 'person', width: 90 },
  { label: '从业单位', prop: 'company', align: 'left' },
  { label: '提交人', prop: 'submitter', width: 140 },
  { label: '提交手机号', prop: 'phone', width: 140 },
  { label: '提交日期', prop: 'submitDate', width: 160 },
  { label: '申报状态', prop: 'declareStatus', width: 120 },
  { label: '活动状态', prop: 'activityStatus', width: 120 },
  { label: '公示状态', prop: 'publishStatus', width: 120 },
  { label: '认定结果', slotName: 'result', width: 120 },
  { label: '操作', width: 160, fixed: 'right', slotName: 'operations' }
];
const exporting = ref(false);
const selectedRows = ref([]);
const dialogVisible = ref(false);
const searchFormRef = ref(null);
const searchForm = reactive({
  activity: '',
  person: '',
  company: '',
  activityStatus: '',
  declareStatus: '',
  result: ''
});
const preview = ref(null);
const activityName = computed(() => {
  return activities.value.find((activity) => activity.id === searchForm.activity)?.name;
});
const {
  dataSource,
  handlePageChange,
  page,
  total,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, personPageApi);
// 认定活动 下拉数据
getActivitysByType({ category: 2, type: 'CITY_SELECTION_DATA_MANAGE' }).then(
  ({ data }) => (activities.value = data)
);

//导出 api
const { run: exportFun } = useRequest(personExcelApi, {
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

/**
 * 导出申报资料
 * @param rows
 * @param isBatch
 * @returns {Promise<void>}
 */
async function exportZip(rows, isBatch = false) {
  exporting.value = true;
  try {
    const { data } = await getFilesApi({ declareInfoIds: rows.map((row) => row.id) });
    const folders = rows.map((row, index) => {
      // const temp = data[index];
      const temp = data.find((item) => item.declareInfoId === row.id);
      return {
        name: [row.activityName, row.company + '_' + row.person].join(isBatch ? '/' : '_'),
        files: temp?.files || []
      };
    });
    await buildZip({
      name: isBatch
        ? activityName.value || '个人认定资料导出'
        : `${rows[0].activityName}_${rows[0].company}_${rows[0].person}`,
      folders
    });
    ElMessage.success('导出成功');
  } catch (e) {
    ElMessage.error('导出失败');
    console.log('导出 zip 失败', e);
  } finally {
    exporting.value = false;
  }
}

//查看申报
const lockDetail = (row) => {
  preview.value.open({ api: previewReadApi, id: row.activityid, reportorId: row.reportorId });
};

onMounted(() => {
  const obj = {
    prop: 'regionName',
    width: 80,
    label: '所在市'
  };
  if (regionLevel == 1) {
    tableColumn.splice(1, 0, obj);
  }
});
</script>

<template>
  <el-container class="main-content" v-loading="exporting">
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
            <el-form-item label="认定活动" prop="activity">
              <el-select v-model="searchForm.activity">
                <el-option :label="item.name" :value="item.id" v-for="item in activities" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="认定对象" prop="person">
              <el-input v-model="searchForm.person" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="从业单位" prop="company">
              <el-input v-model="searchForm.company" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="活动状态" prop="activityStatus">
              <el-select v-model="searchForm.activityStatus">
                <el-option :label="item.value" :value="item.key" v-for="item in activityStatus" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申报状态" prop="declareStatus">
              <el-select v-model="searchForm.declareStatus">
                <el-option :label="item.value" :value="item.key" v-for="item in declareStatus" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="认定结果" prop="result">
              <el-select v-model="searchForm.result">
                <el-option :label="item.value" :value="item.key" v-for="item in selectionResults" />
              </el-select>
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
        <div class="main-title">认定资料管理列表</div>
        <el-button
          type="primary"
          @click="exportZip(selectedRows, true)"
          :disabled="!selectedRows.length"
        >
          批量导出申报资料
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
        <template #person="{ row }">
          <span style="color: #409eff; cursor: pointer" @click="lockDetail(row)">
            {{ row.person }}
          </span>
        </template>
        <template #result="{ row }">
          <img v-show="row.result === '获奖'" src="@/assets/img/winPrize.png" alt="" />
        </template>
        <template #operations="{ row }">
          <el-button link type="primary" size="small" @click="exportZip([row])">
            导出申报资料
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

  <!-- 预览上报详情 -->
  <Preview ref="preview"></Preview>
</template>

<style lang="less" scoped></style>
