<!-- 业绩排名 -->
<script setup>
import { ref } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { getListApi, importApi } from './api.js';

const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    label: '企业名称',
    prop: 'enterpriseName',
    align: 'center',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    label: '企业ID',
    prop: 'enterpriseId',
    align: 'center',
    width: 300,
    showOverflowTooltip: true
  },
  {
    label: '年份',
    prop: 'year',
    align: 'center',
    width: 180
  },
  {
    label: '排名',
    prop: 'rank',
    align: 'center',
    width: 180
  },
  {
    label: '加分',
    prop: 'score',
    align: 'center',
    width: 180
  }
];
const searForm = ref({
  enterpriseName: '',
  year: ''
});
const searFormRef = ref(ElForm);
const fileData = ref([]);
//监听文件上传
const handleChange = (uploadFile, uploadFiles) => {
  let testFile = uploadFile.name.substring(uploadFile.name.lastIndexOf('.') + 1).toLowerCase();
  if (!['xlsx'].includes(testFile)) {
    ElMessage.error(`格式不正确，请上传 xlsx 格式文件!`);
    return;
  }

  let file = uploadFile.raw;
  let formData = new FormData();
  formData.append('file', file);
  importApiFun(formData);
};
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, getListApi);

const { run: importApiFun } = useRequest(importApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      ElMessage.success('导入成功');
      searchTable();
    } else {
      ElMessage.error(data?.msg || '导入失败');
    }
  }
});

//查询
const onSubmit = () => {
  searchTable();
};
//重置
const resetQuery = () => {
  searFormRef?.value?.resetFields();
  searchTable();
};
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
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-input v-model.trim="searForm.enterpriseName" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="年份" prop="year">
              <el-date-picker
                v-model="searForm.year"
                type="year"
                value-format="YYYY"
                placeholder="请选择"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <div class="operationBtn">
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button @click="resetQuery">重置</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">业绩排名</div>
        <el-upload
          v-model:file-list="fileData"
          :show-file-list="false"
          accept=".xlsx"
          :auto-upload="false"
          :on-change="handleChange"
          class="upload-demo"
        >
          <el-button type="primary">批量导入</el-button>
        </el-upload>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        class="main-table"
        v-loading="tableLoading"
        border
      ></el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
  </el-container>
</template>

<style scoped lang="less">
.operationBtn {
  width: 100%;
  text-align: right;
}
</style>
