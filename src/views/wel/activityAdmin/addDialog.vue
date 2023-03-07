<!-- 创建&&修改活动 -->
<script setup>
import '@/styles/wangeditor.less';
import { onMounted, reactive, toRefs, ref, onBeforeUnmount, shallowRef } from 'vue';
import { ElForm, ElMessageBox } from 'element-plus';
import SubmissionDialog from './submissionDialog.vue';
import useRequest from '@/hooks/use-request';
import { useRouter } from 'vue-router';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { addActivity, getStandard, editActivity, groupsApi } from '@/api/wel.js';
import { toolbarConfig, editorConfig } from '@/utils/index.js';
const router = useRouter();

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
const defaultTime = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)];
const state = reactive({
  dialogTitle: '创建认定活动',
  addForm: {
    theme: '',
    session: '',
    startTime: '',
    endTime: '',
    resubmitTime: '',
    municipalDeadline: '',
    remark: '',
    notice: '',
    fileCategoryId: '',
    standardId: ''
  },
  editRow: {}, //父组件传过来的当期前行数据
  groups: [], //上传文件分组
  standardData: [] //认定标准数据
});

const addFormCopy = ref({});
const { dialogTitle, addForm, groups, standardData, editRow } = toRefs(state);
const addDialog = ref(false);
var addFormRef = ref(ElForm);
const submissionDialog = ref(null);
const submissionBtn = ref(true); //控制 各市上报数量设置 禁用

//自定义校验规则
const startTime = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择认定活动开始日期'));
  } else {
    if (Date.parse(addForm.value.endTime) <= Date.parse(value)) {
      callback(new Error('认定活动提交截止日期必须大于开始日期！'));
    } else {
      callback();
    }
  }
};
const endTime = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择认定活动提交截止日期'));
  } else {
    if (Date.parse(addForm.value.startTime) >= Date.parse(value)) {
      callback(new Error('认定活动提交截止日期必须大于开始日期！'));
    }
    if (Date.parse(addForm.value.resubmitTime) < Date.parse(value)) {
      callback(new Error('认定活动提交截止日期必须小于等于退回提交截止日期！'));
    } else {
      callback();
    }
  }
};
const resubmitTime = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择退回提交截止日期'));
  } else {
    if (Date.parse(addForm.value.endTime) > Date.parse(value)) {
      callback(new Error('退回提交截止日期必须大于等于提交截止日期！'));
    }
    if (Date.parse(addForm.value.municipalDeadline) < Date.parse(value)) {
      callback(new Error('退回提交截止日期必须小于等于市级推选截止日期！'));
    } else {
      callback();
    }
  }
};
const municipalDeadline = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请选择市级推选截止日期'));
    addFormRef.value.validateField('resubmitTime');
  } else {
    if (Date.parse(addForm.value.resubmitTime) > Date.parse(value)) {
      callback(new Error('市级推选截止日期必须大于等于退回提交截止日期！'));
    } else {
      callback();
    }
  }
};

//校验
const rules = {
  theme: [{ required: true, message: '请输入认定活动主题', trigger: 'blur' }],
  session: [{ required: true, message: '请选择认定类型', trigger: 'change' }],
  startTime: [{ required: true, validator: startTime, trigger: 'change' }],
  endTime: [{ required: true, validator: endTime, trigger: 'change' }],
  resubmitTime: [{ required: true, validator: resubmitTime, trigger: 'change' }],
  municipalDeadline: [{ required: true, validator: municipalDeadline, trigger: 'change' }],
  fileCategoryId: [{ required: true, message: '请选择文件分组', trigger: 'change' }],
  standardId: [{ required: true, message: '请选择认定标准', trigger: 'change' }]
};

//监听时间改变 实时校验
const changeStartTime = () => {
  if (addForm.value.endTime) addFormRef.value.validateField('endTime');
};
const changeEndTime = () => {
  if (addForm.value.startTime) addFormRef.value.validateField('startTime');
  if (addForm.value.resubmitTime) addFormRef.value.validateField('resubmitTime');
};
const changeResubmitTime = () => {
  if (addForm.value.endTime) addFormRef.value.validateField('endTime');
  if (addForm.value.municipalDeadline) addFormRef.value.validateField('municipalDeadline');
};
const changeMunicipalDeadline = () => {
  if (addForm.value.resubmitTime) addFormRef.value.validateField('resubmitTime');
};

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

//失去焦点校验
const handleBlur = () => {
  addFormRef.value.validateField('document');
};

//调用父组件列表接口 刷新列表
const emit = defineEmits(['searchTable']);
const searchTable = () => {
  emit('searchTable');
};

//获得上传文件分组
const { run: getGroupsFun } = useRequest(groupsApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    state.groups = data.data;
  }
});

//获得认定标准
const { run: getStandardData } = useRequest(getStandard, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    state.standardData = data.data;
  }
});

//新增接口
const { run: addFun } = useRequest(addActivity, {
  manual: true,
  msgTxt: ['创建成功'],
  onSuccess: (data, isSuccess) => {
    searchTable();
    submissionBtn.value = false;
    editRow.value = data.data;
  }
});

//修改-保存api
const { run: editFun } = useRequest(editActivity, {
  manual: true,
  msgTxt: ['保存成功'],
  onSuccess: (data, isSuccess) => {
    searchTable();
  }
});

//打开弹窗并接受父组件参数
function open({ title, editRow = {}, addForm = {} }) {
  state.editRow = editRow;
  state.addForm = addForm;
  state.dialogTitle = title;
  submissionBtn.value = true;
  addFormCopy.value = { ...addForm };
  addDialog.value = true;
}
// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});

