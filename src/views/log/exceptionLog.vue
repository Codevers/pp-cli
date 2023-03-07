<!--
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-22 13:45:39
 * @LastEditors: wsy
 * @LastEditTime: 2022-08-01 10:06:07
-->
<script setup>
import { ref, reactive, toRefs } from 'vue';
import { Menu as IconMenu, Download } from '@element-plus/icons-vue';
// import TechnicalDialog from "./components/TechnicalDialog.vue"
const searchForm = ref(null);
const dialogVisible = ref(false);
const formInline = reactive({
  accountId: '',
  ip: '',
  operationTime: []
});
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10
});
const tableData = {
  pageIndex: 1,
  pageSize: 10,
  totalCount: 12,
  data: [
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    },
    {
      accountId: 'wsy',
      accountRole: '超级管理员',
      ip: '192.168.102.50',
      ipCity: '江苏南京',
      browser: '谷歌浏览器',
      system: 'Windows10',
      requestApi: '/api/Login/GetUserInfo',
      method: 'POST',
      exception: 'InvalidOperationException',
      operationTime: '2022-07-22 15:20:45'
    }
  ]
};
const onSubmit = () => {
  console.log('submit!');
};
const resetForm = () => {
  searchForm?.value?.resetFields();
};
const createTechnical = () => {
  dialogVisible.value = true;
};
const setDialogVisible = (isTrue) => {
  dialogVisible.value = isTrue;
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
  <div class="container">
    <div class="search-form">
      <el-form
        :inline="true"
        ref="searchForm"
        :model="formInline"
        class="form-inline"
        size="large"
        label-width="100px"
        @keyup.enter.native="onSubmit"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="账号" prop="accountId">
              <el-input v-model="formInline.accountId" placeholder="请输入账号" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="IP地址" prop="ip">
              <el-input v-model="formInline.ip" placeholder="请输入IP地址" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日志时间" prop="operationTime">
              <el-date-picker
                v-model="formInline.operationTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="search-btns">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="business-table">
      <!-- <el-row :gutter="20">
            <el-col :span="8" class="icon-menu">
            <el-icon font-size="19px"><icon-menu/></el-icon>
            </el-col>
            <el-col :span="16" class="button-group">
            <el-button type="primary" @click="createTechnical">创建认定专家</el-button>
            <el-button type="primary" @click="onSubmit">导入认定专家</el-button>
            <el-button type="primary" @click="onSubmit"><el-icon><Download/></el-icon>下载导入模板</el-button>
            </el-col>
        </el-row> -->
      <el-table
        :data="tableData?.data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)"
        style="width: 100%"
      >
        <el-table-column type="index" fixed label="序号" width="80" />
        <el-table-column prop="accountId" fixed label="操作账号" width="130" />
        <el-table-column prop="accountRole" label="操作人" width="150" />
        <el-table-column prop="ip" label="IP地址" width="150" />
        <el-table-column prop="ipCity" label="IP城市" width="120" />
        <el-table-column prop="browser" label="浏览器" width="150" />
        <el-table-column prop="system" label="操作系统" width="120" />
        <el-table-column prop="exception" label="异常类型" width="180" />
        <el-table-column prop="requestApi" label="请求地址" width="200" />
        <el-table-column prop="method" label="请求方式" width="130" />
        <el-table-column prop="operationTime" label="操作时间" width="180" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="pageIndex"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :small="small"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  .search-form {
    background-color: #fff;
    .form-inline {
      padding: 20px;
      margin: auto 0;
      .el-form-item {
        margin: 10px;
        width: 100%;
        .el-select--large {
          width: 100%;
        }
        :deep(.el-form-item__content) {
          justify-content: center;
        }
      }
    }
  }
  .business-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
    .button-group {
      text-align: right;
    }
    .el-pagination {
      justify-content: flex-end;
    }
    .icon-menu {
      margin: auto 0;
    }
  }
}
</style>
