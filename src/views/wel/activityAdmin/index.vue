<!-- 认定活动管理 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import useRequest from '@/hooks/use-request';
import usePagination from '@/hooks/use-pagination';

import {
  getActivity,
  delActivity,
  detailActivity,
  excelActivity,
  issueActivity,
  endActivityApi
} from '@/api/wel.js';
import { downloadFileByBlob } from '@/utils/tools';
import { useRoute } from 'vue-router';
import AddDialog from './addDialog.vue';
import LockDialog from './lockDialog.vue';
import StandardPreview from '../../selection/standard/component/StandardPreview.vue';
const route = useRoute();
//处理时间  年与日时分
const getTime = (time) => {
  return time?.slice(0, 16);
};
const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    label: '认定活动主题',
    prop: 'theme',
    align: 'center',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    label: '认定类型',
    prop: 'sessionName',
    align: 'center',
    width: 100
  },
  {
    label: '认定活动开始日期',
    align: 'center',
    prop: 'startTime',
    width: 180,
    formatter: (row) => {
      return getTime(row.startTime);
    }
  },
  {
    label: '认定活动提交截止日期',
    align: 'center',
    prop: 'endTime',
    width: 180,
    formatter: (row) => {
      return getTime(row.endTime);
    }
  },
  {
    label: '退回提交截止日期',
    align: 'center',
    prop: 'resubmitTime',
    width: 180,
    formatter: (row) => {
      return getTime(row.resubmitTime);
    }
  },
  {
    label: '市级推选截止日期',
    align: 'center',
    prop: 'municipalDeadline',
    width: 180,
    formatter: (row) => {
      return getTime(row.municipalDeadline);
    }
  },
  {
    label: '认定标准',
    align: 'center',
    prop: 'standardName',
    showOverflowTooltip: true,
    slotName: 'standardName',
    minWidth: 250
  },
  {
    label: '状态',
    align: 'center',
    prop: 'type',
    width: 180,
    formatter: (row) => {
      if (row.type) {
        return typeData.find((item) => item.value == row.type).label;
      }
    }
  },
  {
    label: '操作',
    align: 'center',
    width: 280,
    fixed: 'right',
    slotName: 'action'
  }
];
//状态
const typeData = [
  { label: '未发布', value: 'UNPUBLISH' },
  { label: '已发布', value: 'PUBLISHED' },
  { label: '资料申报', value: 'IN_DECLARE' },
  { label: '认定中', value: 'SELECTED' },
  { label: '公示中', value: 'IN_PUBLIC' },
  { label: '公示结束', value: 'END_PUBLIC' },
  { label: '活动已结束', value: 'COMPLETED' }
];
const state = reactive({
  searForm: {
    theme: '',
    session: '',
    type: ''
  },
  editRow: {} //编辑的当前行数据
});
const { searForm, editRow } = toRefs(state);
onMounted(() => {
  searchTable();
});
const searFormRef = ref(ElForm);
const lockDialog = ref(null);
const addDialog = ref(null);
const previewRef = ref(null);
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, getActivity);

//打开认定标准弹窗
const openPreview = ({ standardName: name, standardId: id }) => {
  previewRef.value.open({
    name,
    id
  });
};
//导出API
const { run: exportFun } = useRequest(excelActivity, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});
//获得详情-修改时候数据回显使用
const { run: getdetailActivity } = useRequest(detailActivity, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    let obj = data.data;
    obj.standardId = editRow.value.standardId;
    addDialog.value.open({ title: '修改认定活动', editRow: editRow.value, addForm: obj });
  }
});
//删除 API
const { run: delFun } = useRequest(delActivity, {
  manual: true,
  msgTxt: ['删除成功', '删除失败'],
  onSuccess: (data, isSuccess) => {
    searchTable();
  }
});
//发布API
const { run: issueFun } = useRequest(issueActivity, {
  manual: true,
  msgTxt: ['发布成功'],
  onSuccess: (data, isSuccess) => {
    searchTable();
  }
});
//结束活动
const { run: endFun } = useRequest(endActivityApi, {
  manual: true,
  msgTxt: ['结束活动成功！您可通过认定结果查询相关信息'],
  onSuccess: (data, isSuccess) => {
    searchTable();
  }
});

