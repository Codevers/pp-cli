<!--
 * @Description:
 * @Author: wangsy
 * @Date: 2022-08-10 11:17:39
-->
<script setup>
import { reactive, ref, watchEffect, toRefs, h, onMounted } from 'vue';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import useTableColumn from './tableColumn';
import { downloadFileByBlob } from '@/utils/tools';
import { ElMessageBox, ElMessage } from 'element-plus';
import {
  getEnterprisePage,
  getPersonPage,
  publicityInfo,
  getEntExcel,
  getPersonExcel,
  getPublicityCount
} from './api';
import { GetRegionApi, getActivitysByType, getCountByType } from '@/api/common';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
const router = useRouter();
const { entColumn, personColumn } = useTableColumn();
const declareType = ref(1);
const activitys = ref([]);
const count = ref(null);
const anHuiRegion = ref([]);
const searchFormRef = ref(null);
const publicityCount = ref(null);
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const searchForm = reactive({
  city: null,
  activity: '',
  company: ''
});
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10
});
const publicityForm = reactive({
  publicTime: '',
  publicStartTime: '',
  publicEndTime: ''
});
//获取认定活动下拉
const { run: getActivityList } = useRequest(getActivitysByType, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      activitys.value = data.data;
      searchForm.activity = activitys.value && activitys.value[0]?.id;
      searchTable();
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
watchEffect(() => {
  getActivityList({ category: declareType.value, type: 11 });
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
const { run: getAnHuiRegion } = useRequest(GetRegionApi, {
  manual: true,
  onSuccess: (data) => {
    data?.success ? (anHuiRegion.value = data?.data[0]?.children) : ElMessage.error(data?.msg);
  }
});
//获取公示数量
const { run: getCount } = useRequest(getPublicityCount, {
  manual: true,
  onSuccess: (data) => {
    publicityCount.value = data.data;
  }
});
//获取认定活动数量
const { run: getActivityCount } = useRequest(getCountByType, {
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
  getAnHuiRegion({ province: '340000', level: '2' });
  getActivityCount({ type: 11 });
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
  getCount({ ...searchForm, category: declareType.value });
};
const pageChange = (params) => {
  declareType.value === 2 ? handlePersonPageChange(params) : handleEntPageChange(params);
  pagination.value = params;
  console.log(pagination.value);
};
const open = () => {
  if (publicityForm.publicTime) {
    publicityCount.value
      ? ElMessageBox.confirm(
          h('p', null, [
            h('span', null, `您即将公示${publicityCount.value}条数据，`),
            h('br'),
            h(
              'span',
              null,
              `公示期为：${dayjs(publicityForm.publicStartTime).format('YYYY-MM-DD')} 至 ${dayjs(
                publicityForm.publicEndTime
              ).format('YYYY-MM-DD')}`
            ),
            h('br'),
            h('span', null, '请确认是否公示？')
          ]),
          {
            confirmButtonText: '确认',
            cancelButtonText: '不，我再想想',
            type: 'warning'
          }
        )
          .then(() =>
            toBatchWithdrawal({ ...publicityForm, ...searchForm, category: declareType.value })
          )
          .catch(() => {
            console.log('已取消');
          })
      : ElMessage({
          type: 'warning',
          message: '暂无未公示的数据。'
        });
  } else {
    ElMessage({
      type: 'warning',
      message: '您没有选择公示时间，无法公示。'
    });
  }
};
const { run: toBatchWithdrawal } = useRequest(publicityInfo, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data?.data) {
        ElMessage.success('公示成功，可至外网公示页面查看！');
        declareType.value === 1 ? searchEntTable() : searchPersonTable();
      } else {
        ElMessage.error(data?.msg);
      }
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
const changePublicTime = (value) => {
  publicityForm.publicStartTime = value[0] ? value[0] : '';
  publicityForm.publicEndTime = value[1] ? value[1] : '';
  console.log('value', value);
};

const resetForm = () => {
  if (!searchForm) return;
  searchFormRef.value.resetFields();
  searchForm.activity = activitys.value.length && activitys.value[0]?.id;
  declareType.value === 1 ? searchEntTable() : searchPersonTable();
};
const changeTabs = (num) => {
  declareType.value = num;
  publicityForm.publicTime = '';
  publicityForm.publicEndTime = '';
  publicityForm.publicStartTime = '';
  resetForm();
};
toRefs(pagination, publicityForm);
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
              <el-input v-model="searchForm.person" />
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
          <el-col :span="declareType === 2 ? 16 : 24">
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
        <div class="main-title">公示信息列表</div>
        <div class="main-operation">
          <el-form inline :model="publicityForm">
            <el-form-item label="公示日期" prop="company">
              <el-date-picker
                v-model="publicityForm.publicTime"
                type="daterange"
                range-separator="至"
                start-placeholder="公示开始时间"
                end-placeholder="公示结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                :default-time="defaultTime"
                @change="changePublicTime"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="open">外网公示</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table-next
        class="main-table"
        height="100%"
        :column="declareType === 2 ? personColumn : entColumn"
        :data="declareType === 2 ? personData : entData"
        border
        v-loading="declareType === 2 ? personLoading : entLoading"
        current-row-key="id"
      >
        <template #provinceGrade="{ row }">
          <el-col>
            <span>{{ Number(row.provinceGrade).toFixed(2) }}</span>
          </el-col>
        </template>
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
.main-operation {
  .el-form-item {
    margin: 0 0 0 32px;
  }
}
.main-form-head {
  .el-form-item {
    width: 100%;
    margin-right: 10px;
    .el-select {
      width: 100%;
    }
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
