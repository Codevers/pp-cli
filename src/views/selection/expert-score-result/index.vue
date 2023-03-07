<script setup>
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import usePageHooks from './hooks';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { activityCount, getActivityCount } from '@/hooks/use-global-data';
// import { GetActivityList, GetActivityListNew } from '@/api/common';
import { downloadFileByBlob } from '@/utils/tools';
import { STATUS_4 } from '@/config/dic-options';
import { getRowspanMethod } from '@/hooks/use-span-methods';
import { ElMessageBox } from 'element-plus';
import {
  // GetScoreResultEnterprisePageApi,
  // GetScoreResultPersonalPageApi,
  GetScoreResultPageApi,
  // ExportEnterpriseExcelApi,
  // ExportPersonalExcelApi,
  GetActivityListNew,
  ExportExcelApi,
  ScoreBackApi
} from './api';
import { appStoreWithOut } from '@/store/modules/app';
import ViewModal from '../my-rating/component/ViewModal.vue';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const regionLevel = userStore.userInfo.regionLevel; // regionLevel 1   省  2   市  用于判断是否展示   所在市 列 和 搜索所在市
const route = useRoute();
let { tableColumn } = usePageHooks(regionLevel);
const tableColumns = ref(tableColumn);
const tableColumnsCopy = ref(tableColumn);
const searchFormRef = ref(null);
const declareType = ref(1);
const viewModal = ref(null);
const spanMethod = ref(null);
const dynamicColumn = ref([]);
const dynamicMapColumn = ref([]);
const searchForm = reactive({
  activityId: '',
  selectionObj: '',
  selectionIsEnd: true,
  proficientName: '',
  company: ''
});
const otherColumn = {
  prop: 'company',
  label: '认定对象从业单位',
  'min-width': 200,
  align: 'left',
  'show-overflow-tooltip': true
};
// 接口定义：分页
let {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, GetScoreResultPageApi, {
  manual: true,
  onSuccess(data) {
    // 多条记录合并一个索引
    let index = 0;
    let resData = data;
    for (let i = 0; i < resData.length; i++) {
      if (
        resData[i].selectionObj !== resData[i - 1]?.selectionObj ||
        resData[i].city !== resData[i - 1]?.city
      ) {
        index += 1;
      }
      resData[i].index = index;
    }
    createdynamicColumn();
    spanMethod.value = getRowspanMethod(data, ['index', 'city', 'selectionObj']);
    show.value = true;
  }
});
// 接口定义：获取活动列表
const { run: getActivityList, data: activityList } = useRequest(
  () => GetActivityListNew({ activityCategory: declareType.value }),
  {
    deepData: true,
    refreshDeps: [declareType],
    onSuccess: (data) => {
      searchForm.activityId = data.length ? data[0]?.id : '';
      if (searchForm.activityId) {
        searchTable();
        getActivityCount();
      }
    }
  }
);
// 接口定义：导出excel
const { run: ExportExcel } = useRequest(ExportExcelApi, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});
// 接口定义：回退专家评分
const { run: ScoreBack } = useRequest(ScoreBackApi, {
  manual: true,
  onSuccess: () => {
    searchTable();
  }
});

/**
 * 特殊标记，在切换`企业/个人`时由`false -> true`
 * 用于控制重新生成`el-table-next`的实例，避免反复切换`column`时该组件内部抛出无法解决的异常：
 * Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'splice')
 * Uncaught (in promise) TypeError: Cannot read properties of null (reading 'emitsOptions')
 */
const show = ref(true);

watch(declareType, () => {
  show.value = false;
});