//添加新标准
const addStandard = () => {
  router.push({
    path: '/selection/standard/index'
  });
};
//各省市上报数量
const setAmount = () => {
  submissionDialog.value.open({ types: 'edit', id: editRow.value.id });
};

//新增/修改-保存
const onSave = async ({}, type) => {
  try {
    await addFormRef.value.validate();
    // if (state.dialogTitle === '创建认定活动') {
    if (!editRow.value.id) {
      addFun(addForm.value);
    } else {
      let params = { ...addForm.value, id: editRow.value.id };
      editFun(params);
    }

    addFormCopy.value = { ...addForm.value };
    //根据type 判断要不要关闭弹窗
    if (type) {
      addDialog.value = false;
      state.addForm = {};
    }
  } catch (error) {}
};
//判断表单中值是否有变化
const changeAddForm = () => {
  for (let key in addForm.value) {
    if (addForm.value[key] !== addFormCopy.value[key]) {
      return true;
    }
  }
};
//取消
const close = () => {
  if (!changeAddForm()) {
    addDialog.value = false;
    return;
  }
  ElMessageBox.confirm('您当前输入的内容还未保存，请确认是否保存？', '提示', {
    confirmButtonText: '是',
    cancelButtonText: '否',
    type: 'warning',
    showClose: false
  })
    .then(() => {
      onSave({}, true);
    })
    .catch(() => {
      addDialog.value = false;
    });
};

onMounted(() => {
  getStandardData();
  getGroupsFun({ category: 4 });
});
</script>

<template>
  <!-- 创建&&修改 -->
  <el-dialog
    v-model="addDialog"
    destroy-on-close
    :title="dialogTitle"
    width="70%"
    center
    :before-close="close"
  >
    <el-form
      :model="addForm"
      :rules="rules"
      label-width="auto"
      label-position="right"
      ref="addFormRef"
      class="addActivity"
      status-icon
    >
      <!--  @keyup.enter.native="onSave"   防止使用回车时候调用保存-->
      <el-form-item label="认定活动主题" prop="theme">
        <el-input
          v-model="addForm.theme"
          maxlength="50"
          placeholder="请输入认定活动主题"
          clearable
          :disabled="editRow.type && editRow.type != 'UNPUBLISH'"
        />
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="认定类型" prop="session">
            <el-select
              v-model="addForm.session"
              :disabled="editRow.type && editRow.type != 'UNPUBLISH'"
            >
              <el-option label="企业" value="ENTERPRISE" />
              <el-option label="个人" value="PERSONAL" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="认定活动开始日期" prop="startTime">
            <el-date-picker
              v-model="addForm.startTime"
              :editable="false"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              type="datetime"
              placeholder="请选择"
              style="width: 100%"
              @visible-change="changeStartTime"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="认定活动提交截止日期" prop="endTime">
            <el-date-picker
              v-model="addForm.endTime"
              :editable="false"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              type="datetime"
              placeholder="请选择"
              style="width: 100%"
              @visible-change="changeEndTime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退回提交截止日期" prop="resubmitTime">
            <el-date-picker
              v-model="addForm.resubmitTime"
              :editable="false"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              type="datetime"
              placeholder="请选择"
              style="width: 100%"
              @visible-change="changeResubmitTime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="市级推选截止日期" prop="municipalDeadline">
            <el-date-picker
              v-model="addForm.municipalDeadline"
              :editable="false"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              type="datetime"
              placeholder="请选择"
              style="width: 100%"
              @visible-change="changeMunicipalDeadline"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件分组" prop="fileCategoryId">
            <el-select
              v-model="addForm.fileCategoryId"
              :disabled="editRow.type && editRow.type != 'UNPUBLISH'"
            >
              <el-option
                :label="item.value"
                :value="item.sortIndex"
                v-for="item in groups"
                :key="item.sortIndex"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="认定标准" prop="standardId">
            <el-select
              v-model="addForm.standardId"
              :disabled="editRow.type && editRow.type != 'UNPUBLISH'"
            >
              <el-option
                v-for="item in standardData"
                :key="item.standardId"
                :label="item.standardName"
                :value="item.standardId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <el-button
            type="primary"
            @click="addStandard"
            :disabled="editRow.type && editRow.type != 'UNPUBLISH'"
          >
            添加新标准
          </el-button>

          <el-button type="primary" :disabled="submissionBtn && !editRow.type" @click="setAmount">
            各市上报数量设置
          </el-button>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model.warp="addForm.remark"
          maxlength="100"
          placeholder="请输入备注信息"
          show-word-limit
          type="textarea"
          :disabled="editRow.type && editRow.type != 'UNPUBLISH'"
        />
      </el-form-item>
      <el-form-item label="认定须知" prop="notice">
        <div style="border: 1px solid #ccc; width: 100%; z-index: 1000" class="wangeditor">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
          />
          <Editor
            style="height: 300px; overflow-y: hidden"
            v-model="addForm.notice"
            :defaultConfig="editorConfig"
            mode="simple"
            @onCreated="handleCreated"
            @onBlur="handleBlur"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close" style="width: 180px; height: 40px; margin-right: 30px">
          取消
        </el-button>
        <el-button type="primary" @click="onSave" style="width: 180px; height: 40px">
          保存
        </el-button>
      </span>
    </template>

    <SubmissionDialog ref="submissionDialog" />
  </el-dialog>
</template>
<style scoped lang="less">
.wangeditor {
  :deep(.babel-container),
  :deep(.babel-container span) {
    margin-bottom: 0;
  }
}
.addActivity {
  :deep(.el-select) {
    width: 100%;
  }
}
</style>
