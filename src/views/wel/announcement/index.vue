<!-- 通知公告管理 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import useRequest from '@/hooks/use-request';
import usePagination from '@/hooks/use-pagination';
import AccessoryAdmin from './accessory-admin.vue';
import AddDialog from './addDialog.vue';
import {
  getAnnouncement,
  issueAnnouncement,
  delAnnouncement,
  detailAnnouncement,
  getAnnouncementExcel
} from '@/api/announcement.js';
import { downloadFileByBlob } from '@/utils/tools';
const router = useRouter();
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;
//禁用当前日期之前的日期
const scheduledTime = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择预计发布时间'));
  } else {
    if (new Date() > new Date(value)) {
      callback(new Error('预计发布时间应大于当前时间！'));
    } else {
      callback();
    }
  }
};
const rules = {
  scheduledTime: [{ required: true, validator: scheduledTime, trigger: 'change' }]
};

const column = [
  {
    prop: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    label: '通知公告名称',
    prop: 'title',
    minWidth: 200,
    showOverflowTooltip: true
  },
  {
    label: '发布状态',
    prop: 'status',
    align: 'center',
    width: 180,
    formatter: (row) => {
      if (row.status == 1) {
        return '已发布';
      } else {
        return '未发布';
      }
    }
  },
  {
    label: '发布人',
    align: 'center',
    prop: 'issuer',
    width: 180
  },
  {
    label: '接收人',
    align: 'center',
    prop: 'recipientName',
    width: 180
  },
  {
    label: '创建时间',
    align: 'center',
    prop: 'createdTime',
    width: 180
  },
  {
    label: '发布时间',
    align: 'center',
    prop: 'time',
    width: 180
  },
  {
    label: '预计发布时间',
    align: 'center',
    prop: 'scheduledTime',
    width: 180
  },
  {
    label: '操作',
    fixed: 'right',
    slotName: 'option',
    width: 350
  }
];

const state = reactive({
  searForm: {
    type: '',
    keyword: ''
  },
  editRow: {}, //编辑的当前行数据
  issueForm: {
    scheduledTime: '' //预计发布时间
  },
  recipientData: [] //接收人数据
});
const { searForm, editRow, issueForm, recipientData } = toRefs(state);
const {
  dataSource,
  handlePageChange,
  total,
  page,
  loading: tableLoading,
  run: searchTable
} = usePagination(searForm.value, getAnnouncement);
const searFormRef = ref(ElForm);
const issueFormRef = ref(ElForm);
const addDialog = ref(null); //新增公告弹窗
const issueDialog = ref(false); //延迟发布弹窗
const accessoryAdmin = ref(null); //附件管理组件

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
const { run: exportFun } = useRequest(getAnnouncementExcel, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    downloadFileByBlob(data);
  }
});
const exportData = () => {
  exportFun(searForm.value);
};

//查看
const lock = (row) => {
  router.push({
    path: '/wel/announcement/lock-announcement',
    query: { id: row.id, viewLog: true }
  });
};

//新增
const add = () => {
  addDialog.value.open({ title: '新增通知公告' });
};

//修改
//获得详情-查看编辑时候都用
const { run: lockFun } = useRequest(detailAnnouncement, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    let form = {
      title: data.data.title,
      recipient: editRow.value.recipient,
      document: data.data.document
    };
    addDialog.value.open({ title: '通知公告修改', form, editRowId: editRow.value.id });
  }
});
const edit = (row) => {
  state.editRow = row;
  lockFun({ id: row.id });
};

//删除
const { run: delFun } = useRequest(delAnnouncement, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    searchTable();
  }
});
const delRow = (row) => {
  delFun({ id: row.id });
};

//附件管理
const accessory = (row) => {
  accessoryAdmin.value.open(row);
};

