<!--
 * @Description:
 * @Author: wangsy
 * @Date: 2022-08-10 11:17:39
-->
<script setup>
import { onMounted, reactive, ref, toRefs, watchEffect } from 'vue';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import useTableColumn from './tableColumn';
import { downloadFileByBlob } from '@/utils/tools';
import { ElMessageBox, ElMessage } from 'element-plus';
import { getRegion, getActivitysByType, getCountByType } from '@/api/common';
import { STATUS_4 } from '@/config/dic-options';
import {
  getEnterprisePage,
  pushWithdrawApi,
  batchWithdrawalApi,
  updateScoreApi,
  getPersonPage,
  getPersonExcel,
  getEntExcel
} from './api';
import { useRouter } from 'vue-router';
const router = useRouter();
const { entColumn, personColumn } = useTableColumn();
const searchFormRef = ref(null);
const selectOptions = ref([]);
const activitys = ref([]);
const count = ref(null);
const anHuiRegion = ref([]);
const provinceGrade = ref(0); //修改的分数
const isRepeat = ref(false);
const editRow = ref(0); //是否在修改行分数
const isRowPush = ref(false); //是否行操作
const declareType = ref(1);
const searchForm = reactive({
  city: null,
  activity: '',
  company: '',
  person: '',
  isPublicity: false,
  min: null,
  max: null
});
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10
});
//获取认定活动下拉
const { run: getActivityList } = useRequest(getActivitysByType, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      activitys.value = data.data;
      searchForm.activity = activitys.value && activitys.value[0]?.id;
      searchTable();
      getCount();
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
//获取认定活动数量
const { run: getCount } = useRequest(getCountByType, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      count.value = data.data;
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
watchEffect(() => {
  getActivityList({ category: declareType.value, type: 10 });
});
const {
  dataSource: entData,
  loading: entLoading,
  total: entTotal,
  page: entPage,
  handlePageChange: handleEntPageChange,
  run: searchEntTable
} = usePagination(searchForm, getEnterprisePage, {
  manual: true
});
const {
  dataSource: personData,
  loading: personLoading,
  total: personTotal,
  page: personPage,
  handlePageChange: handlePersonPageChange,
  run: searchPersonTable
} = usePagination(searchForm, getPersonPage, {
  manual: true
});
//获取安徽行政区域
const { run: getAnHuiRegion } = useRequest(getRegion, {
  manual: true,
  onSuccess: (data) => {
    data?.success ? (anHuiRegion.value = data?.data[0]?.children) : ElMessage.error(data?.msg);
  }
});

onMounted(() => {
  getAnHuiRegion({ province: '340000', level: '2' });
  getCount({ type: 10 });
});
const exportExcel = () =>
  declareType.value === 2
    ? downloadPersonFile({ ...pagination.value, ...searchForm })
    : downloadEntFile({ ...pagination.value, ...searchForm });

const { run: downloadPersonFile } = useRequest(getPersonExcel, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});
const { run: downloadEntFile } = useRequest(getEntExcel, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});
//修改分数
const modifyGrade = (row) => {
  editRow.value = editRow.value + 1;
  if (editRow.value > 1) {
    ElMessage.warning('请先保存或取消正在进行的行操作！');
    return;
  }
  provinceGrade.value = row.provinceGrade;
  row.isEdit = true;
};
const cancelEdit = (row) => {
  editRow.value = 0;
  row.isEdit = false;
};
//保存分数
const saveGrade = (row) => {
  useRequest(updateScoreApi, {
    defaultParams: [{ id: row.id, grade: provinceGrade.value, type: 2 }], //1：市，2：省
    onSuccess: (data) => {
      if (data?.success) {
        if (data?.data) {
          ElMessage.success('修改成功！');
          editRow.value = 0;
          row.isEdit = false;
          declareType.value === 1 ? searchEntTable() : searchPersonTable();
        } else {
          ElMessage.error(data?.msg);
        }
      } else {
        ElMessage.error(data?.msg);
      }
    }
  });
};
const handleSelectionChange = (selection) => {
  selectOptions.value = [];
  selection.length > 0 &&
    selection.forEach((item) => {
      selectOptions.value.push(item.id);
    });
  isRepeat.value = selection.some((item) => item.isPublicity);
};
//区分搜索列表
const searchTable = () => {
  if (declareType.value === 1) {
    searchEntTable();
    entData?.length > 0 &&
      entData.map((item) => {
        return { ...item, isEdit: false };
      });
  } else {
    searchPersonTable();
    personData?.length > 0 &&
      personData.map((item) => {
        return { ...item, isEdit: false };
      });
  }
};

