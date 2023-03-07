<!--
 * @Description: 页面修改密码
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-08-08 10:21:36
 * @LastEditTime: 2022-08-26 09:50:05
-->
<script setup>
import { ref, reactive, toRefs, watchEffect } from 'vue';
import { useChangePasswordApi, getSecretInfo, useChangeAdminPasswordApi } from '@/api/common';
import { useUserStore } from '@/store/modules/user';
import { useTabsStore } from '@/store/modules/tabs';
import { ElMessage } from 'element-plus';
import { useRequest } from 'v3hooks';
import { rulePassword } from '@/config/reg-validate';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const tabStore = useTabsStore();
const loginType = userStore.loginType === 'admin';
console.log('loginType', loginType);
const userInfo = userStore.getUserInfo;
const modifyForm = ref(null);
const state = reactive({
  ruleForm: {
    oldPassword: '',
    newPassword: '',
    confirmPassWord: '',
    question: '',
    answer: ''
  },
  rules: {
    oldPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
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
//获取用户密保信息
const { run: toGetSecretInfo } = useRequest(getSecretInfo, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data.data) {
        ruleForm.value.question = data.data.question;
        ruleForm.value.answer = data.data.answer;
      } else {
        ElMessage.error('未找到该用户密保信息');
      }
    }
  }
});
watchEffect(() => {
  !loginType && toGetSecretInfo();
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
const close = () => {
  modifyForm?.value?.resetFields();
  tabStore.closePageNameTab(route.name);
};
const submitForm = () => {
  modifyForm.value.validate(async (valid) => {
    if (valid) {
      loginType
        ? toChangeAdminPassword({
            oldPassword: ruleForm.value.oldPassword,
            newPassword: ruleForm.value.newPassword
          })
        : toChangePassword({ ...ruleForm.value, account: userInfo.account });
    }
  });
};
const { run: toChangeAdminPassword } = useRequest(useChangeAdminPasswordApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      ElMessage.success('修改成功，请重新登录');
      setTimeout(() => {
        userStore.logout();
      }, 1000);
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
const { run: toChangePassword } = useRequest(useChangePasswordApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data?.data) {
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
  <div class="container">
    <div class="modify-form">
      <el-form
        :rules="rules"
        :model="ruleForm"
        ref="modifyForm"
        size="large"
        label-width="100px"
        @keyup.enter.native="submitForm"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            type="password"
            v-model.trim="ruleForm.oldPassword"
            autocomplete="new-password"
            placeholder="请输入旧密码"
            show-password
            maxlength="12"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="设置新密码" prop="newPassword">
          <el-input
            type="password"
            v-model.trim="ruleForm.newPassword"
            autocomplete="new-password"
            placeholder="请输入新密码"
            show-password
            clearable
            maxlength="12"
            minlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassWord">
          <el-input
            type="password"
            v-model.trim="ruleForm.confirmPassWord"
            autocomplete="new-password"
            placeholder="请再次输入密码"
            show-password
            clearable
            maxlength="12"
            minlength="8"
          ></el-input>
        </el-form-item>
        <div v-if="!loginType" class="question-title">设置您修改密码的个性化问题：</div>
        <el-form-item label="个性化问题" prop="question" v-if="!loginType">
          <el-input
            type="text"
            v-model.trim="ruleForm.question"
            show-word-limit
            placeholder="请输入您的个性化问题"
            clearable
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="问题答案" prop="answer" v-if="!loginType">
          <el-input
            type="text"
            v-model.trim="ruleForm.answer"
            show-word-limit
            placeholder="请输入问题答案"
            clearable
            maxlength="20"
          ></el-input>
        </el-form-item>
        <div class="button-group">
          <!-- <el-button @click="submitForm">取消</el-button> -->
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="loading">确定</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  .modify-form {
    margin-top: 2%;
    width: 50%;
    .question-title {
      margin: 15px 0;
      color: rgba(0, 127, 253, 1);
    }
    .el-form-item {
      margin-bottom: 30px;
    }
    .button-group {
      .el-button {
        width: 20%;
      }
      text-align: center;
    }
  }
}
</style>
