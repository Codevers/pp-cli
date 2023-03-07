<!--
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-22 13:45:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-08-24 17:33:16
-->
<script setup>
import { ref, reactive, toRefs } from 'vue';
import { Menu as IconMenu, Download } from '@element-plus/icons-vue';
import useTableColumn from './tableColumn/operationLog';
import usePagination from '@/hooks/use-pagination';
import { useGetLogApi } from './api';
const searchForm = ref(null);
const dialogVisible = ref(false);
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const formInline = reactive({
  accountId: '',
  ip: '',
  operationTime: '',
  operationTimeS: '',
  operationTimeE: ''
});
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10
});
// const { run: toGetLog } = useGetLogApi({
//   onSuccess: (data, isSuccess) => {
//     isSuccess ? (question.value = data?.data) : ElMessage.error(data?.msg);
//   }
// });
const {
  dataSource,
  page,
  loading,
  total,
  handlePageChange,
  run: searchTable
} = usePagination(formInline, useGetLogApi);
const { tableColumn } = useTableColumn();
const pageChange = (params) => {
  handlePageChange(params);
  params.value = { ...params };
  console.log('params', params);
};
const onSubmit = () => {
  console.log('submit!');
};
const resetForm = () => {
  if (!searchForm) return;
  searchForm?.value?.resetFields();
  formInline.operationTimeS = '';
  formInline.operationTimeE = '';
  searchTable();
};
const createTechnical = () => {
  dialogVisible.value = true;
};
const setDialogVisible = (isTrue) => {
  dialogVisible.value = isTrue;
};
const changeOperationTime = (value) => {
  formInline.operationTimeS = value[0] ? value[0] : '';
  formInline.operationTimeE = value[1] ? value[1] : '';
  console.log('value', value);
};
// 分页导航
const handleCurrentChange = (val) => {
  pageIndex.value = val;
};
//切换分页条数
const handleSizeChange = (val) => {
  pageSize.value = val;
};
const { pageIndex, pageSize } = toRefs(pagination);
</script>
<template>
  <div class="main-content">
    <div class="main-form-head">
      <el-form
        :inline="true"
        ref="searchForm"
        :model="formInline"
        class="form-inline"
        label-width="100px"
        @keyup.enter.native="searchTable"
      >
        <el-form-item label="账号" prop="accountId">
          <el-input v-model="formInline.accountId" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="formInline.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="日志时间" prop="operationTime">
          <el-date-picker
            v-model="formInline.operationTime"
            type="datetimerange"
            range-separator="至"
            :editable="false"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            @change="changeOperationTime"
          />
        </el-form-item>
        <el-form-item class="search-btns">
          <el-button type="primary" @click="searchTable">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-table-content">
      <el-table-next
        :column="tableColumn"
        :data="dataSource"
        border
        max-height="650"
      ></el-table-next>
      <Pagination @pageChange="pageChange" :total="total" :page="page" />
    </div>
  </div>
</template>

<style scoped lang="less"></style>
