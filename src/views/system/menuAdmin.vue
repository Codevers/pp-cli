<script setup>
import { reactive, ref, computed } from 'vue';
import { ElMessageBox } from 'element-plus';
import { STATUS_1 } from '@/config/dic-options';
import usePageHooks from './hooks/menuAdmin';
import useRequest from '@/hooks/use-request';
import { INDEX_DIR_KEY } from '@/enums/cacheEnum';
import { useRoute } from 'vue-router';
import { View as ViewIcon } from '@element-plus/icons-vue';
import { ruleOnlyNumber } from '@/config/reg-validate';
import {
  CreateMenuApi,
  DeleteMenuApi,
  EnableMenuApi,
  ModifyMenuApi,
  GetMenuApi,
  GetMenuDetailApi,
  MenuHasRoleApi
} from './api';
const svgIcons = import.meta.glob('/src/assets/svg/aside/**/*.svg');
const route = useRoute();
const { tableColumn } = usePageHooks();
const dialogVisible = ref(false);
const operationFlag = ref(1);
const formRef = ref(null);
const searchFormRef = ref(null);
const systemIcons = ref([]);
const treeSelectProps = {
  label: 'menuName'
};
const statusOptions = [
  {
    key: '全部',
    value: 0
  },
  {
    key: '启用',
    value: 1
  },
  {
    key: '禁用',
    value: 2
  }
];

const searchForm = reactive({
  menuName: '',
  status: 1
});

const createForm = reactive({
  model: {
    parentMenuId: '',
    menuName: '',
    path: '',
    component: '',
    icon: '',
    sortIndex: '',
    remarks: '',
    status: 1,
    ignoreRoute: true
  },
  rules: {
    menuName: [{ required: true, message: '请输入菜单名称', trigger: 'change' }],
    component: [{ required: false, message: '请输入组件地址', trigger: 'change' }],
    sortIndex: [
      {
        required: false,
        trigger: 'change'
      },
      {
        validator: (r, v, cb) =>
          ruleOnlyNumber.rule.test(v) ? cb() : cb(new Error(ruleOnlyNumber.tip))
      }
    ]
  }
});

const dialogTitle = computed(() => {
  return operationFlag.value === 1
    ? '创建一级菜单'
    : operationFlag.value === 2
    ? '编辑菜单'
    : '添加子菜单';
});

const {
  data: dataSource,
  loading: tableLoading,
  run: searchTable
} = useRequest(() => GetMenuApi(searchForm), {
  deepData: true
});

const { run: createRow } = useRequest(CreateMenuApi, {
  manual: true,
  msgTxt: ['创建成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});

const { run: modifyRow } = useRequest(ModifyMenuApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
      searchTable();
    }
  }
});

const { run: getMenuDetail } = useRequest(GetMenuDetailApi, {
  manual: true,
  onSuccess: ({ data }) => {
    createForm.model = data;
  }
});

const { run: deleteRow } = useRequest(DeleteMenuApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});

const { run: enableRow } = useRequest(EnableMenuApi, {
  manual: true,
  msgTxt: ['禁用成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && searchTable();
  }
});

const { run: MenuHasRole } = useRequest(MenuHasRoleApi, {
  manual: true,
  onSuccess: ({ data }, isSuccess, { success, params }) => {
    if (!data) return deleteRow({ id: params.id });
    ElMessageBox.confirm('该菜单已被角色绑定，是否继续删除？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteRow({ id: params.id });
    });
  }
});

function reloadSvgIcon() {
  const keys = Object.keys(svgIcons);
  keys.forEach((i) => {
    const routePath = i.replace('/src/assets/svg/', '').replace('/', '-').replace('.svg', '');
    systemIcons.value.push({
      name: routePath
    });
  });
}
reloadSvgIcon();
// 新建记录
function submitRowRecord() {
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
  getMenuDetail({ id });
}

// 添加子菜单
function addRowRecordChild(id) {
  dialogVisible.value = true;
  operationFlag.value = 3;
  formRef.value?.resetFields();
  // 设置当前父菜单
  createForm.model.parentMenuId = id;
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
            <el-form-item label="菜单名称" prop="userName" style="width: 100%">
              <el-input v-model="searchForm.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status" style="width: 100%">
              <el-select v-model="searchForm.status" placeholder="请选择状态" :clearable="false">
                <el-option :label="item.key" :value="item.value" v-for="item in statusOptions" />
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
        <el-button type="primary" @click="createRowRecord(formRef)">创建一级菜单</el-button>
      </div>
      <el-table-next
        class="main-table"
        :column="tableColumn"
        :data="dataSource"
        border
        default-expand-all
        row-key="menuId"
        v-loading="tableLoading"
      >
        <template #isEnabled="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <template #icon="{ row }">
          <SvgIcon :name="row.icon" size="16"></SvgIcon>
        </template>

        <template #operations="{ row }">
          <el-button type="primary" size="small" @click="editRowRecord(row.menuId)" link>
            编辑
          </el-button>
          <el-button
            type="primary"
            size="small"
            link
            v-if="!row.component.startsWith(INDEX_DIR_KEY)"
            @click="addRowRecordChild(row.menuId)"
          >
            添加子菜单
          </el-button>
          <el-popconfirm
            :title="`确定${row.status === 1 ? '禁用' : '启用'}该菜单吗？`"
            width=""
            @confirm="enableRow({ id: row.menuId })"
          >
            <template #reference>
              <el-button type="warning" size="small" link>
                {{ row.status === 1 ? '禁用' : '启用' }}
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            title="确定删除该菜单吗？"
            @confirm="MenuHasRole({ id: row.menuId })"
            width=""
          >
            <template #reference>
              <el-button type="danger" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
    </el-main>
  </el-container>
  <!-- 弹窗：创建/编辑用户 -->
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
      <el-form-item label="上层菜单" prop="parentMenuId" v-if="operationFlag !== 1">
        <el-tree-select
          v-model="createForm.model.parentMenuId"
          :data="dataSource"
          :props="treeSelectProps"
          :render-after-expand="false"
          check-strictly
          default-expand-all
          node-key="menuId"
          show-checkbox
          check-on-click-node
          placeholder="请选择父菜单"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="createForm.model.menuName" />
      </el-form-item>
      <el-form-item label="组件地址" prop="component">
        <el-input
          v-model="createForm.model.component"
          placeholder="请输入组件地址，将解析该地址并生成路由地址"
        />
      </el-form-item>
      <el-form-item label="路由地址" prop="path" placeholder="请输入路由地址，可作为组件地址的别名">
        <el-input v-model="createForm.model.path" />
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="createForm.model.icon">
          <template #append>
            <el-popover placement="bottom-end" :width="400" trigger="click">
              <template #reference>
                <el-button :icon="ViewIcon" />
              </template>
              <SystemIcons
                :currentName="createForm.model.icon"
                @selectIcon="(name) => (createForm.model.icon = name)"
              />
            </el-popover>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="顺序号" prop="sortIndex">
        <el-input v-model="createForm.model.sortIndex" />
      </el-form-item>
      <el-form-item label="说明" prop="remarks">
        <el-input v-model="createForm.model.remarks" show-word-limit type="textarea" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="createForm.model.status">
          <el-radio :label="item.value" border v-for="item in STATUS_1">{{ item.key }}</el-radio>
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
<style lang="less">
.custom-tree-index {
  .el-table__placeholder {
    display: block !important;
  }
}
</style>
