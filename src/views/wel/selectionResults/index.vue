<!--
 * @Description:
 * @Author: wangsy
 * @Date: 2022-08-10 11:17:39
-->
<script setup>
import { reactive, ref, watchEffect, toRefs, onMounted } from 'vue';
import usePagination from '@/hooks/use-pagination';
import { useRequest } from 'v3hooks';
import useTableColumn from './tableColumn';
import { downloadFileByBlob } from '@/utils/tools';
import {
  getEnterprisePage,
  getPersonPage,
  getEntExcel,
  getPersonExcel,
  filedInfo,
  closeActivity,
  publicDeclare
} from './api';
import { ElMessageBox, ElMessage } from 'element-plus';
import { SELECTION_RESULT } from '@/config/dic-options';
import { useRouter } from 'vue-router';
import { GetRegionApi, getActivitysByType, getCountByType } from '@/api/common';
const { entColumn, personColumn } = useTableColumn();
const router = useRouter();
const declareType = ref(1);
const activitys = ref([]);
const count = ref(null);
const anHuiRegion = ref([]);
const selectOptions = ref([]);
const isRepeat = ref(false);
const isRowPush = ref(false); //是否行操作
const searchFormRef = ref(null);
const searchForm = reactive({
  city: '',
  type: '',
  company: '',
  result: null,
  activity: ''
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
      declareType.value === 1 ? searchEntTable() : searchPersonTable();
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
onMounted(() => {
  getCount({ type: 12 });
});
watchEffect(() => {
  getActivityList({ category: declareType.value, type: 12 });
});
const handleSelectionChange = (selection) => {
  console.log(selection);
  selectOptions.value = [];
  selection.length > 0 &&
    selection.forEach((item) => {
      selectOptions.value.push(item.id);
    });
  isRepeat.value = selection.some((item) => item.statusKey === 1);
};
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
const { run: getAnHuiRegion } = useRequest(GetRegionApi, {
  manual: true,
  onSuccess: (data) => {
    data?.success ? (anHuiRegion.value = data?.data[0]?.children) : ElMessage.error(data?.msg);
  }
});
onMounted(() => {
  getAnHuiRegion({ province: '340000', level: '2' });
});
const exportExcel = () =>
  declareType.value === 2
    ? downloadPersonFile({ ...pagination.value, ...searchForm })
    : downloadEntFile({ ...pagination.value, ...searchForm });

const { run: downloadPersonFile } = useRequest(getPersonExcel, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});
const { run: downloadEntFile } = useRequest(getEntExcel, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});
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
  declareType === 2 ? handlePersonPageChange(params) : handleEntPageChange(params);
  pagination.value = params;
  console.log(pagination.value);
};
const open = () => {
  if (selectOptions.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请至少选择一条数据。'
    });
  } else if (isRepeat.value) {
    isRowPush.value = true;
    ElMessage({
      type: 'warning',
      message: '归档失败，您选择的数据包含已归档的，不能重复归档。'
    });
  } else {
    ElMessageBox.confirm(`即将归档${selectOptions.value.length}条数据，请确认是否归档？`, {
      confirmButtonText: '确认',
      cancelButtonText: '不，我再想想',
      type: 'warning'
    })
      .then(() => toFiledInfo({ ids: selectOptions.value }))
      .catch(() => {
        isRowPush.value = false;
        console.log('已取消');
      });
  }
};
//活动结束
const close = () => {
  publicDeclareFun({ activityId: searchForm.activity });
};

//校验该活动名下是否还有正在公示的数据
const { run: publicDeclareFun } = useRequest(publicDeclare, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      console.log(data.data.length);
      if (data.data.length) {
        ElMessage({
          type: 'warning',
          message: '当前活动结束失败！当前活动还有正在公示中的数据，不能结束！'
        });
      } else {
        if (searchForm.activity.length > 0) {
          ElMessageBox.confirm(
            '您正在结束当前活动，结束后该活动将不能进行任何操作，请确认是否结束活动？',
            '提示',
            {
              confirmButtonText: '是，结束活动',
              cancelButtonText: '否，我再想想',
              type: 'warning',
              center: true
            }
          )
            .then(() => goClose({ id: searchForm.activity }))
            .catch(() => {
              console.log('已取消');
            });
        } else {
          ElMessage({
            type: 'warning',
            message: '当前未选择活动，请先选择。'
          });
        }
      }
    } else {
      ElMessage.error(data?.msg);
    }
  }
});

//活动结束
const { run: goClose } = useRequest(closeActivity, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data?.data) {
        ElMessage.success('结束活动成功！您可通过认定结果查询相关信息。');
        searchTable();
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
//结果归档
const { run: toFiledInfo } = useRequest(filedInfo, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data?.data) {
        ElMessage.success(isRowPush.value ? '批量归档成功！活动已结束' : '归档成功！活动已结束');
        searchTable();
        isRowPush.value = false;
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
          <el-col :span="8" v-show="declareType === 2">
            <el-form-item label="认定对象" prop="person">
              <el-input v-model="searchForm.person" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="declareType === 1">
            <el-form-item label="认定对象" prop="company">
              <el-input v-model="searchForm.company" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="declareType === 2">
            <el-form-item label="认定对象从业单位" prop="company" label-width="140px">
              <el-input v-model="searchForm.company" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="认定结果" prop="result">
              <el-select v-model="searchForm.result">
                <el-option :label="item.value" :value="item.key" v-for="item in SELECTION_RESULT" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="declareType === 1 ? 16 : 8">
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
        <div class="main-title">认定结果列表</div>
        <div class="main-btns">
          <el-button type="primary" @click="close">活动结束</el-button>
          <el-button type="primary" @click="open">认定归档</el-button>
        </div>
      </div>
      <el-table-next
        class="main-table"
        :column="declareType === 2 ? personColumn : entColumn"
        :data="declareType === 2 ? personData : entData"
        height="100%"
        border
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
        <template #result="{ row }">
          <img v-show="row.resultKey === 1" src="@/assets/img/winPrize.png" alt="" />
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
.el-input-number {
  width: 80px;
}
.el-input {
  width: 100%;
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