//查询
const onSearch = () => {
  searchTable();
};
//重置
const resetQuery = () => {
  searFormRef.value.resetFields();
  searchTable();
};
//导出
const exportData = () => {
  exportFun(searForm.value);
};
//新增
const add = () => {
  addDialog.value.open({ title: '创建认定活动' });
};
//修改
const edit = (row) => {
  getdetailActivity({ id: row.id });
  state.editRow = row;
};
//查看
const lock = (row) => {
  lockDialog.value.open(row);
};
//删除
const delRow = (row) => {
  delFun({ id: row.id });
};
//发布
const issue = (row) => {
  issueFun({ id: row.id });
};
//结束活动
const endActivity = (row) => {
  endFun({ id: row.id });
};
</script>

<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <el-form
        :inline="true"
        :model="searForm"
        ref="searFormRef"
        label-width="auto"
        class="auto-flex-form"
        @keyup.enter.native="onSearch"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="认定活动主题" prop="theme">
              <el-input v-model="searForm.theme" placeholder="请输入认定活动主题" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="认定类型" prop="session">
              <el-select v-model="searForm.session">
                <el-option label="企业" value="ENTERPRISE" />
                <el-option label="个人" value="PERSONAL" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="type">
              <el-select v-model="searForm.type">
                <el-option
                  v-for="item in typeData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item class="search-btn-div">
              <el-button type="primary" @click="onSearch">查询</el-button>
              <el-button @click="resetQuery">重置</el-button>
              <el-button type="primary" plain @click="exportData">导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-header>

    <el-main class="main-table-content">
      <div class="main-header-area">
        <div class="main-title">{{ route?.meta?.title }}</div>
        <el-button type="primary" @click="add">创建认定活动</el-button>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        class="main-table"
        border
        v-loading="tableLoading"
      >
        <template #standardName="{ row }">
          <span @click="openPreview(row)" style="color: #409eff; cursor: pointer">
            {{ row.standardName }}
          </span>
        </template>
        <template #action="scope">
          <el-button link size="small" @click="lock(scope.row)" type="primary">查看</el-button>
          <el-button
            link
            size="small"
            @click="edit(scope.row)"
            :type="scope.row.type == 'COMPLETED' ? 'info' : 'primary'"
            :disabled="scope.row.type == 'COMPLETED'"
          >
            修改
          </el-button>

          <el-popconfirm
            :title="`您正在删除${scope.row.theme}活动，请确认是否删除？`"
            @confirm="delRow(scope.row)"
            width=""
          >
            <template #reference>
              <el-button
                link
                :type="scope.row.type != 'UNPUBLISH' ? 'info' : 'danger'"
                size="small"
                :disabled="scope.row.type != 'UNPUBLISH'"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>

          <el-popconfirm
            :title="`您正在发布${scope.row.theme}活动，发布后无法撤回，请确认是否发布？`"
            @confirm="issue(scope.row)"
            width=""
          >
            <template #reference>
              <el-button
                link
                :type="scope.row.type != 'UNPUBLISH' ? 'info' : 'primary'"
                size="small"
                :disabled="scope.row.type != 'UNPUBLISH'"
              >
                发布
              </el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            :title="`您正在结束当前活动，结束后该活动将不能进行任何操作，请确认是否结束活动？`"
            width=""
            @confirm="endActivity(scope.row)"
          >
            <template #reference>
              <el-button
                link
                :type="scope.row.type == 'END_PUBLIC' ? 'primary' : 'info'"
                :disabled="scope.row.type != 'END_PUBLIC'"
                size="small"
              >
                结束
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>

    <!-- 创建&&修改 -->
    <AddDialog ref="addDialog" @searchTable="searchTable"></AddDialog>
    <!-- 查看 -->
    <LockDialog ref="lockDialog"></LockDialog>
    <!-- 认定标准 -->
    <StandardPreview ref="previewRef"></StandardPreview>
  </el-container>
</template>

<style scoped lang="less"></style>
