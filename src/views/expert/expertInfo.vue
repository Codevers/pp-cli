<!--
 * @Description:
 * @Autor: wsy
 * @Date: 2022-07-22 13:45:39
 * @LastEditTime: 2022-09-16 15:39:39
-->
<script setup>
import { ref, reactive, computed, watchEffect, watch } from 'vue';
import { useRequest } from 'v3hooks';
import { Menu as IconMenu, Download } from '@element-plus/icons-vue';
import { mobilePhone, identity } from '@/utils/regExp';
import { ElMessage } from 'element-plus';
import useTableColumn from './tableColumn/exportInfo';
import usePagination from '@/hooks/use-pagination';
import { downloadFileByBlob } from '@/utils/tools';
import {
  getProfessionalPage,
  useCreateProfessionalApi,
  useStopUseingApi,
  useGetExcelApi,
  useUpdateProfessionalApi,
  useUploadFilesApi,
  getOrganizationList,
  getDicApi,
  resetPasswordApi
} from './api';
import { useUserStore } from '@/store/modules/user';
import { appStoreWithOut } from '@/store/modules/app';
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const { tableColumn } = useTableColumn();
const searchFormRef = ref(null);
const dialogVisible = ref(false);
const createMode = ref('');
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10
});
//获取字典
const { data: majorList } = useRequest(() => getDicApi({ category: 2 }), {
  deepData: true, //定义这个字段直接获取response.data
  formatResult: (res) => res.data
});
const { data: companyTypeList } = useRequest(() => getDicApi({ category: 3 }), {
  deepData: true, //定义这个字段直接获取response.data
  formatResult: (res) => res.data
});

let defaultOptions = {
  educationList: [
    { label: '中专', value: 0 },
    { label: '大专', value: 1 },
    { label: '本科', value: 2 },
    { label: '研究生', value: 3 }
  ],
  sexList: [
    { label: '男', value: 0 },
    { label: '女', value: 1 }
  ]
};
const technicalFormRef = ref(null);
let formData = reactive({
  technicalForm: {
    name: '',
    sex: '',
    companyType: '',
    major: '',
    technical: '',
    idCard: '',
    qualification: '',
    companyName: '',
    education: '',
    phone: '',
    qualification: '',
    regionCode: ''
  },
  technicalRules: {
    name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    idCard: [
      { required: true, message: '身份证号不能为空', trigger: 'blur' },
      {
        required: true,
        trigger: ['change', 'blur'],
        validator: (rule, value, callback) => inputChange(rule, value, callback)
      }
    ],
    phone: [
      { required: true, message: '手机号不能为空', trigger: 'blur' },
      {
        pattern: mobilePhone,
        message: '请输入合法手机号',
        trigger: ['change', 'blur']
      }
    ]
  },
  searchForm: {
    name: '',
    sex: '',
    company: '',
    major: '',
    technical: '',
    warehousingTime: [],
    organization: '',
    warehousingTimeS: '',
    warehousingTimeE: '',
    regionCode: ''
  }
});
const {
  userInfo: { regionLevel }
} = useUserStore(); //   regionLevel 1   省  2   市
const {
  dataSource,
  page,
  loading,
  total,
  handlePageChange,
  run: searchTable
} = usePagination(formData.searchForm, getProfessionalPage);
const { run: createTeachnical, loading: createLoading } = useRequest(useCreateProfessionalApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      ElMessage.success(data?.msg);
      dialogVisible.value = false;
      searchTable();
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
const { run: updateTeachnical, loading: updateLoading } = useRequest(useUpdateProfessionalApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      dialogVisible.value = false;
      ElMessage.success('更新成功');
      searchTable();
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
const { data: organizationList } = useRequest(getOrganizationList, {
  initialData: [],
  formatResult: (res) => res.data
});

const { run: runStopUseing } = useRequest(useStopUseingApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      ElMessage.success('操作成功');
      searchTable();
    } else {
      ElMessage.error(data?.msg);
    }
  }
});

