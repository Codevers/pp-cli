<!-- 系统公告列表 -->
<script setup>
import { reactive, toRefs, ref, onUpdated } from 'vue';
import { ElForm } from 'element-plus';
import { useRequest } from 'v3hooks';
import usePagination from '@/hooks/use-pagination';
import { userPageList, noticeApi } from '@/api/wel.js';
import { useRouter } from 'vue-router';
import { downloadFileByBlob } from '@/utils/tools';

const router = useRouter();

const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号'
  },
  {
    label: '通知公告名称',
    prop: 'title',
    align: 'center',
    slotName: 'title'
    // showOverflowTooltip: true
  },
  {
    label: '发布部门',
    prop: 'issuer',
    align: 'center'
  },
  {
    label: '发布时间',
    prop: 'time',
    align: 'center',
    width: 220
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
    name: '',
    isRead: ''
  }
});
const { searForm } = toRefs(state);
const searFormRef = ref(ElForm);
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, userPageList);
//查询
const onSearch = () => {
  searchTable();
};
//重置
const resetQuery = () => {
  searFormRef.value.resetFields();
  searchTable();
};

//导出
const { run: exportFun } = useRequest(noticeApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});
const exportData = () => {
  exportFun(searForm.value);
};
//查看
function lock(row) {
  router.push({
    path: '/wel/announcement/lock-announcement',
    query: { id: row.id }
  });
  document.querySelector('.el-table')?.querySelector('.el-popper')?.remove?.();
}

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
        label-width="auto"
        ref="searFormRef"
        class="auto-flex-form"
        @keyup.enter.native="onSearch"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="通知公告名称" prop="name">
              <el-input v-model="searForm.name" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否已读" prop="isRead">
              <el-select v-model="searForm.isRead">
                <el-option label="已读" :value="true" />
                <el-option label="未读" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" plain @click="exportData">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">系统公告列表</div>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        class="main-table"
        border
        v-loading="tableLoading"
      >
        <template #title="{ row }">
          <div style="width: 100%; display: flex">
            <div style="margin-right: 10px">
              <el-tag class="ml-2" type="success" v-if="row.isRead">已读</el-tag>
              <el-tag class="ml-2" type="danger" v-else>未读</el-tag>
            </div>
            <div class="title" :title="row.title" @click="lock(row)">
              {{ row.title }}
            </div>
          </div>
        </template>
        <template #action="{ row }">
          <el-button link type="primary" size="small" @click="lock(row)">查看</el-button>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
  </el-container>
</template>

<style scoped lang="less">
.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 85%;
  cursor: pointer;
  color: #409eff;
  text-align: left;
}
</style>