const pageChange = (params) => {
  declareType.value === 2 ? handlePersonPageChange(params) : handleEntPageChange(params);
  pagination.value = params;
  console.log(pagination.value);
};
const open = () => {
  if (!selectOptions.value.length) {
    ElMessage({
      type: 'warning',
      message: '公示推选失败！您未选择任何数据，无法推选。'
    });
  } else if (isRepeat.value) {
    isRowPush.value = true;
    ElMessage({
      type: 'warning',
      message: '公示推选失败，您勾选的数据包含已推选的，不能重复推选。'
    });
  } else {
    ElMessageBox.confirm(`您即将公示推选${selectOptions.value.length}条数据，请确认是否推选？`, {
      confirmButtonText: '确认',
      cancelButtonText: '不，我再想想',
      type: 'warning'
    })
      .then(() =>
        toBatchWithdrawal({ ids: selectOptions.value, type: 2, activityId: searchForm.activity })
      )
      .catch(() => {
        isRowPush.value = false;
        console.log('已取消');
      });
  }
};

const { run: toBatchWithdrawal } = useRequest(batchWithdrawalApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data?.data) {
        ElMessage.success(isRowPush.value ? '批量公示推选成功!' : '省公示推选成功!');
        declareType.value === 1 ? searchEntTable() : searchPersonTable();
        isRowPush.value = false;
      } else {
        ElMessage.error(data?.msg);
      }
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
//跳转资料预览页面
const goPreview = (row) => {
  const selection = declareType.value;
  router.push({
    path: '/dataAudit/index',
    query: {
      // id: searchForm.activity,
      // taskId: declareType.value === 2 ? row?.personId : row?.companyId,
      id: row.id,
      taskId: row.taskId,
      type: false,
      flag: true,
      selection
    }
  });
};
const { run: toPushWithdraw } = useRequest(pushWithdrawApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data?.data) {
        ElMessage.success('撤回成功！');
        declareType.value === 1 ? searchEntTable() : searchPersonTable();
      } else {
        ElMessage.error(data?.msg);
      }
    } else {
      ElMessage.error(data?.msg);
    }
  }
});

