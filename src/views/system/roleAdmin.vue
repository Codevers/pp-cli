<script setup>
import { reactive, ref, computed } from 'vue';
import { ElMessageBox } from 'element-plus';
import usePageHooks from './hooks/roleAdmin';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import { useRoute } from 'vue-router';
import {
  GetMenuApi,
  GetRolePageApi,
  ModifyRoleApi,
  DeleteRoleApi,
  CreateRoleApi,
  GetRoleDetailApi,
  RoleHasUserApi
} from './api';
const route = useRoute();
const dialogVisible = ref(false);
const operationFlag = ref(true);
const formRef = ref(null);
const treeRef = ref(null);
const searchFormRef = ref(null);
const treeDefaultKeys = ref([]);

const { tableColumn } = usePageHooks();
const searchForm = reactive({
  roleName: ''
});
const searchMenuForm = reactive({
  menuName: '',
  status: 0
});
const createForm = reactive({
  model: {
    roleName: '',
    remarks: '',
    permission: []
  },
  rules: {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
    permission: [{ required: true, message: '请选择菜单权限', trigger: 'change' }]
  }
});
const treeSelectProps = {
  label: 'menuName',
  remarks: 'remarks'
};

const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, GetRolePageApi);

const { data: menuDataSource, run: getMenuData } = useRequest(() => GetMenuApi(searchMenuForm), {
  deepData: true
});

const { run: createRow } = useRequest(CreateRoleApi, {
  manual: true,
  msgTxt: ['创建成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});

const { run: modifyRow } = useRequest(ModifyRoleApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    dialogVisible.value = false;
    isSuccess && searchTable();
  }
});

const { run: deleteRow } = useRequest(DeleteRoleApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});

const { run: getRoleDetail } = useRequest(GetRoleDetailApi, {
  manual: true,
  onSuccess: ({ data }) => {
    createForm.model = data;
    // 因为父与子的关联关系，勾选keys需过滤掉父id，保证联动关系
    const firstLevelIds = menuDataSource.value
      .filter((i) => i.children.length && i.menuId)
      .map((i) => i.menuId);
    const childIds = data.permission.filter((i) => firstLevelIds.every((ii) => ii !== i));
    treeRef.value?.setCheckedKeys(childIds || []);
  }
});
const { run: RoleHasUser } = useRequest(RoleHasUserApi, {
  manual: true,
  onSuccess: ({ data }, isSuccess, { success, params }) => {
    console.log('data', data);
    if (!data) return deleteRow({ id: params.id });
    ElMessageBox.confirm('该角色已被用户绑定，是否继续删除？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteRow({ id: params.id });
    });
  }
});
const dialogTitle = computed(() => {
  return operationFlag.value ? '创建角色' : '编辑角色';
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

function handleCheckChange(a, b) {
  const { checkedKeys, halfCheckedKeys } = b;
  const allKeys = [...checkedKeys, ...halfCheckedKeys];
  treeDefaultKeys.value = allKeys;
  createForm.model.permission = allKeys;
  formRef.value.validateField('permission', () => (allKeys.length ? null : true));
}
// 打开创建弹窗
function createRowRecord() {
  getMenuData();
  dialogVisible.value = true;
  operationFlag.value = true;
  formRef.value?.resetFields();
  treeRef.value?.setCheckedKeys([]);
}
// 编辑行
function editRowRecord(id) {
  getMenuData();
  dialogVisible.value = true;
  operationFlag.value = false;
  formRef.value?.resetFields();
  getRoleDetail({ id });
}
</script>

<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <!-- 数据查询 -->
      <el-form inline :model="searchForm" ref="searchFormRef" class="auto-flex-form" @submit.native.prevent
        @keyup.enter.native="searchTable">
        <el-row :gutter="30">
          <el-col :span="5">
            <el-form-item label="角色名称" prop="userName">
              <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" />
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
        <el-button type="primary" @click="createRowRecord(formRef)">创建角色</el-button>
      </div>
      <el-table-next class="main-table" :column="tableColumn" :data="dataSource" border v-loading="tableLoading">
        <template #operations="{ row }">
          <el-button link type="primary" size="small" @click="editRowRecord(row.roleId)">
            编辑
          </el-button>
          <el-popconfirm title="确定删除该角色吗？" @confirm="RoleHasUser({ id: row.roleId })" width="">
            <template #reference>
              <el-button link type="danger" size="small">删除</el-button>
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
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="createForm.model.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="createForm.model.remarks" maxlength="250" show-word-limit placeholder="请输入备注"
          type="textarea" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permission">
        <el-tree style="height: 500px; overflow: auto; width: 100%" ref="treeRef" :data="menuDataSource" show-checkbox
          :check-strictly="false" @check="handleCheckChange" default-expand-all node-key="menuId" highlight-current
          check-on-click-node :props="treeSelectProps">
          <template #default="{ node, data }">
            <span>
              <span>{{ node.label }}</span>
              <span class="node-remarks" v-if="data.remarks">说明：{{ data.remarks }}）</span>
            </span>
          </template>
        </el-tree>
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
<style lang="less" scoped>
.node-remarks {
  color: #d0d0d0;
  margin-left: 30px;
}
</style>
