<script setup>
import SearchForm from '../../components/Basic/src/SearchForm.vue';
import BaseTable from '../../components/Basic/src/BaseTable.vue';
import { ref, reactive, toRefs } from 'vue';
const searchForm = ref(null);
const baseTable = ref(null);
const state = reactive({
  baseformList: [
    {
      label: 'name1',
      key: 'aaa1',
      type: 'input',
      itemConfigs: {
        //showWordLimit:true,
        maxlength: 20
      },
      itemEvents: {
        input: (value) => {}
      }
    },
    {
      label: 'name1',
      key: 'aaa2',
      type: 'input',
      itemConfigs: {
        // showWordLimit:true,
        maxlength: 20
      },
      itemEvents: {
        input: (value) => {}
      }
    },
    {
      label: 'name1',
      key: 'aaa3',
      type: 'input',
      itemConfigs: {
        //showWordLimit:true,
        maxlength: 20
      },
      itemEvents: {
        input: (value) => {
          //console.log(value)
        }
      }
    },
    {
      label: 'name1',
      key: 'aaa4',
      type: 'input',
      itemConfigs: {
        //showWordLimit:true,
        maxlength: 20
      },
      itemEvents: {
        input: (value) => {
          //console.log(value)
        }
      }
    },
    {
      label: 'name1',
      key: 'aaa5',
      type: 'input',
      itemConfigs: {
        //showWordLimit:true,
        maxlength: 20
      },
      itemEvents: {
        input: (value) => {
          //console.log(value)
        }
      }
    },
    {
      label: 'name1',
      key: 'aaa6',
      type: 'input',
      itemConfigs: {
        //showWordLimit:true,
        maxlength: 20
      },
      itemEvents: {
        input: (value) => {}
      }
    },
    {
      label: 'name1',
      key: 'aaa7',
      type: 'input',
      itemConfigs: {
        //showWordLimit:true,
        maxlength: 20
      },
      itemEvents: {
        input: (value) => {}
      }
    }
  ],
  rules: {
    aaa: [
      {
        required: true,
        message: '请输入',
        trigger: 'blur'
      }
    ],
    bbbb: [
      {
        required: true,
        message: '请选择***',
        trigger: 'change'
      }
    ]
  },
  columns: [
    {
      prop: 'accountId',
      label: '操作账号',
      width: '130',
      configs: {
        fixed: true
      }
    },
    {
      prop: 'accountRole',
      label: '操作人',
      width: '150'
    },
    {
      prop: 'ip',
      label: 'IP地址',
      width: '150'
    },
    {
      prop: 'ipCity',
      label: 'IP城市',
      width: '150'
    },
    {
      prop: 'browser',
      label: '浏览器',
      width: '150'
    },
    {
      prop: 'system',
      label: '操作系统',
      width: '150'
    },
    {
      prop: 'exception',
      label: '异常类型',
      width: '180'
    },
    {
      prop: 'requestApi',
      label: '请求地址',
      width: '200'
    },
    {
      prop: 'method',
      label: '请求方式',
      width: '150'
    }
  ],
  tableBtns: {
    isNeedOperation: true, //确定是否需要操作列
    btns: [
      {
        type: 'primary',
        label: '编辑',
        size: 'large',
        configs: {
          link: true
        },
        handleClick: (row) => {
          console.log('编辑', row);
        }
      },
      {
        type: 'primary',
        label: '删除',
        size: 'large',
        configs: {
          link: true
        },
        handleClick: (row) => {
          console.log('删除', row);
        }
      }
    ]
  }
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
  // searchForm.value.state.ruleFormRef.value.validate(
  //   (val)=>{
  //   console.log(val)
  // })
  console.log(searchForm.value.state.formData.value); //搜搜表单的值
  console.log(baseTable.value.pagination); //页码页数
};
const refreshTable = () => {
  searchForm.value.state.ruleFormRef.value.resetFields();
};
const { baseformList, rules, columns, tableBtns } = toRefs(state);
</script>
<template>
  <div class="container">
    <div class="search-form">
      <search-form
        :formList="baseformList"
        :rules="rules"
        ref="searchForm"
        :inline="true"
        @search="onSubmit"
        @refresh="refreshTable"
      ></search-form>
    </div>
    <div class="business-table">
      <base-table
        ref="baseTable"
        :tableData="tableData"
        :columns="columns"
        :tableBtns="tableBtns"
      ></base-table>
    </div>
  </div>
</template>
<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  .search-form {
    background-color: #fff;
  }
  .business-table {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
    .icon-menu {
      margin: auto 0;
    }
  }
}
</style>