const resetForm = () => {
  if (!searchForm) return;
  searchFormRef.value.resetFields();
  searchForm.max = null;
  searchForm.min = null;
  searchForm.activity = activitys.value.length && activitys.value[0]?.id;
  declareType.value === 1 ? searchEntTable() : searchPersonTable();
};
const changeTabs = (num) => {
  declareType.value = num;
  resetForm();
};
toRefs(pagination);
</script>
<template>
  <el-container class="main-content">
    <div class="header-tabs">
      <div :class="declareType === 1 && 'selected'" @click="changeTabs(1)">
        企业认定（{{ count?.enterpriseActivityCount }}）
      </div>
      <div :class="declareType === 2 && 'selected'" @click="changeTabs(2)">
        个人认定（{{ count?.personActivityCount }}）
      </div>
    </div>
    <el-header class="main-form-head" style="margin-bottom: 0">
      <!-- 数据查询 -->
      <el-form
        inline
        :model="searchForm"
        ref="searchFormRef"
        label-width="25%"
        @keyup.enter.native="searchTable"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="认定活动" prop="activity">
              <el-select v-model="searchForm.activity" :clearable="false">
                <el-option :label="item.name" :value="item.id" v-for="item in activitys" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在市" prop="city">
              <el-select v-model="searchForm.city">
                <el-option :label="item.label" :value="item.value" v-for="item in anHuiRegion" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="declareType === 1">
            <el-form-item label="认定对象" prop="company">
              <el-input v-model="searchForm.company" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="declareType === 2">
            <el-form-item label="认定对象" prop="person">
              <el-input v-model="searchForm.person" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="declareType === 2">
            <el-form-item label="认定对象从业单位" prop="company" label-width="140px">
              <el-input v-model="searchForm.company" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否已推选公示" prop="isPublicity">
              <el-select v-model="searchForm.isPublicity" placeholder="请选择">
                <el-option :label="item.value" :value="item.key" v-for="item in STATUS_4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="省终评分" prop="numArr">
              <div class="flex">
                <div class="from">
                  <el-input-number
                    :min="0"
                    :precision="2"
                    :controls="false"
                    placeholder="最小值"
                    v-model="searchForm.min"
                  ></el-input-number>
                </div>
                <div class="center">
                  <span>至</span>
                </div>
                <div class="to">
                  <el-input-number
                    :min="searchForm.min"
                    :precision="2"
                    :controls="false"
                    placeholder="最大值"
                    v-model="searchForm.max"
                  ></el-input-number>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="declareType === 2 ? 24 : 8">
            <div class="search-btns">
              <el-button type="primary" @click="searchTable">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" plain @click="exportExcel">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 查询内容 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">省认定结果列表</div>
        <el-button type="primary" @click="open">公示推选</el-button>
      </div>
      <el-table-next
        class="main-table"
        :column="declareType === 2 ? personColumn : entColumn"
        :data="declareType === 2 ? personData : entData"
        border
        height="100%"
        v-loading="declareType === 2 ? personLoading : entLoading"
        current-row-key="id"
        @selection-change="handleSelectionChange"
      >
        <template #company="{ row }" v-show="declareType === 1">
          <el-link :underline="false" type="primary" @click="goPreview(row)">
            {{ row.company }}
          </el-link>
        </template>
        <template #person="{ row }" v-show="declareType === 2">
          <el-link :underline="false" type="primary" @click="goPreview(row)">
            {{ row.person }}
          </el-link>
        </template>
        <template #selfGrade="{ row }">
          <span>{{ Number(row.selfGrade).toFixed(2) }}</span>
        </template>
        <template #cityGrade="{ row }">
          <span>{{ Number(row.cityGrade).toFixed(2) }}</span>
        </template>
        <template #technicalGrade="{ row }">
          <span>{{ Number(row.technicalGrade).toFixed(2) }}</span>
        </template>
        <template #provinceGrade="{ row }">
          <el-row>
            <el-col :span="12" v-show="!row.isEdit">
              <span>{{ Number(row.provinceGrade).toFixed(2) }}</span>
            </el-col>
            <el-col :span="12" v-show="row.isEdit" class="isEdit">
              <el-tooltip
                effect="dark"
                :content="`最高分仅允许输入${row.limitGrade}分`"
                placement="top-start"
              >
                <el-input-number
                  :min="0"
                  :max="row.limitGrade"
                  :precision="2"
                  :controls="false"
                  title=""
                  value-on-clear="min"
                  v-model="provinceGrade"
                ></el-input-number>
              </el-tooltip>
            </el-col>
            <el-col :span="12" v-show="!row.isEdit" class="btn-group">
              <el-button link type="primary" size="small" @click="modifyGrade(row)">修改</el-button>
            </el-col>
            <el-col :span="12" v-show="row.isEdit" class="btn-group">
              <el-button link type="primary" size="small" icon="" @click="saveGrade(row)">
                保存
              </el-button>
              <el-button link type="primary" size="small" icon="" @click="cancelEdit(row)">
                取消
              </el-button>
            </el-col>
          </el-row>
        </template>
        <template #operations="{ row }">
          <el-button
            link
            :type="row.isPublicity ? 'info' : 'primary'"
            :disabled="row.isPublicity || row.isEdit"
            size="small"
            @click="
              toBatchWithdrawal({ ids: Array.of(row.id), type: 2, activityId: searchForm.activity })
            "
          >
            公示推选
          </el-button>
          <el-popconfirm
            title="确定撤回该公示推选吗？"
            @confirm="toPushWithdraw({ id: row.id, type: 2 })"
          >
            <template #reference>
              <el-button
                link
                :type="!row.isPublicity ? 'info' : 'primary'"
                :disabled="!row.isPublicity || row.isEdit"
                size="small"
              >
                撤回
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination
        @pageChange="pageChange"
        :total="declareType === 2 ? personTotal : entTotal"
        :page="declareType === 2 ? personPage : entPage"
      />
    </el-main>
  </el-container>
</template>

<style scoped lang="less">
.btn-group {
  justify-content: center;
  align-items: center;
  display: flex;
}
.isEdit {
  .el-input-number {
    width: 80px;
  }
}
.from {
  width: 40%;
  .el-input-number {
    width: 100%;
  }
}
.to {
  width: 40%;
  .el-input-number {
    width: 100%;
  }
}
.el-form-item {
  width: 100%;
  margin-right: 10px;
  .el-select {
    width: 100%;
  }
}
.search-btns {
  text-align: right;
}
.flex {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  .center {
    margin: auto 3%;
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
    font-size: 15px;
    cursor: pointer;
    &.selected {
      border-top: 4px solid #007ffd;
      background-color: #fff;
      color: #007ffd;
    }
  }
}
</style>
