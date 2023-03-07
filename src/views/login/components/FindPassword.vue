<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, toRefs } from 'vue';
import { useCheckAnswerApi, useCheckPassApi } from '../api';
import { useUserStoreWithOut } from '@/store/modules/user';
import { useRequest } from 'v3hooks';
import { rulePassword } from '@/config/reg-validate';
const userStore = useUserStoreWithOut();
const userInfo = userStore.getUserInfo;
const props = defineProps({
  dialogVisible: Boolean,
  questions: Object,
  account: String
});
const questionForm = ref(null);
const passwordForm = ref(null);
const activeKey = ref(1);
const afterCheckKey = ref('');
const { dialogVisible, questions, account } = toRefs(props);
const { run: toCheckAnswerApi } = useRequest(useCheckAnswerApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data?.data?.isPass) {
        activeKey.value = 2;
        afterCheckKey.value = data?.data?.id;
      } else {
        ElMessage.error('您输入的答案不正确，请再想想');
      }
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
const { run: toCheckPassApi } = useRequest(useCheckPassApi, {
  manual: true,
  onSuccess: (data) => {
    console.log('data', data);
    if (data?.success) {
      activeKey.value = 3;
    }
  }
});
const emits = defineEmits(['setDialogVisible']);

const state = reactive({
  question: {
    answer: ''
  },
  findPassword: {
    newPassword: '',
    password: ''
  },
  rules: {
    answer: [{ required: true, message: '答案不能为空', trigger: 'blur' }],
    newPassword: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        required: true,
        trigger: ['change', 'blur'],
        validator: (rule, value, callback) => regexPassword(rule, value, callback)
      }
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        required: true,
        trigger: ['change', 'blur'],
        validator: (rule, value, callback) => regexPassword(rule, value, callback)
      }
    ]
  }
});
const closeDialog = () => {
  emits('setDialogVisible', false);
  passwordForm.value.resetFields();
  questionForm.value.resetFields();
  activeKey.value = 1;
};
const submitQuestion = async () => {
  questionForm.value.validate(async (valid) => {
    if (valid) {
      await toCheckAnswerApi({ answer: question.value.answer, questionId: questions.value.id });
    }
  });
};
const submitPassword = async (key) => {
  passwordForm.value.validate(async (valid) => {
    if (valid) {
      await toCheckPassApi({
        id: afterCheckKey.value,
        account: account.value,
        password: findPassword.value.password
      });
    }
  });
};
const regexPassword = (rule, value, callback) => {
  if (!rulePassword.rule.test(value)) {
    return callback(new Error(rulePassword.tip));
  }
  if (
    findPassword.value.password &&
    findPassword.value.newPassword !== findPassword.value.password
  ) {
    callback(new Error('两次密码不一致！'));
  } else if (findPassword.value.newPassword == findPassword.value.password) {
    passwordForm.value.clearValidate();
  }
  callback();
};
const goLogin = () => {
  emits('setDialogVisible', false);
};
const { question, findPassword, rules } = toRefs(state);
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    destroy-on-close
    width="25%"
    :center="true"
    :close-on-click-modal="false"
    custom-class="password-dialog"
    @close="closeDialog"
  >
    <template #header>
      <div class="dialog-header">找回密码</div>
    </template>
    <el-steps :active="activeKey" align-center>
      <el-step title="安全验证" />
      <el-step title="重置密码" />
      <el-step title="设置成功" />
    </el-steps>
    <el-form
      :rules="rules"
      :model="question"
      ref="questionForm"
      class="login-form"
      v-show="activeKey === 1"
    >
      <el-form-item label="您的个性化问题：" prop="username">
        <div class="question">{{ questions.question }}</div>
      </el-form-item>
      <el-form-item label="" prop="answer">
        <el-input
          v-model.trim="question.answer"
          autocomplete="new-password"
          placeholder="请输入问题答案"
          show-word-limit
          maxlength="20"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-form
      :rules="rules"
      :model="findPassword"
      ref="passwordForm"
      class="login-form"
      v-show="activeKey === 2"
    >
      <el-form-item label="设置新密码" prop="newPassword">
        <el-input
          type="password"
          v-model.trim="findPassword.newPassword"
          autocomplete="new-password"
          placeholder="请输入新密码"
          show-password
          maxlength="12"
          minlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="password">
        <el-input
          type="password"
          v-model.trim="findPassword.password"
          autocomplete="new-password"
          placeholder="请输入新密码"
          show-password
          maxlength="12"
          minlength="8"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-result
      icon="success"
      title="恭喜，你的账号重置密码成功！"
      v-show="activeKey === 3"
    ></el-result>
    <div class="button-group">
      <el-space size="large">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitQuestion()" v-show="activeKey === 1">
          下一步
        </el-button>
        <el-button type="primary" @click="submitPassword()" v-show="activeKey === 2">
          确定
        </el-button>
        <el-button class="login-btn" type="primary" @click="goLogin" v-show="activeKey === 3">
          确定
        </el-button>
      </el-space>
    </div>
  </el-dialog>
</template>

<style scoped lang="less">
.login-form {
  width: 90%;
  margin: 10% auto;
  .title {
    margin: 0 auto 10% auto;
    font-size: 25px;
  }
  .question {
    color: #007ffd;
  }
  .el-form-item {
    margin-bottom: 30px;
  }
}
.el-steps {
  width: 100%;
}
.button-group {
  text-align: center;
  .el-button {
    width: 100px;
  }
}

:deep(.el-result__title p) {
  color: #67c23a;
}
.dialog-header {
  font-size: 18px;
  color: #fff;
}
</style>
<style lang="less">
.password-dialog {
  .el-dialog__header {
    margin-right: 0px;
    background-image: linear-gradient(
      to right,
      rgba(110, 163, 254, 1),
      rgba(35, 97, 229, 1),
      rgba(110, 148, 254, 1),
      rgba(59, 109, 254, 1),
      rgba(65, 122, 254, 1)
    );
  }
}
.login-btn {
  height: 40px;
}
</style>
