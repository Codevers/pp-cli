<script setup>
import { ref, reactive, defineEmits } from 'vue';
import useRequest from '@/hooks/use-request';
import usePagination from '@/hooks/use-pagination';
import { GetExpertSelectPageApi, ReplaceExpertApi } from '../api';
import { appStoreWithOut } from '@/store/modules/app';
import { ElMessageBox } from 'element-plus';
const searchFormRef = ref(null);
const visible = ref(false);
const dlTitle = ref('重新指定专家');
const currentRow = ref(null);
const propsParmas = reactive({});
const emits = defineEmits(['reload']);

const tableColumn = [
  {
    prop: 'index',
    label: '序号',
    width: 60
  },
  {
    prop: 'name',
    label: '姓名',
    width: 80
  },
  {
    prop: 'sex',
    label: '性别',
    width: 60
  },
  {
    prop: 'idNum',
    label: '身份证号',
    width: 180
  },
  {
    prop: 'companyType',
    label: '单位类型',
    width: 120
  },
  {
    prop: 'company',
    label: '所在单位',
    align: 'left',
    showOverflowTooltip: true
  },
  {
    prop: 'major',
    label: '专业',
    width: 150
  },
  {
    prop: 'title',
    label: '职称',
    width: 120
  }
];
const searchForm = reactive({
  name: '',
  company: '',
  major: '',
  companyType: ''
});

const { run: replaceExpert } = useRequest(ReplaceExpertApi, {
  manual: true,
  msgTxt: ['专家替换成功！'],
  onSuccess: () => {
    visible.value = false;
    emits('reload');
  }
});

const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searchForm, GetExpertSelectPageApi, {
  manual: true
});
// 重置查询表单
function resetSearchForm() {
  searchFormRef?.value?.resetFields();
  searchTable();
}
function resetPageState() {
  currentRow.value = null;
  total.value = 0;
  resetSearchForm();
  dataSource.value = [];
}
function open({ scoreSummaryId, expertId }) {
  propsParmas.scoreSummaryId = scoreSummaryId;
  propsParmas.expertId = expertId;
  visible.value = true;
  resetPageState();
}
function handleCurrentChange(val) {
  currentRow.value = val;
}
function close() {
  visible.value = false;
}
function handleSubmit() {
  ElMessageBox.confirm('是否确认替换为当前选定的专家?', '提示', {
    confirmButtonText: '是',
    cancelButtonText: '否，我再想想',
    type: 'info'
  }).then(() => {
    replaceExpert({
      scoreSummaryId: propsParmas.scoreSummaryId,
      id: propsParmas.expertId,
      targetId: currentRow.value.proficientId
    });
  });
}
// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});
</script>
;

<template>
  <el-dialog v-model="visible" :title="dlTitle" :width="1200" center @close="close">
    <el-form
      inline
      :model="searchForm"
      ref="searchFormRef"
      label-width="80px"
      class="auto-flex-form"
      @keyup.enter.native="searchTable"
    >
      <el-row :gutter="30">
        <el-col :span="9">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="searchForm.name" />
          </el-form-item>
          <el-form-item label="所在单位" prop="company">
            <el-input v-model="searchForm.company" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="专业" prop="major">
            <el-select v-model="searchForm.major">
              <el-option
                :label="item.value"
                :value="item.key"
                v-for="item in appStoreWithOut.getGlobalDict(2)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单位类型" prop="companyType">
            <el-select v-model="searchForm.companyType">
              <el-option
                :label="item.value"
                :value="item.key"
                v-for="item in appStoreWithOut.getGlobalDict(3)"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item class="search-btn-div">
            <el-button type="primary" @click="searchTable">查询</el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table-next
      class="main-table"
      highlight-current-row
      @current-change="handleCurrentChange"
      :column="tableColumn"
      :data="dataSource"
      border
      v-loading="tableLoading"
    ></el-table-next>
    <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    <template #footer>
      <div class="dialog-footer-right">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit()" :disabled="!currentRow">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.page-content {
  height: 100%;
  background: #fff;
}
:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: #fff6d0;
}
:deep(.el-table__body tr) {
  cursor: pointer;
}
</style>
