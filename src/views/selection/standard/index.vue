<script setup>
import { reactive, ref, computed } from 'vue';
import loadsh from 'loadsh';
import StandardPreview from './component/StandardPreview.vue';
import { useRoute, useRouter } from 'vue-router';
import usePageHooks from './hooks';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { downloadFileByBlob } from '@/utils';
import { ElMessageBox } from 'element-plus';
import {
  GetStandardPageApi,
  CreateStandardApi,
  DeleteStandardApi,
  ModifyStandardApi,
  GetStandardDetailApi,
  CopyStandardApi,
  EnableStandardApi,
  ExportStandardApi,
  DisableStandardApi
} from './api';
const route = useRoute();
const { tableColumn } = usePageHooks();
const dialogVisible = ref(false);
const operationFlag = ref(true);
const previewRef = ref(null);
const formRef = ref(null);
const searchFormRef = ref(null);
const router = useRouter();
const searchForm = reactive({
  name: '',
  enabled: undefined
});
const createForm = reactive({
  model: {
    name: '',
    description: ''
  },
  rules: {
    name: [{ required: true, message: '请输入认定标准名称', trigger: 'blur' }]
  }
});
const statusOptions = [
  {
    key: '启用',
    value: true
  },
  {
    key: '未启用',
    value: false
  }
];
const dialogTitle = computed(() => {
  return operationFlag.value ? '新增认定标准' : '编辑认定标准';
});

const cloneCreateForm = reactive({
  model: loadsh.cloneDeep(createForm.model)
});

const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, GetStandardPageApi);

const { run: createRow } = useRequest(CreateStandardApi, {
  manual: true,
  msgTxt: ['创建认定标准成功'],
  onSuccess: async (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      const data = await searchTable();
      router.push({
        name: '/selection/standard/setStandard',
        query: { id: data[0].id, title: data[0].name }
      });
    }
  }
});
const { run: modifyRow } = useRequest(ModifyStandardApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});
const { run: exportExcel } = useRequest(() => ExportStandardApi(searchForm), {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});
const { run: deleteRow } = useRequest(DeleteStandardApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});
const { run: getStandardDetail } = useRequest(GetStandardDetailApi, {
  manual: true,
  onSuccess: ({ data }, isSuccess, { params }) => {
    const { name, standardId } = params;
    if (data.readOnly) {
      openPreview({ name, id: standardId });
    } else {
      router.push({
        name: '/selection/standard/setStandard',
        query: { id: standardId, title: name }
      });
    }
  }
});
const { run: enableRow } = useRequest(EnableStandardApi, {
  manual: true,
  msgTxt: ['启用成功！您可在认定活动中选择该标准。'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});
const { run: disableRow } = useRequest(DisableStandardApi, {
  manual: true,
  msgTxt: ['禁用成功！'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});

const { run: copyRow } = useRequest(CopyStandardApi, {
  manual: true,
  msgTxt: ['复制成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});
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

// 打开创建弹窗
function createRowRecord() {
  dialogVisible.value = true;
  operationFlag.value = true;
  createForm.model = cloneCreateForm.model;
  formRef.value?.resetFields();
}
// 编辑行
function editRowRecord({ id, name, standardDescription }) {
  dialogVisible.value = true;
  operationFlag.value = false;
  formRef.value?.resetFields();
  createForm.model.name = name;
  createForm.model.description = standardDescription;
  createForm.model.id = id;
}
// 编辑认定标准明细
function editStandardDetail({ id, name }) {
  getStandardDetail({ standardId: id, name });
}

function openPreview({ name, id }) {
  previewRef.value.open({
    name,
    id
  });
}
// 关闭确认
function closeConfirm(done) {
  const { description, name } = createForm.model;
  if (description || name) {
    ElMessageBox.confirm('您即将关闭本页面，已填写的信息将无法保存，是否继续关闭？', {
      confirmButtonText: '确认',
      cancelButtonText: '不，我再想想',
      type: 'warning'
    }).then(() => {
      dialogVisible.value = false;
      done && done();
    });
  } else {
    dialogVisible.value = false;
  }
}
</script>

<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <!-- 数据查询 -->
      <el-form
        inline
        :model="searchForm"
        ref="searchFormRef"
        class="auto-flex-form"
        @keyup.enter.native="searchTable"
      >
        <el-row :gutter="30">
          <el-col :span="5">
            <el-form-item label="认定标准名称" prop="name">
              <el-input v-model="searchForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="enabled">
              <el-select v-model="searchForm.enabled">
                <el-option :label="item.key" :value="item.value" v-for="item in statusOptions" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button type="primary" @click="searchTable">查询</el-button>
              <el-button type="primary" @click="exportExcel">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <!-- 查询内容 -->
    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">{{ route?.meta?.title }}</div>
        <el-button type="primary" @click="createRowRecord">新增认定标准</el-button>
      </div>
      <el-table-next
        class="main-table"
        :column="tableColumn"
        :data="dataSource"
        border
        row-key="menuId"
        v-loading="tableLoading"
      >
        <template #name="{ row }">
          <el-button type="primary" link @click="openPreview(row)">
            {{ row.name }}
          </el-button>
        </template>
        <template #enabled="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'danger'">
            {{ row.enabled ? '启用' : '未启用' }}
          </el-tag>
        </template>
        <template #isRefer="{ row }">
          <el-tag :type="row.isRefer ? '' : 'info'">
            {{ row.isRefer ? '是' : '否' }}
          </el-tag>
        </template>

        <template #operations="{ row }">
          <el-button
            link
            :type="row.enabled ? 'danger' : 'primary'"
            size="small"
            :disabled="row.enabled && !row.canBeDisable"
            @click="
              row.enabled && row.canBeDisable
                ? disableRow({ id: row.id })
                : enableRow({ id: row.id })
            "
          >
            {{ row.enabled ? '禁用' : '启用' }}
          </el-button>
          <el-button link type="primary" size="small" @click="copyRow({ id: row.id })">
            复制
          </el-button>
          <el-button link type="primary" size="small" @click="editStandardDetail(row)">
            认定标准明细
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="editRowRecord(row)"
            :disabled="!row.canBeEdit"
          >
            编辑
          </el-button>
          <el-popconfirm title="确定删除该标准吗？" @confirm="deleteRow({ id: row.id })" width="">
            <template #reference>
              <el-button link type="primary" size="small" :disabled="!row.canBeDelete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
  </el-container>
  <!-- 弹窗：创建/编辑用户 -->
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="700"
    center
    :before-close="closeConfirm"
  >
    <el-form
      :model="createForm.model"
      ref="formRef"
      label-width="110px"
      label-position="right"
      :rules="createForm.rules"
      status-icon
      @keyup.enter.native="submitRowRecord"
    >
      <el-form-item label="认定标准名称" prop="name">
        <el-input v-model="createForm.model.name" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="认定标准说明" prop="description">
        <el-input v-model="createForm.model.description" maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer-right">
        <el-button @click="closeConfirm()">取消</el-button>
        <el-button type="primary" @click="submitRowRecord">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <StandardPreview ref="previewRef"></StandardPreview>
</template>
