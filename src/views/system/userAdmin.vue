<script setup>
import { reactive, ref, computed } from 'vue';
import loadsh from 'loadsh';
import { STATUS_1 } from '@/config/dic-options';
import usePageHooks from './hooks/userAdmin';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { downloadFileByBlob } from '@/utils/tools';
import { rulePassword, ruleAccount, rulePhone } from '@/config/reg-validate';
import { useRoute } from 'vue-router';
import {
  GetUserApi,
  CreateUserApi,
  EnableUserApi,
  ResetPasswordApi,
  GetRoleListApi,
  ModifyUserApi,
  GetUserDetailApi,
  GetOrganizationListApi,
  ExportUserApi
} from './api';
const route = useRoute();
const dialogVisible = ref(false);
const dialogVisible1 = ref(false);
const operationFlag = ref(true);
const formRef = ref(null);
const formRef2 = ref(null);
const currentUserId = ref('');
const searchFormRef = ref(null);
const { tableColumn } = usePageHooks();

const searchForm = reactive({
  name: undefined,
  account: undefined,
  phone: undefined,
  userRole: undefined,
  userStatus: 1,
  addDate: [],
  addDateStart: undefined,
  addDateEnd: undefined
});
const vxeColumns = ref([
  { field: 'index', width: 50, title: '序号' },
  { field: 'name', title: '用户名称' },
  { field: 'account', title: '登录账号', showHeaderOverflow: true },
  { field: 'phone', title: '手机号', showOverflow: true },
  { field: 'currentCity', title: '组织机构', showOverflow: true },
  { field: 'userRole', title: '用户角色', showOverflow: true },
  { field: 'userStatus', title: '用户状态', showOverflow: true, slots: { default: 'isEnabled' } },
  { field: 'addDate', title: '入库时间', showOverflow: true },
  { field: 'operations', title: '操作', slots: { default: 'operations' } },
])
const dialogTitle = computed(() => {
  return operationFlag.value ? '创建用户' : '编辑用户';
});

const createForm = reactive({
  model: {
    name: '',
    account: '',
    password: '',
    passwordConfirm: '',
    userRole: [],
    currentCity: '',
    phoneBind: '',
    remarks: ''
  },
  rules: {
    name: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
    account: [
      { required: true, message: '请输入登录账号', trigger: 'change' },
      {
        required: true,
        trigger: 'change',
        validator: validateAccount
      }
    ],
    password: [
      {
        required: true,
        trigger: 'change',
        validator: validatePass
      }
    ],
    passwordConfirm: [
      {
        required: true,
        trigger: 'change',
        validator: validatePass2
      }
    ],
    userRole: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
    currentCity: [{ required: true, message: '请选择组织机构', trigger: 'change' }],
    phoneBind: [{ validator: validatePhone, required: false, trigger: 'change' }]
  }
});
function validatePhone(rule, value, callback) {
  if (value && !rulePhone.rule.test(value)) return callback(new Error(rulePhone.tip));
  callback();
}
function validateAccount(rule, value, callback) {
  if (!ruleAccount.rule.test(value)) return callback(new Error(ruleAccount.tip));
  callback();
}
function validatePass(rule, value, callback) {
  if (value === '' || value === undefined) return callback('请输入登录密码');
  if (!rulePassword.rule.test(value)) return callback(new Error(rulePassword.tip));
  if (createForm.model.password !== '') {
    formRef.value && formRef.value.validateField('passwordConfirm', () => null);
  }
  callback();
}
function validatePass2(rule, value, callback) {
  if (value === '' || value === undefined) return callback('请输入确认密码');
  if (!rulePassword.rule.test(value)) return callback(new Error(rulePassword.tip));
  if (value !== createForm.model.password) return callback(new Error('两次密码输入不一致'));
  callback();
}
function validatePassReset(rule, value, callback) {
  if (value === '' || value === undefined) return callback('请输入新密码');
  if (!rulePassword.rule.test(value)) return callback(new Error(rulePassword.tip));
  if (resetPwForm.model.password !== '') {
    formRef.value && formRef.value.validateField('passwordConfirm', () => null);
  }
  callback();
}
function validatePassReset2(rule, value, callback) {
  if (value === '' || value === undefined) return callback('请输入确认密码');
  if (!rulePassword.rule.test(value)) return callback(new Error(rulePassword.tip));
  if (value !== resetPwForm.model.password) return callback(new Error('两次密码输入不一致'));
  callback();
}

