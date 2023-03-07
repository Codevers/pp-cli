<!-- 协会会员信息 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import useRequest from '@/hooks/use-request';
import {
  getMemberList,
  getMemberExcel,
  GetRegionApi,
  passwordResetApi,
  SyncPersonApi
} from '@/api/member-admin.js';
import usePagination from '@/hooks/use-pagination';
import enterpriseTable from '@/components/enterprise-user/index.vue';
import { downloadFileByBlob } from '@/utils/tools';
const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号'
  },
  {
    prop: 'memberShipNum',
    width: '100',
    label: '会员编号'
  },
  {
    label: '姓名',
    prop: 'name',
    align: 'center',
    width: 200,
    slotName: 'name'
  },
  {
    label: '所在地市',
    prop: 'region',
    align: 'center',
    width: 150
  },
  {
    label: '从业单位',
    prop: 'unit',
    align: 'center'
  },
  {
    label: '身份证号',
    prop: 'idCard',
    align: 'center',
    width: 200
  },
  {
    label: '联系电话',
    prop: 'phone',
    align: 'center',
    width: 180
  },
  {
    label: '会员类型',
    prop: 'memberType',
    align: 'center',
    width: 150
  },
  {
    label: '入会时间',
    prop: 'entryTime',
    align: 'center',
    width: 110,
    formatter: (row) => {
      let entryTime = row.entryTime != null ? row.entryTime.slice(0, 10) : ' ';
      return entryTime;
    }
  },
  {
    label: '操作',
    width: 100,
    fixed: 'right',
    slotName: 'operations'
  }
];
const state = reactive({
  searForm: {
    name: '',
    idCard: '',
    region: '',
    phone: ''
  },

  tableData: [],
  detailDialog: false,
  regionData: []
});
const { tableData, searForm, detailDialog, regionData } = toRefs(state);
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, getMemberList);

const { run: regionFun } = useRequest(GetRegionApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      state.regionData = data.data[11].children;
    }
  }
});
// 重置密码
const { run: passwordReset } = useRequest(passwordResetApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (data?.success) {
      ElMessage.success('重置成功');
      searchTable();
    } else {
      ElMessage.error(data?.msg);
    }
  }
});

// 人员信息同步
const { run: syncPersonFun } = useRequest(SyncPersonApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (data?.success) {
      ElMessage.success('同步成功');
      searchTable();
    } else {
      ElMessage.error(data?.msg);
    }
  }
});

onMounted(() => {
  regionFun({ level: 3 });
});

const searFormRef = ref(ElForm);
//查询
const onSubmit = () => {
  searchTable();
};
//重置
const resetQuery = () => {
  searFormRef?.value?.resetFields();
  searchTable();
};
//导出
const { run: exportFun } = useRequest(getMemberExcel, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});
const exportData = () => {
  exportFun(searForm.value);
};
const editRowId = ref('');
const detail = (row) => {
  editRowId.value = row.id;
  state.detailDialog = true;
};
//重置密码
const restPassword = (row) => {
  passwordReset({ id: row.id });
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
            <el-form-item label="姓名" prop="name">
              <el-input v-model="searForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="searForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="searForm.idCard" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="所在市" prop="region">
              <el-select v-model="searForm.region">
                <el-option
                  :label="item.label"
                  :value="item.cityCode"
                  v-for="item in regionData"
                  :key="item.cityCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" plain @click="exportData">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">人员信息列表</div>
        <el-button type="primary" @click="syncPersonFun">人员信息同步</el-button>
      </div>

      <el-table-next
        :column="column"
        :data="dataSource"
        class="main-table"
        border
        v-loading="tableLoading"
      >
        <template #name="{ row }">
          <span @click="detail(row)" style="color: #409eff; cursor: pointer">
            {{ row.name }}
          </span>
        </template>
        <template #operations="{ row }">
          <el-popconfirm
            placement="top"
            width=""
            title="确定重置该人员密码吗？"
            @confirm="restPassword(row)"
          >
            <template #reference>
              <el-button link type="primary">重置</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
    <el-dialog v-model="detailDialog" destroy-on-close title="个人信息" center width="50%">
      <enterpriseTable :id="editRowId" v-if="detailDialog" />
    </el-dialog>
  </el-container>
</template>

<style scoped lang="less"></style>
