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
            <el-form-item label="组织机构名称" prop="userName">
              <el-input v-model="searchForm.organizationName" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="分类" prop="status">
              <el-select v-model="searchForm.category">
                <el-option
                  :label="item.value"
                  :value="item.key"
                  v-for="item in appStoreWithOut.getGlobalDict(5)"
                />
              </el-select>
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
        <el-button type="primary" @click="createRowRecord()">创建组织机构</el-button>
      </div>
      <el-table-next
        class="main-table"
        :column="tableColumn"
        :data="dataSource"
        border
        default-expand-all
        row-key="id"
        v-loading="tableLoading"
      >
        <template #isEnabled="{ row }">
          <el-tag :type="row.isEnabledKey === 1 ? 'success' : 'danger'">
            {{ row.isEnabledKey === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <template #operations="{ row }">
          <el-button type="primary" size="small" link @click="editRowRecord(row.id)">
            编辑
          </el-button>
          <el-button type="primary" size="small" link @click="addRowRecordChild(row.id)">
            添加子级
          </el-button>
          <!-- <el-button link type="primary" size="small" @click="addRowRecordChild(row.menuId)">
            添加子菜单
          </el-button> -->
          <!-- <el-popconfirm title="确定禁用该菜单吗？" @confirm="enableRow({ id: row.menuId })">
            <template #reference>
              <el-button link type="primary" size="small">
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-popconfirm> -->
          <el-popconfirm title="确定删除该机构吗？" @confirm="deleteRow({ id: row.id })" width="">
            <template #reference>
              <el-button type="danger" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
    </el-main>
  </el-container>
  <!-- 弹窗：创建/编辑 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" :width="700" center>
    <el-form
      :model="createForm.model"
      ref="formRef"
      label-width="110px"
      label-position="right"
      :rules="createForm.rules"
      status-icon
      @keyup.enter.native="submitRowRecord"
    >
      <el-form-item label="上级组织" prop="parentId">
        <el-tree-select
          v-model="createForm.model.parentId"
          :data="dataSource"
          :props="treeSelectProps"
          :render-after-expand="false"
          check-strictly
          default-expand-all
          node-key="id"
          show-checkbox
          check-on-click-node
          placeholder="请选择上级组织"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="组织机构名称" prop="organizationName">
        <el-input v-model="createForm.model.organizationName" />
      </el-form-item>
      <el-form-item label="名称" prop="organizationSimpleName">
        <el-input v-model="createForm.model.organizationSimpleName" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="createForm.model.category" style="width: 100%">
          <el-option
            :label="item.value"
            :value="item.key"
            v-for="item in appStoreWithOut.getGlobalDict(5)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="数据权限" prop="dataPermission">
        <el-select v-model="createForm.model.dataPermission" style="width: 100%" multiple>
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in appStoreWithOut.getAHCity"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="区域" prop="region">
        <el-tree-select
          style="width: 100%"
          v-model="createForm.model.region"
          :data="regionList"
          check-strictly
          default-expand-all
          :render-after-expand="false"
          show-checkbox
          check-on-click-node
          placeholder="请选择区域"
        />
      </el-form-item>
      <el-form-item label="状态" prop="isEnabled">
        <el-radio-group v-model="createForm.model.isEnabled">
          <el-radio :label="item.value" v-for="item in STATUS_1" border>{{ item.key }}</el-radio>
        </el-radio-group>
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
<script setup>
import { reactive, ref, computed } from 'vue';
import usePageHooks from './hooks/organizationAdmin';
import useRequest from '@/hooks/use-request';
import { GetRegionApi } from '@/api/common';
import { useRoute } from 'vue-router';
import { appStoreWithOut } from '@/store/modules/app';
import { ElMessage } from 'element-plus';
import {
  GetOrganizationDetailApi,
  ModifyOrganizationApi,
  GetOrganizationPageApi,
  CreateOrganizationApi,
  DeleteOrganizationApi
} from './api';
const route = useRoute();
const { tableColumn } = usePageHooks();
const dialogVisible = ref(false);
const operationFlag = ref(1);
const formRef = ref(null);
const searchFormRef = ref(null);
const STATUS_1 = [
  {
    key: '启用',
    value: true
  },
  {
    key: '禁用',
    value: false
  }
];

const treeSelectProps = {
  label: 'organizationName'
};

const searchForm = reactive({
  organizationName: '',
  category: undefined
});

const createForm = reactive({
  model: {
    parentId: '',
    organizationName: '',
    organizationSimpleName: '',
    category: undefined,
    dataPermission: [],
    region: undefined,
    isEnabled: true
  },
  rules: {
    organizationName: [{ required: true, message: '请输入组织机构名称', trigger: 'change' }],
    organizationSimpleName: [{ required: true, message: '请输入名称', trigger: 'change' }],
    category: [{ required: true, message: '请选择分类', trigger: 'change' }],
    dataPermission: [{ required: true, message: '请选择数据权限', trigger: 'change' }],
    region: [{ required: true, message: '请选择区域', trigger: 'change' }]
  }
});

const dialogTitle = computed(() => {
  return operationFlag.value === 1 ? '创建组织机构' : operationFlag.value === 2 ? '编辑' : '添加';
});

const {
  data: dataSource,
  loading: tableLoading,
  run: searchTable
} = useRequest(() => GetOrganizationPageApi(searchForm), {
  deepData: true
});

const { data: regionList } = useRequest(() => GetRegionApi({ province: 340000, level: 2 }), {
  deepData: true
});

const { run: createRow } = useRequest(CreateOrganizationApi, {
  manual: true,
  msgTxt: ['创建成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});

const { run: modifyRow } = useRequest(ModifyOrganizationApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});

const { run: deleteRow } = useRequest(DeleteOrganizationApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});

const { run: getRowDetail } = useRequest(GetOrganizationDetailApi, {
  manual: true,
  onSuccess: ({ data }, isSuccess) => {
    if (isSuccess) {
      createForm.model = data;
    }
  }
});

// 新建记录
function submitRowRecord() {
  if (createForm.model.parentId === createForm.model.id) {
    return ElMessage.warning('上级组织不可与当前相同');
  }
  formRef?.value?.validate((valid) => {
    if (valid) {
      if (operationFlag.value === 1 || operationFlag.value === 3) {
        createRow(createForm.model);
      }
      if (operationFlag.value === 2) {
        modifyRow(createForm.model);
      }
    }
  });
}

// 打开创建弹窗
function createRowRecord() {
  dialogVisible.value = true;
  operationFlag.value = 1;
  formRef.value?.resetFields();
}
// 编辑行
function editRowRecord(id) {
  dialogVisible.value = true;
  operationFlag.value = 2;
  formRef.value?.resetFields();
  getRowDetail({ id });
}

// 添加子菜单
function addRowRecordChild(id) {
  dialogVisible.value = true;
  operationFlag.value = 3;
  formRef.value?.resetFields();
  // 设置当前父菜单
  createForm.model.parentId = id;
}
</script>