const resetPwForm = reactive({
  model: {
    password: '',
    passwordConfirm: ''
  },
  rules: {
    password: [
      {
        required: true,
        validator: validatePassReset
      }
    ],
    passwordConfirm: [
      {
        required: true,
        validator: validatePassReset2
      }
    ]
  }
});

const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, GetUserApi);

const { data: roleList } = useRequest(GetRoleListApi, {
  deepData: true
});

const { run: createRow } = useRequest(CreateUserApi, {
  manual: true,
  msgTxt: ['创建用户成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});
const { run: exportUser } = useRequest(ExportUserApi, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});
const { run: enableRow } = useRequest(EnableUserApi, {
  manual: true,
  msgTxt: ['设置成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});
const { run: modifyRow } = useRequest(ModifyUserApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    dialogVisible.value = false;
    isSuccess && searchTable();
  }
});
const { run: resetPassword } = useRequest(ResetPasswordApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    dialogVisible1.value = false;
    isSuccess && searchTable();
  }
});
const { data: organizationList } = useRequest(GetOrganizationListApi, {
  deepData: true
});
const { run: getUserDetail } = useRequest(GetUserDetailApi, {
  manual: true,
  onSuccess: ({ data }) => {
    createForm.model = data;
  }
});
function handleDataChange(val) {
  searchForm.addDateStart = val[0];
  searchForm.addDateEnd = val[1];
}
// 新建记录
function submitRowRecord() {
  formRef?.value?.validate((valid) => {
    if (valid) {
      if (operationFlag.value) {
        createRow(createForm.model);
      } else {
        modifyRow(createForm.model);
      }
    }
  });
}
function resetSearchForm() {
  searchFormRef.value?.resetFields();
  searchTable();
}
function openResetPw({ userId }) {
  formRef2.value?.resetFields();
  dialogVisible1.value = true;
  currentUserId.value = userId;
}
// 重置密码
function resetUserPw() {
  formRef2?.value?.validate((valid) => {
    if (valid) {
      const password = resetPwForm.model.password;
      resetPassword({ password, id: currentUserId.value });
    }
  });
}
// 打开创建弹窗
function createRowRecord() {
  dialogVisible.value = true;
  operationFlag.value = true;
  formRef.value?.resetFields();
}
// 编辑行
function editRowRecord(id) {
  dialogVisible.value = true;
  operationFlag.value = false;
  formRef.value?.resetFields();
  getUserDetail({
    id
  });
}
</script>

<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <!-- 数据查询 -->
      <el-form :model="searchForm" label-width="80px" ref="searchFormRef" class="auto-flex-form"
        @keyup.enter.native="searchTable">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="用户名称" prop="name">
              <el-input v-model="searchForm.name" />
            </el-form-item>
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="searchForm.account" maxlength="18" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号" prop="phoneBind">
              <el-input maxlength="11" v-model="searchForm.phoneBind" />
            </el-form-item>
            <el-form-item label="用户角色" prop="userRole">
              <el-select v-model="searchForm.userRole">
                <el-option :label="item.roleName" :value="item.id" v-for="item in roleList" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用户状态" prop="userStatus">
              <el-select v-model="searchForm.userStatus">
                <el-option :label="item.key" :value="item.value" v-for="item in STATUS_1" />
              </el-select>
            </el-form-item>
            <el-form-item label="入库时间" prop="addDate">
              <el-date-picker v-model="searchForm.addDate" @change="handleDataChange" type="daterange"
                start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="searchTable">查询</el-button>
              <el-button @click="resetSearchForm">重置</el-button>
              <el-button type="primary" @click="exportUser(searchForm)">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 查询内容 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">{{ route?.meta?.title }}</div>
        <el-button type="primary" @click="createRowRecord(formRef)">创建用户</el-button>
      </div>
      <div class="main-table-body">
        <vxe-grid :columns="vxeColumns" :data="dataSource" :loading="tableLoading" height="auto">
          <template #isEnabled="{ row }">
            <el-tag :type="row.userStatus === '启用' ? 'success' : 'danger'">
              {{ row.userStatus === '启用' ? '启用' : '禁用' }}
            </el-tag>
          </template>
          <template #operations="{ row }">
            <el-button type="primary" size="small" @click="editRowRecord(row.userId)" link>
              编辑
            </el-button>
            <el-button type="primary" size="small" link @click="openResetPw(row)">重置密码</el-button>
            <el-popconfirm :title="`确定${row.userStatus === '启用' ? '禁用' : '启用'}该账号吗？`"
              @confirm="enableRow({ id: row.userId })" width="">
              <template #reference>
                <el-button type="warning" size="small" link>
                  {{ row.userStatus === '启用' ? '禁用' : '启用' }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </vxe-grid>
      </div>


      <!-- <el-table-next class="main-table" :column="tableColumn" :data="dataSource" border v-loading="tableLoading">
                                                                                        <template #isEnabled="{ row }">
                                                                                          <el-tag :type="row.userStatus === '启用' ? 'success' : 'danger'">
                                                                                            {{ row.userStatus === '启用' ? '启用' : '禁用' }}
                                                                                          </el-tag>
                                                                                        </template>
                                                                                        <template #operations="{ row }">
                                                                                          <el-button type="primary" size="small" @click="editRowRecord(row.userId)" link>
                                                                                            编辑
                                                                                          </el-button>
                                                                                          <el-button type="primary" size="small" link @click="openResetPw(row)">重置密码</el-button>
                                                                                          <el-popconfirm :title="`确定${row.userStatus === '启用' ? '禁用' : '启用'}该账号吗？`"
                                                                                            @confirm="enableRow({ id: row.userId })" width="">
                                                                                            <template #reference>
                                                                                              <el-button type="warning" size="small" link>
                                                                                                {{ row.userStatus === '启用' ? '禁用' : '启用' }}
                                                                                              </el-button>
                                                                                            </template>
                                                                                          </el-popconfirm>
                                                                                        </template>
                                                                                      </el-table-next> -->
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
  </el-container>
  <!-- 弹窗：创建/编辑用户 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="700" center>
    <el-form :model="createForm.model" ref="formRef" label-width="110px" label-position="right" :rules="createForm.rules"
      status-icon @keyup.enter.native="submitRowRecord">
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="createForm.model.name" />
      </el-form-item>
      <el-form-item label="登录账号" prop="account">
        <el-input maxlength="20" v-model="createForm.model.account" />
      </el-form-item>
      <el-form-item label="登录密码" prop="password" v-if="operationFlag">
        <el-input v-model="createForm.model.password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm" v-if="operationFlag">
        <el-input v-model="createForm.model.passwordConfirm" />
      </el-form-item>
      <el-form-item label="用户角色" prop="userRole">
        <el-select v-model="createForm.model.userRole" multiple style="width: 100%">
          <el-option :label="item.roleName" :value="item.id" v-for="item in roleList" />
        </el-select>
      </el-form-item>
      <el-form-item label="组织机构" prop="currentCity">
        <el-select v-model="createForm.model.currentCity" placeholder="请选择组织机构" style="width: 100%">
          <el-option :label="item.organizationName" :value="item.id" v-for="item in organizationList" />
        </el-select>
      </el-form-item>
      <el-form-item label="绑定手机号码" prop="phoneBind">
        <el-input v-model="createForm.model.phoneBind" maxlength="11" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="createForm.model.remarks" maxlength="250" type="textarea" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer-right">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRowRecord">
          {{ operationFlag ? '立即创建' : '保存编辑' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 弹窗：重置密码-->
  <el-dialog v-model="dialogVisible1" title="重置密码" :width="600" center>
    <el-form :model="resetPwForm.model" ref="formRef2" label-width="110px" label-position="right"
      :rules="resetPwForm.rules" status-icon @keyup.enter.native="resetUserPw">
      <el-form-item label="新密码" prop="password">
        <el-input v-model="resetPwForm.model.password" placeholder="请输入6至12位字母、数字、符号组成登录密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="passwordConfirm">
        <el-input v-model="resetPwForm.model.passwordConfirm" placeholder="请再次输入6至12位字母、数字、符号组成登录密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer-right">
        <el-button @click="dialogVisible1 = false">取消</el-button>
        <el-button type="primary" @click="resetUserPw">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