//发布
const { run: issueFun } = useRequest(issueAnnouncement, {
  manual: true,
  msgTxt: [],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      issueDialog.value = false;
      searchTable();
    }
  }
});
//立即发布
const issue = (row) => {
  ElMessageBox.confirm(`您正在发布${row.title}，请确认是否发布？`, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    issueFun({ id: row.id, operateType: 1 });
  });
};
//预计发布
const scheduledIssue = (row) => {
  state.editRow = row;
  state.issueForm = { scheduledTime: row.scheduledTime };
  issueDialog.value = true;
};
const affirmIssue = () => {
  issueFormRef.value.validate((valid) => {
    if (valid) {
      issueFun({
        id: editRow.value.id,
        operateType: 2,
        scheduledTime: issueForm.value.scheduledTime
      });
    } else {
      return false;
    }
  });
};
//撤回
const revocation = (row) => {
  issueFun({ id: row.id, operateType: 2 });
};
</script>
<template>
  <el-container class="main-content">
    <el-header class="main-form-head">
      <el-form
        :inline="true"
        :model="searForm"
        label-width="auto"
        ref="searFormRef"
        class="auto-flex-form"
        @keyup.enter.native="onSearch"
      >
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="通知公告名称" prop="keyword">
              <el-input v-model="searForm.keyword" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发布状态" prop="type">
              <el-select v-model="searForm.type">
                <el-option label="已发布" :value="1" />
                <el-option label="未发布" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
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
        <div class="main-title">通知公告</div>
        <el-button type="primary" @click="add">新建公告</el-button>
      </div>
      <el-table-next
        :column="column"
        :data="dataSource"
        border
        v-loading="tableLoading"
        class="main-table"
      >
        <template #option="scope">
          <el-button link type="primary" size="small" @click="lock(scope.row)">查看</el-button>
          <el-button
            link
            :type="scope.row.status == 1 ? 'info' : 'primary'"
            size="small"
            :disabled="scope.row.status == 1"
            @click="edit(scope.row)"
          >
            修改
          </el-button>

          <el-popconfirm
            placement="top-end"
            :title="`您正在删除${scope.row.title}通知公告，请确认是否删除？`"
            @confirm="delRow(scope.row)"
            width=""
          >
            <template #reference>
              <el-button
                link
                :type="scope.row.status == 1 ? 'info' : 'danger'"
                size="small"
                :disabled="scope.row.status == 1"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>

          <el-button link type="primary" size="small" @click="accessory(scope.row)">
            附件管理
          </el-button>

          <el-dropdown
            trigger="click"
            :hide-on-click="false"
            :disabled="scope.row.status == 1"
            class="issue"
          >
            <span>
              <el-button
                link
                size="small"
                :type="scope.row.status == 1 ? 'info' : 'primary'"
                :disabled="scope.row.status == 1"
              >
                发布
              </el-button>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- <el-dropdown-item style="position: relative">
                  <el-popconfirm
                    :title="`您正在发布${scope.row.title}，请确认是否发布？`"
                    @confirm="issue(scope.row)"
                    width=""
                    class="popconfirm"
                    :teleported="false"
                  >
                    <template #reference>立即发布</template>
                  </el-popconfirm>
                </el-dropdown-item> -->
                <el-dropdown-item @click="issue(scope.row)">立即发布</el-dropdown-item>
                <el-dropdown-item @click="scheduledIssue(scope.row)">预计发布</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-popconfirm
            :title="`您正在撤回${scope.row.title}，请确认是否撤回？`"
            @confirm="revocation(scope.row)"
            width=""
          >
            <template #reference>
              <el-button
                link
                :type="scope.row.status == 2 ? 'info' : 'primary'"
                size="small"
                :disabled="scope.row.status == 2"
              >
                撤回
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-next>
      <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
    </el-main>
    <!-- 新增公告 -->
    <AddDialog ref="addDialog" @searchTable="searchTable"></AddDialog>
    <!-- 预计发布 -->
    <el-dialog v-model="issueDialog" destroy-on-close title="预计发布" width="30%" center>
      <el-form
        :model="issueForm"
        :rules="rules"
        label-width="120px"
        ref="issueFormRef"
        @keyup.enter.native="affirmIssue"
      >
        <el-form-item label="预计发布时间" prop="scheduledTime">
          <el-date-picker
            v-model="issueForm.scheduledTime"
            :picker-options="forbiddenTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择预计发布时间"
            style="width: 100%"
            ref="scheduledTimes"
            @focus="$refs.scheduledTimes.handleOpen()"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span>
          <el-button @click="issueDialog = false" class="btn">取消</el-button>
          <el-button type="primary" @click="affirmIssue" class="btn">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 附件管理 -->
    <AccessoryAdmin ref="accessoryAdmin" />
  </el-container>
</template>

<style scoped lang="less">
//操作栏 发布按钮样式
.issue {
  position: relative;
  margin: 0 10px;
  margin-top: 3px;
}
.btn {
  width: 100px;
  height: 40px;
  margin: 0 30px;
}
</style>
