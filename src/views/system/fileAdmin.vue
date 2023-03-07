<script setup>
import { reactive, ref, computed } from 'vue';
import usePageHooks from './hooks/fileAdmin';
import { ElMessage } from 'element-plus';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { useRoute } from 'vue-router';
import { ruleOnlyNumber, ruleNumber } from '@/config/reg-validate';
import {
  GetFilePageApi,
  GetFileDetailApi,
  CreateFileApi,
  ModifyFileApi,
  DeleteFileApi,
  GetDictionaryApi,
  CheckFileQuoteApi
} from './api';
const route = useRoute();
const dialogVisible = ref(false);
const operationFlag = ref(true);
const formRef = ref(null);
const searchFormRef = ref(null);
const { tableColumn } = usePageHooks();
const searchForm = reactive({
  group: '',
  fileName: ''
});
const suffixOptions = ['pdf', 'jpg', 'png', 'xls', 'xlsx', 'doc', 'docx'];
const createForm = reactive({
  model: {
    group: '',
    groupName: '',
    fileName: '',
    suffix: [],
    maxSize: '',
    maxNum: '',
    isRequired: false,
    remarks: ''
  },
  rules: {
    group: [
      {
        required: true,
        validator: validateGroup,
        trigger: 'change'
      }
    ],
    fileName: [{ required: true, message: '请输入附件名称', trigger: 'change' }],
    suffix: [
      { required: true, message: '请输入格式', trigger: 'change' },
      {
        validator: validSuffix,
        trigger: 'change'
      }
    ],
    maxSize: [
      {
        required: true,
        message: '请输入最大(K)',
        trigger: 'change'
      },
      {
        validator: (r, v, cb) =>
          ruleOnlyNumber.rule.test(v) ? cb() : cb(new Error(ruleOnlyNumber.tip))
      }
    ],
    maxNum: [
      {
        required: true,
        message: '请输入最大数量',
        trigger: 'change'
      },
      {
        validator: (r, v, cb) => (ruleNumber.rule.test(v) ? cb() : cb(new Error(ruleNumber.tip)))
      }
    ]
  }
});

function validateGroup(rule, value, callback) {
  if (!value && !createForm.model.groupName) return callback('请选择分组或创建分组');
  callback();
}
function validSuffix(rule, value, callback) {
  for (let item of value) {
    const reg = /\s+/g;
    const reg2 = /^[a-z]+$/i;
    if (reg.test(item)) return callback(new Error('格式不可包含空格'));
    if (!reg2.test(item)) return callback(new Error('格式仅支持英文字母'));
  }
  callback();
}
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, GetFilePageApi);

const { run: createRow } = useRequest(CreateFileApi, {
  manual: true,
  msgTxt: ['创建附件成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});
const { run: modifyRow } = useRequest(ModifyFileApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});
const { run: deleteRow } = useRequest(DeleteFileApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});
const { run: checkRecordQuote } = useRequest(CheckFileQuoteApi, {
  manual: true,
  onSuccess: ({ data }, isSuccess, { params }) => {
    if (data === 1) return ElMessage.error('删除失败！关联活动尚未结束，不可删除');
    deleteRow({ id: params.id, usedStatus: data });
  }
});
const { run: getFileDetail } = useRequest(GetFileDetailApi, {
  manual: true,
  onSuccess: ({ data }) => {
    createForm.model = data;
    createForm.model.suffix = createForm.model.suffix.split(',');
  }
});

const dialogTitle = computed(() => {
  return operationFlag.value ? '创建附件' : '编辑附件';
});

// 新建记录
function submitRowRecord() {
  formRef?.value?.validate((valid) => {
    if (valid) {
      const params = { ...createForm.model, suffix: createForm.model.suffix.toString() };
      if (operationFlag.value) {
        createRow(params);
      } else {
        modifyRow(params);
      }
    }
  });
}
const { data: groupOptions, run: getGroupOptions } = useRequest(
  () => GetDictionaryApi({ category: 4 }),
  {
    deepData: true
  }
);

// 打开创建弹窗
function createRowRecord() {
  dialogVisible.value = true;
  operationFlag.value = true;
  createForm.model.groupName = '';
  formRef.value?.resetFields();
  getGroupOptions();
}

// 编辑行
function editRowRecord(id) {
  dialogVisible.value = true;
  operationFlag.value = false;
  formRef.value?.resetFields();
  getGroupOptions();
  getFileDetail({
    id
  });
}
</script>

<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <!-- 数据查询 -->
      <el-form inline :model="searchForm" ref="searchFormRef" class="auto-flex-form" @keyup.enter.native="searchTable">
        <el-row :gutter="30">
          <el-col :span="5">
            <el-form-item label="分组" prop="group">
              <el-select v-model="searchForm.group" placeholder="请选择分组">
                <el-option :label="item.value" :value="item.key" v-for="item in groupOptions" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="附件名称" prop="fileName">
              <el-input v-model="searchForm.fileName" placeholder="请输入附件名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button type="primary" @click="searchTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 查询内容 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">{{ route?.meta?.title }}</div>
        <el-button type="primary" @click="createRowRecord()">创建附件</el-button>
      </div>
      <el-table-next class="main-table" :column="tableColumn" :data="dataSource" border v-loading="tableLoading">
        <template #operations="{ row }">
          <el-button type="primary" size="small" link @click="editRowRecord(row.id)">
            编辑
          </el-button>
          <el-popconfirm title="确定删除该附件吗？" @confirm="checkRecordQuote({ id: row.id })" width="">
            <template #reference>
              <el-button type="danger" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
  </el-container>
  <!-- 弹窗：创建/编辑用户 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="700" center>
    <el-form :model="createForm.model" ref="formRef" label-width="110px" label-position="right" :rules="createForm.rules"
      status-icon @keyup.enter.native="submitRowRecord">
      <el-form-item label="分组" prop="group" v-if="operationFlag !== 1">
        <el-row :gutter="10" style="width: 102%">
          <el-col :span="operationFlag ? 11 : 24">
            <el-select placeholder="请选择分组" clearable style="width: 100%" v-model="createForm.model.group">
              <el-option :label="item.value" :value="item.key" v-for="item in groupOptions" />
            </el-select>
          </el-col>
          <template v-if="operationFlag">
            <el-col :span="2">
              <div style="text-align: center">或</div>
            </el-col>
            <el-col :span="11">
              <el-input v-model="createForm.model.groupName" clearable placeholder="请创建分组" />
            </el-col>
          </template>
        </el-row>
      </el-form-item>
      <el-form-item label="附件名称" prop="fileName">
        <el-input v-model="createForm.model.fileName" clearable placeholder="请输入附件名称" />
      </el-form-item>
      <el-form-item label="格式" prop="suffix">
        <el-select v-model="createForm.model.suffix" multiple filterable allow-create default-first-option
          :reserve-keyword="false" style="width: 100%" placeholder="请选择格式，或输入并回车创建新格式">
          <el-option v-for="item in suffixOptions" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="最大(K)" prop="maxSize">
        <el-input v-model="createForm.model.maxSize" maxlength="10" />
      </el-form-item>
      <el-form-item label="最大数量" prop="maxNum">
        <el-input v-model="createForm.model.maxNum" maxlength="2" />
      </el-form-item>
      <el-form-item label="是否必传" prop="isRequired">
        <el-radio-group v-model="createForm.model.isRequired">
          <el-radio :label="true" border>是</el-radio>
          <el-radio :label="false" border>否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="说明" prop="remarks">
        <el-input v-model="createForm.model.remarks" clearable placeholder="请输入说明" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer-right">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRowRecord">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped lang="less">
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
