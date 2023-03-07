<!--新增&&修改 公告弹窗-->
<script setup>
import '@/styles/wangeditor.less';
import { onMounted, reactive, toRefs, ref, onBeforeUnmount, shallowRef } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import useRequest from '@/hooks/use-request';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { dictionaryApi, create, editAnnouncement } from '@/api/announcement.js';
import { toolbarConfig, editorConfig } from '@/utils/index.js';

const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;
const isNull = (content) => {
  let filterContent = content.replace(/<[^<>]+>/g, '').replace(/&nbsp;/gi, '');
  if (filterContent == '') return true;
  let regu = '^[ ]+$';
  let re = new RegExp(regu);
  return re.test(filterContent);
};

const document = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请填写通知公告内容'));
  } else {
    if (isNull(value)) {
      callback(new Error('请填写通知公告内容'));
    } else {
      callback();
    }
  }
};

const rules = {
  title: [{ required: true, message: '请输入通知公告名称', trigger: 'blur' }],
  recipient: [{ required: true, message: '请选择接收人', trigger: 'change' }],
  document: [{ required: true, validator: document, trigger: ['blur', 'change'] }]
};
//调用父组件列表接口 刷新列表
const emit = defineEmits(['searchTable']);
const searchTable = () => {
  emit('searchTable');
};
const state = reactive({
  addForm: {
    title: '',
    recipient: [],
    document: ''
  },
  dialogTitle: '新增通知公告',
  recipientData: [], //接收人数据
  editRowId: '' //父级 编辑当前行id
});

const { addForm, dialogTitle, recipientData, editRowId } = toRefs(state);
const dialogVisible = ref(false);
const addFormRef = ref(ElForm);

//打开弹窗并接受父组件参数
function open({ title, form = {}, editRowId = '' }) {
  state.dialogTitle = title;
  state.addForm = form;
  state.editRowId = editRowId;
  dialogVisible.value = true;
}
// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});
onMounted(() => {
  recipientFun({ category: 9 });
});

//富文本编辑器实例，必须用 shallowRef
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
//富文本失去焦点校验
const handleBlur = () => {
  addFormRef.value.validateField('document');
};

//获得接收人数据
const { run: recipientFun } = useRequest(dictionaryApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    state.recipientData = data.data;
  }
});
//新增-保存API
const { loading: createLoading, run: createFuc } = useRequest(create, {
  manual: true,
  msgTxt: ['新增成功', '新增失败'],
  onSuccess: (data, isSuccess) => {
    searchTable();
    dialogVisible.value = false;
  }
});
//编辑-保存API
const { run: editFun } = useRequest(editAnnouncement, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    searchTable();
    dialogVisible.value = false;
  }
});
//新增/修改-保存
const onSave = (status) => {
  addFormRef.value.validateField('document'); //单独校验富文本内容
  //status 判断 发布/保存    dialogTitle 判断 新增/编辑
  addFormRef.value.validate((valid) => {
    if (valid) {
      let params = {};
      if (state.dialogTitle == '新增通知公告') {
        params = { ...addForm.value, status };
        createFuc(params);
      } else {
        params = { ...addForm.value, status, id: editRowId.value };
        editFun(params);
      }
    } else {
      return false;
    }
  });
};
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    destroy-on-close
    :title="dialogTitle"
    width="60%"
    center
    append-to-body
  >
    <el-form :model="addForm" :rules="rules" label-width="auto" ref="addFormRef">
      <el-form-item label="通知公告名称" prop="title">
        <el-input v-model="addForm.title" maxlength="100" />
      </el-form-item>
      <el-form-item label="接收人" prop="recipient">
        <el-checkbox-group v-model="addForm.recipient">
          <el-checkbox :label="item.sortIndex" v-for="item in recipientData" :key="item.sortIndex">
            {{ item.value }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="通知公告内容" prop="document">
        <div style="border: 1px solid #ccc; width: 100%; z-index: 1000" class="wangeditor">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :defaultConfig="toolbarConfig"
            :editor="editorRef"
          />
          <Editor
            style="height: 300px; overflow-y: hidden"
            v-model="addForm.document"
            mode="simple"
            :defaultConfig="editorConfig"
            @onCreated="handleCreated"
            @onBlur="handleBlur"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false" class="btn">关闭</el-button>
        <el-button type="primary" @click="onSave(2)" class="btn">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="less">
.wangeditor {
  :deep(.babel-container),
  :deep(.babel-container span) {
    margin-bottom: 0;
  }
}

.btn {
  width: 100px;
  height: 40px;
  margin: 0 30px;
}
</style>