const { run: restPasswordFun } = useRequest(resetPasswordApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      ElMessage.success('重置成功');
      searchTable();
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
const onSubmit = () => {
  formData.searchForm.warehousingTimeS =
    formData.searchForm.warehousingTime &&
    formData.searchForm.warehousingTime &&
    formData.searchForm.warehousingTime[0]
      ? formData.searchForm.warehousingTime[0]
      : '';
  formData.searchForm.warehousingTimeE =
    formData.searchForm.warehousingTime &&
    formData.searchForm.warehousingTime &&
    formData.searchForm.warehousingTime[1]
      ? formData.searchForm.warehousingTime[1]
      : '';

  searchTable();
};
const { run: toUploadFile } = useRequest(useUploadFilesApi, {
  manual: true,
  onSuccess: (data) => {
    data?.success ? ElMessage.success('上传成功') : ElMessage.error(data?.msg);
  }
});
const resetForm = () => {
  if (!formData.searchForm) return;
  searchFormRef.value.resetFields();
  formData.searchForm.warehousingTimeE = '';
  formData.searchForm.warehousingTimeS = '';
  searchTable();
};
const dialogTitle = computed(() => {
  return !createMode.value ? '添加专家' : '编辑专家';
});
const createTechnical = () => {
  createMode.value = '';
  dialogVisible.value = true;
};
const editRowRecord = (row) => {
  formData.technicalForm = {
    ...row,
    sex: row?.sexValue
  };
  createMode.value = row.id;
  dialogVisible.value = true;
};
const closeDialog = () => {
  technicalFormRef.value.resetFields();
  formData.technicalForm = {};
  dialogVisible.value = false;
};
const submitDialog = () => {
  technicalFormRef.value.validate(async (valid) => {
    if (valid) {
      !createMode.value
        ? createTeachnical(formData.technicalForm)
        : updateTeachnical({ ...formData.technicalForm, id: createMode.value });
    }
  });
};
const pageChange = (params) => {
  handlePageChange(params);
  pagination.value = { ...params };
};
const stopUseing = (row) => {
  runStopUseing({ id: row.id, operationType: row.status ? 0 : 1 });
};
const restPassword = (row) => {
  restPasswordFun({ id: row.id });
};

const exportExcel = () => downloadFile({ ...formData.searchForm });

const { run: downloadFile } = useRequest(useGetExcelApi, {
  manual: true,
  msgTxt: ['导出成功', '导出失败'],
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});
const inputChange = (rule, value, callback) => {
  if (identity.test(value)) {
    let sexCode = value.substring(16, 17);
    let sex = sexCode % 2 == 1 ? '男' : '女';
    formData.technicalForm.sex = sex;
  } else {
    callback(new Error('请输入合法的身份证号'));
  }
  callback();
};
const beforeUpload = (file) => {
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
  const whiteList = ['xls', 'xlsx'];
  if (whiteList.indexOf(fileSuffix) === -1) {
    ElMessage.error('上传文件只能是xls、xlsx格式。');
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('上传文件大小不能超过2MB。');
    return false;
  }
};
const uploadFile = (options) => {
  let formData = new FormData();
  // 设置参数
  formData.append('file', options.file);
  toUploadFile(formData);
};
const uploadSuccess = () => {
  ElMessage.success('上传成功！');
};
const uploadError = (error) => {
  ElMessage.error(error.message);
};
</script>
<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <el-form
        :inline="true"
        ref="searchFormRef"
        :model="formData.searchForm"
        class="form-inline"
        label-width="100px"
        @keyup.enter.native="onSubmit"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.searchForm.name" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别" prop="sex">
              <el-select
                v-model="formData.searchForm.sex"
                :value="formData.searchForm.sex"
                clearable
              >
                <el-option
                  v-for="item in defaultOptions.sexList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="专业" prop="major">
              <el-select v-model="formData.searchForm.major">
                <el-option
                  v-for="item in majorList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="技术职称" prop="technical">
              <el-input v-model="formData.searchForm.technical" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作单位" prop="company">
              <el-input v-model="formData.searchForm.company" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库时间" prop="warehousingTime">
              <el-date-picker
                v-model="formData.searchForm.warehousingTime"
                type="daterange"
                :editable="false"
                :unlink-panels="true"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                :default-time="defaultTime"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="regionLevel == 1">
            <el-form-item label="所属机构" prop="organization">
              <el-select v-model="formData.searchForm.organization">
                <el-option
                  v-for="item in organizationList"
                  :key="item.id"
                  :label="item.organizationName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="regionLevel == 1">
            <el-form-item label="所在市" prop="regionCode">
              <el-select v-model="formData.searchForm.regionCode">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in appStoreWithOut.getAHCity"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="regionLevel == 1 ? 24 : 12">
            <el-form-item class="search-btns">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" plain @click="exportExcel">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 分页列表 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">专家信息列表</div>
        <div class="main-btns">
          <el-button type="primary" @click="createTechnical">创建认定专家</el-button>
          <el-upload
            class="upload-template"
            action=""
            accept=".xlsx, .xls"
            :show-file-list="false"
            :http-request="uploadFile"
            :limit="1"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :before-upload="beforeUpload"
          >
            <el-button type="primary">导入认定专家</el-button>
          </el-upload>
          <el-button type="primary" @click="onSubmit">
            <el-icon><Download /></el-icon>
            下载导入模板
          </el-button>
        </div>
      </div>
      <el-table-next :column="tableColumn" :data="dataSource" border class="main-table">
        <template #statusValue="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? '启用' : '停用' }}
          </el-tag>
        </template>
        <template #operations="scope">
          <el-button link type="primary" icon="" @click="editRowRecord(scope.row)">编辑</el-button>
          <el-popconfirm
            placement="top"
            :title="`确定${scope.row.status ? '停用' : '启用'}该专家吗？`"
            @confirm="stopUseing(scope.row)"
          >
            <template #reference>
              <el-button link :type="`${scope.row.status ? 'danger' : 'primary'}`">
                {{ scope.row.status ? '停用' : '启用' }}
              </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            placement="top"
            width=""
            title="确定重置该专家密码吗？"
            @confirm="restPassword(scope.row)"
          >
            <template #reference>
              <el-button link type="primary">重置</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination @pageChange="pageChange" :total="total" :page="page" />
    </el-main>
    <!-- 创建、编辑专家信息 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      @close="closeDialog"
      destroy-on-close
      center
      custom-class="technical-dialog"
      :close-on-click-modal="false"
    >
      <el-form
        :inline="true"
        ref="technicalFormRef"
        :model="formData.technicalForm"
        :rules="formData.technicalRules"
        class="technica-form"
        label-width="35%"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="formData.technicalForm.name"
                placeholder="请输入姓名"
                maxlength="100"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input
                v-model="formData.technicalForm.idCard"
                placeholder="请输入身份证号"
                maxlength="18"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-input
                v-model="formData.technicalForm.sex"
                placeholder="请先输入身份证号"
                autocomplete="off"
                maxlength="10"
                :readonly="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历" prop="education">
              <el-select v-model="formData.technicalForm.education" placeholder="请选择学历">
                <el-option
                  v-for="item in defaultOptions.educationList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="formData.technicalForm.phone"
                placeholder="请输入手机号码"
                autocomplete="off"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-select v-model="formData.technicalForm.major" placeholder="请选择专业">
                <el-option
                  v-for="item in majorList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执业资格及注册证号" prop="qualification">
              <el-input
                v-model="formData.technicalForm.qualification"
                placeholder="请输入执业资格及注册证号"
                maxlength="100"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="技术职称" prop="technical">
              <el-input
                v-model="formData.technicalForm.technical"
                placeholder="请输入技术职称"
                maxlength="100"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位类型" prop="companyType">
              <el-select v-model="formData.technicalForm.companyType" placeholder="请选择单位类型">
                <el-option
                  v-for="item in companyTypeList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在单位" prop="companyName">
              <el-input
                v-model="formData.technicalForm.companyName"
                placeholder="请输入所在单位"
                maxlength="100"
                autocomplete="off"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="regionLevel == 1">
            <el-form-item label="所在市" prop="regionCode">
              <el-select v-model="formData.technicalForm.regionCode">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in appStoreWithOut.getAHCity"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitDialog">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<style scoped lang="less">
.form-inline {
  margin: auto 0;
  .el-form-item {
    width: 100%;
    .el-select {
      width: 100%;
    }
  }
  :deep(.search-btns .el-form-item__content) {
    justify-content: end;
  }
}
.technica-form {
  padding-right: 20px;
  margin: auto 0;
  .el-form-item {
    width: 100%;
    .el-select {
      width: 100%;
    }
  }
}
</style>
