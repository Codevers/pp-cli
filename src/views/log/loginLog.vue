<!--
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-22 13:45:39
 * @LastEditTime: 2022-08-24 17:24:52
-->
<script setup>
import { ref, reactive, toRefs } from 'vue';
import { Menu as IconMenu, Download } from '@element-plus/icons-vue';
import useTableColumn from './tableColumn/loginLog';
import usePagination from '@/hooks/use-pagination';
import { useGetLoginLogApi } from './api';
const searchFormRef = ref(null);
const dialogVisible = ref(false);
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const formInline = reactive({
  loginName: '',
  ip: '',
  loginTime: '',
  loginTimeStart: '',
  loginTimeEnd: ''
});
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10
});
const {
  dataSource,
  page,
  loading,
  total,
  handlePageChange,
  run: searchTable
} = usePagination(formInline, useGetLoginLogApi);
const { tableColumn } = useTableColumn();
const pageChange = (params) => {
  handlePageChange(params);
  params.value = { ...params };
  console.log('params', params);
};
const resetForm = () => {
  searchFormRef?.value?.resetFields();
  formInline.loginTimeStart = '';
  formInline.loginTimeEnd = '';
  searchTable();
};
const createTechnical = () => {
  dialogVisible.value = true;
};
const setDialogVisible = (isTrue) => {
  dialogVisible.value = isTrue;
};
const changeTime = (value) => {
  console.log('loginTime', formInline.loginTime);
  if (formInline.loginTime) {
    formInline.loginTimeStart = value[0] ? value[0] : '';
    formInline.loginTimeEnd = value[1] ? value[1] : '';
  } else {
    formInline.loginTimeStart = '';
    formInline.loginTimeEnd = '';
  }
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
        ref="searchFormRef"
        :model="formInline"
        class="form-inline"
        label-width="100px"
        @keyup.enter.native="searchTable"
      >
        <el-form-item label="账号" prop="loginName">
          <el-input v-model="formInline.loginName" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="formInline.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="日志时间" prop="loginTime">
          <el-date-picker
            v-model="formInline.loginTime"
            type="datetimerange"
            range-separator="至"
            :editable="false"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item class="search-btns">
          <el-button type="primary" @click="searchTable">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询内容 -->
    <div class="main-table-content">
      <el-table-next :column="tableColumn" :data="dataSource" border max-height="650">
        <template #loginStatus="{ row }">
          <el-tag :type="row.loginStatusKey ? 'success' : 'danger'">{{ row.loginStatus }}</el-tag>
        </template>
      </el-table-next>
      <Pagination @pageChange="pageChange" :total="total" :page="page" />
    </div>
  </div>
</template>

<style scoped lang="less"></style>
