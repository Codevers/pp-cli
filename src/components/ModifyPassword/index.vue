<!--
 * @Description: 
 * @Autor: wsy
 * @Date: 2022-08-05 10:15:45
-->
<script setup>
import { ref, reactive, toRefs } from 'vue';
import { useChangePasswordApi } from '@/api/common';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { useRequest } from 'v3hooks';
import { rulePassword } from '@/config/reg-validate';
const userStore = useUserStore();
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  close: {
    type: Function
  }
});
const modifyForm = ref(null);
const { show, close } = toRefs(props);
const state = reactive({
  ruleForm: {
    oldPassword: '',
    newPassword: '',
    confirmPassWord: '',
    question: '',
    answer: ''
  },
  rules: {
    oldPassword: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        required: true,
        message: '密码长度为8-12个字符，且包含数字、字母、符号3种组合，字母区分大小写',
        trigger: 'change'
      }
    ],
    newPassword: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        required: true,
        trigger: ['change', 'blur'],
        validator: (rule, value, callback) => regexPassword(rule, value, callback)
      }
    ],
    confirmPassWord: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        required: true,
        trigger: ['change', 'blur'],
        validator: (rule, value, callback) => regexPassword(rule, value, callback)
      }
    ],
    question: [{ required: true, message: '请输入您的个性化问题', trigger: 'blur' }],
    answer: [{ required: true, message: '请输入问题答案', trigger: 'blur' }]
  }
});
const regexPassword = (rule, value, callback) => {
  if (!rulePassword.rule.test(value)) {
    return callback(new Error(rulePassword.tip));
  }
  if (
    ruleForm.value.confirmPassWord &&
    ruleForm.value.newPassword !== ruleForm.value.confirmPassWord
  ) {
    callback(new Error('两次密码不一致！'));
  }
  callback();
};
const emits = defineEmits(['update:show']);

const submitForm = () => {
  modifyForm.value.validate(async (valid) => {
    valid && toChangePassword({ ...ruleForm.value, account: userStore.userInfo?.account });
  });
};
const { run: toChangePassword } = useRequest(useChangePasswordApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data?.data) {
        close.value();
        emits('update:show', false);
        ElMessage.success('修改成功，请重新登录');
        setTimeout(() => {
          userStore.logout();
        }, 1000);
      } else {
        ElMessage.error(data?.msg);
      }
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
const { ruleForm, rules } = toRefs(state);
</script>
<template>
  <el-dialog
    v-model="show"
    width="25%"
    :show-close="false"
    :center="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    custom-class="password-dialog"
  >
    <template #header>
      <div class="dialog-header">修改密码</div>
    </template>
    <el-form
      :rules="rules"
      :model="ruleForm"
      ref="modifyForm"
      class="modify-form"
      label-width="100px"
      @keyup.enter.native="submitForm"
    >
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          type="password"
          v-model.trim="ruleForm.oldPassword"
          autocomplete="new-password"
          placeholder="请输入旧密码"
          clearable
          show-password
          maxlength="12"
          minlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="设置新密码" prop="newPassword">
        <el-input
          type="password"
          v-model.trim="ruleForm.newPassword"
          autocomplete="new-password"
          placeholder="请输入新密码"
          clearable
          show-password
          @keyup="keyUpHandle"
          maxlength="12"
          minlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassWord">
        <el-input
          type="password"
          v-model.trim="ruleForm.confirmPassWord"
          autocomplete="new-password"
          placeholder="请输入确认新密码"
          clearable
          show-password
          maxlength="12"
          minlength="8"
        ></el-input>
      </el-form-item>
      <div class="question-title">设置您找回密码的个性化问题：</div>
      <el-form-item label="个性化问题" prop="question">
        <el-input
          type="text"
          v-model.trim="ruleForm.question"
          autocomplete="off"
          show-word-limit
          placeholder="请输入您的个性化问题"
          clearable
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item label="问题答案" prop="answer">
        <el-input
          type="text"
          v-model.trim="ruleForm.answer"
          autocomplete="off"
          show-word-limit
          placeholder="请输入问题答案"
          clearable
          maxlength="20"
        ></el-input>
      </el-form-item>
      <div class="button-group">
        <el-button type="primary" @click="submitForm">确定</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<style scoped lang="less">
.modify-form {
  width: 100%;
  margin: 0 auto;
  .title {
    margin: 0 auto;
    font-size: 25px;
  }
  .button-group {
    margin-top: 10%;
    text-align: center;
    .el-button {
      width: 150px;
    }
  }
}
.dialog-header {
  font-size: 18px;
  color: #fff;
}
.question-title {
  margin: 15px 0;
  color: rgba(0, 127, 253, 1);
}
</style>
<style lang="less">
.password-dialog {
  .el-form-item {
    margin-bottom: 30px;
  }
}
</style>