// 动态表头生成+表格数据关联（8.25 update）
function createdynamicColumn() {
  dynamicColumn.value = [];
  for (let item of dataSource.value) {
    // 定义动态表头
    item.expertGroupScore.forEach((item2) => {
      const childTotal = item2.children?.length;
      item2.children.forEach((item3) => {
        item3.label = item3.subName;
        item3.prop = item3.subName;
        item3.slotName = item3.subName;
        item3.align = 'center';
        item3['min-width'] = childTotal > 1 ? 42 : 120;
        item3['class-name'] = 'cell-pre-line';
        // tableData强关联
        item[item3.subName] = item3.score;
        // 将警告标志强关联，方便插槽使用
        item[item3.subName + 'isWarn'] = item3.isWarn;
        // 将意见内容强关联，方便插槽使用
        item[item3.subName + 'latestAuditComment'] = '意见：' + (item3.latestAuditComment || '无');
      });
      if (!dynamicColumn.value.find((i) => i.projectId === item2.projectId)) {
        dynamicColumn.value.push({
          label: item2.projectName,
          projectId: item2.projectId,
          align: 'center',
          children: item2.children,
          width: 100
        });
      }
    });
  }
  // 平铺column
  dynamicMapColumn.value = dynamicColumn.value.map((i) => i.children.map((ii) => ii)).flat();
  // 合并基础表头+动态表头
  let generateColumn = [...tableColumnsCopy.value, ...dynamicColumn.value];
  // 切换到个人时，认定对象宽度缩窄
  const isPersonal = declareType.value === 2;
  generateColumn.find((i) => i.prop === 'selectionObj')['min-width'] = isPersonal ? 100 : 200;
  isPersonal && generateColumn.splice(3, 0, otherColumn);
  tableColumns.value = generateColumn;
}
// 重置查询表单
function resetSearchForm() {
  searchFormRef?.value?.resetFields();
  getActivityList();
}
// 查看专家信息
function handleViewExpert(row) {
  viewModal.value.open({ ...row, id: row.proficientId, name: row.proficientName });
}
// 退回专家评分
function handleScoreBack(bindId) {
  ElMessageBox.confirm('您正在操作退回该专家评分，请确认是否退回？', '提示', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning'
  }).then(() => {
    ScoreBack({ bindId });
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
        label-width="80px"
        class="auto-flex-form"
        @keyup.enter.native="searchTable"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="认定活动">
              <el-select v-model="searchForm.activityId" :clearable="false">
                <el-option :label="item.topic" :value="item.id" v-for="item in activityList" />
              </el-select>
            </el-form-item>
            <el-form-item label="专家" prop="proficientName">
              <el-input v-model="searchForm.proficientName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="专家评分是否结束" prop="selectionIsEnd" label-width="140px">
              <el-select v-model="searchForm.selectionIsEnd">
                <el-option :label="item.value" :value="item.key" v-for="item in STATUS_4" />
              </el-select>
            </el-form-item>
            <el-form-item label="认定对象" prop="selectionObj" label-width="140px">
              <el-input v-model="searchForm.selectionObj" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在市" prop="city" v-if="regionLevel == 1" label-width="140px">
              <el-select v-model="searchForm.city">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in appStoreWithOut.getAHCity"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="认定对象从业单位"
              prop="company"
              v-if="declareType === 2"
              label-width="140px"
            >
              <el-input v-model="searchForm.company" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="searchTable">查询</el-button>
              <el-button @click="resetSearchForm">重置</el-button>
              <el-button type="primary" plain @click="ExportExcel(searchForm)">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 查询内容 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">{{ route?.meta?.title }}</div>
      </div>
      <el-table-next
        v-if="show"
        class="main-table"
        :column="tableColumns"
        :data="dataSource"
        :span-method="spanMethod"
        height="100%"
        border
        v-loading="tableLoading"
      >
        <template #expert="{ row }">
          <el-button
            link
            :type="row.isSubmit ? 'primary' : ''"
            style="font-size: 12px"
            @click="row.isSubmit && handleViewExpert(row)"
          >
            {{ row.proficientName }}
          </el-button>
        </template>
        <template #operations="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="handleScoreBack(row.proficientDeclareDetailSelectionProjectBindId)"
            :disabled="!row.isSubmit || !row.isCanBack"
          >
            退回专家评分
          </el-button>
        </template>
        <template #scoreSum="{ row }">
          <span :class="row.isWarnScoreSum && 'warn-score'">{{ row.scoreSum }}</span>
        </template>
        <!-- 动态渲染列 -->
        <template #[item.prop]="{ row }" v-for="(item, index) in dynamicMapColumn">
          <el-tooltip
            effect="light"
            trigger="click"
            :content="row[item.prop + 'latestAuditComment']"
            placement="top-start"
            style="z-index: -1"
          >
            <span :class="row[item.prop + 'isWarn'] && 'warn-score'" class="span-score">
              <!-- title="查看意见" -->
              {{ row[item.prop] }}
            </span>
          </el-tooltip>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
  </el-container>
  <ViewModal ref="viewModal" />
</template>
<style lang="less" scoped>
.warn-score {
  color: #de1515;
}
.span-score {
  cursor: pointer;
  &:hover {
    font-weight: bold;
  }
}
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
.noScoreline {
  border-top: 1px solid #ccc;
  height: 1px;
  margin: 0 80px;
}
</style>
<style lang="less">
.cell-pre-line .cell {
  white-space: pre-line;
  width: 42px;
  font-size: 12px;
  padding: 0 5px;
  margin: 0 auto;
  line-height: 1.5;
}
</style>
