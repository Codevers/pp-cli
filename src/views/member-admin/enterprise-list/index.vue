<!-- 企业信息列表 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import {
  getEnterpriselist,
  getEnterpriseExcel,
  getDictionary,
  GetRegionApi,
  enterprisePasswordReset,
  SyncCompanyApi
} from '@/api/member-admin.js';
import enterpriseInfo from '@/components/enterprise-info/index.vue';
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
    label: '企业名称',
    prop: 'companyName',
    align: 'center',
    slotName: 'companyName'
  },
  {
    label: '统一社会信用代码',
    prop: 'code',
    align: 'center',
    width: 200
  },
  {
    label: '所在地市',
    prop: 'region',
    align: 'center',
    width: 150
  },
  {
    label: '法人',
    prop: 'corp',
    align: 'center',
    width: 150
  },
  {
    label: '法人手机号码',
    prop: 'legalPersonTel',
    align: 'center',
    width: 150
  },
  {
    label: '联系人',
    prop: 'techLead',
    align: 'center',
    width: 150
  },
  {
    label: '固定电话',
    prop: 'fixedTelephoneNumb',
    align: 'center',
    width: 120
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
  // {
  //   label: '信用等级',
  //   prop: 'creditRating',
  //   align: 'center',
  //   width: 150,
  //   formatter: (row) => {
  //     if (row.creditRating) {
  //       return row.creditRating == 1
  //         ? 'AAA'
  //         : row.creditRating == 2
  //         ? 'AA'
  //         : row.creditRating == 3
  //         ? 'A'
  //         : row.creditRating == 4
  //         ? 'B'
  //         : '';
  //     }
  //   }
  // },
  {
    label: '操作',
    width: 100,
    fixed: 'right',
    slotName: 'operations'
  }
];
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const state = reactive({
  searForm: {
    companyName: '',
    code: '',
    region: '',
    corp: '',
    techLead: '',
    entryTimeS: '',
    entryTimeE: '',
    creditRating: '',
    time: []
  },

  detailDialog: false,
  regionData: [],
  creditData: []
});

const { searForm, detailDialog, regionData, creditData } = toRefs(state);
const searFormRef = ref(ElForm);
const editRowId = ref('');
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, getEnterpriselist);

//获得所在市数据
const { run: regionFun } = useRequest(GetRegionApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      state.regionData = data.data[11].children;
    }
  }
});

//获得信用等级
const { run: creditFun } = useRequest(getDictionary, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    state.creditData = data.data;
  }
});

// 重置密码
const { run: passwordReset } = useRequest(enterprisePasswordReset, {
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

//企业信息同步
const { run: syncCompany } = useRequest(SyncCompanyApi, {
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
  creditFun({ category: 1 });
});

//查询
const onSubmit = () => {
  state.searForm.entryTimeS =
    state.searForm.time && state.searForm.time && state.searForm.time[0]
      ? state.searForm.time[0]
      : '';
  state.searForm.entryTimeE =
    state.searForm.time && state.searForm.time && state.searForm.time[1]
      ? state.searForm.time[1]
      : '';
  searchTable();
};
//重置
const resetQuery = () => {
  searFormRef?.value?.resetFields();
  state.searForm.entryTimeS = '';
  state.searForm.entryTimeE = '';
  searchTable();
};
//导出
const { run: exportFun } = useRequest(getEnterpriseExcel, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});
const exportData = () => {
  state.searForm.entryTimeS =
    state.searForm.time && state.searForm.time[0] ? state.searForm.time[0] : '';
  state.searForm.entryTimeE =
    state.searForm.time && state.searForm.time[1] ? state.searForm.time[1] : '';
  exportFun(searForm.value);
};

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
          <el-col :span="8">
            <el-form-item label="企业名称" prop="companyName">
              <el-input v-model="searForm.companyName" maxlength="50" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="信用等级" prop="creditRating">
              <el-select v-model="searForm.creditRating">
                <el-option
                  :label="item.value"
                  :value="item.sortIndex"
                  v-for="item in creditData"
                  :key="item.sortIndex"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item label="统一社会信用代码" prop="code">
              <el-input v-model="searForm.code" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入会时间" prop="time">
              <el-date-picker
                v-model="searForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :editable="false"
                :unlink-panels="true"
                :default-time="defaultTime"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="法人" prop="corp">
              <el-input v-model="searForm.corp" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="techLead">
              <el-input v-model="searForm.techLead" maxlength="50" />
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
        <div class="main-title">企业信息列表</div>
        <el-button type="primary" @click="syncCompany">企业信息同步</el-button>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        class="main-table"
        border
        v-loading="tableLoading"
      >
        <template #companyName="{ row }">
          <span @click="detail(row)" style="color: #409eff; cursor: pointer">
            {{ row.companyName }}
          </span>
        </template>
        <template #operations="{ row }">
          <el-popconfirm
            placement="top"
            width=""
            title="确定重置该企业密码吗？"
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

    <el-dialog v-model="detailDialog" destroy-on-close title="企业信息" center width="50%">
      <enterpriseInfo :id="editRowId" v-if="detailDialog" />
    </el-dialog>
  </el-container>
</template>

<style scoped lang="less">
.operationBtn {
  width: 100%;
  text-align: right;
}
</style>
