<script setup>
import { ref, reactive, toRefs } from 'vue';
// import { useLoginWithOut } from "@/store/modules/login.js";
// const store =useLoginWithOut();
const resetForm = ref(null);
const state = reactive({
  ruleForm: {
    newPassword: '',
    confirmPassWord: '',
    question: '',
    answer: ''
  },
  rules: {
    newPassword: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        required: false,
        message: '密码长度为8-12个字符，且包含数字、字母、符号3种组合，字母区分大小写',
        trigger: 'blur'
      }
    ],
    confirmPassWord: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    question: [{ required: true, message: '问题不能为空', trigger: 'blur' }],
    answer: [{ required: true, message: '答案不能为空', trigger: 'blur' }]
  }
});
// const cancel = () => {
//   store.isReset = false;
//   store.isShow = true;
// };
// const submit = () => {
//     store.isFind = false;
//     store.isReset = true;
// };
const { ruleForm, rules } = toRefs(state);
</script>
<template>
  <el-form
    :rules="rules"
    :model="ruleForm"
    ref="resetForm"
    class="login-form"
    label-position="top"
    @keyup.enter.native="submit"
  >
    <el-form-item>
      <div class="title">修改密码</div>
    </el-form-item>
    <el-form-item label="设置新密码" prop="newPassword">
      <el-input
        type="password"
        v-model.trim="ruleForm.newPassword"
        autocomplete="off"
        placeholder="请输入新密码"
        maxlength="12"
        minlength="8"
      ></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="confirmPassWord">
      <el-input
        type="password"
        v-model.trim="ruleForm.confirmPassWord"
        autocomplete="off"
        placeholder="请再次输入密码"
        maxlength="12"
        minlength="8"
      ></el-input>
    </el-form-item>
    <el-form-item label="">
      <span>设置您找回密码的个性化问题：</span>
    </el-form-item>
    <el-form-item label="个性化问题" prop="question">
      <el-input
        type="text"
        v-model.trim="ruleForm.question"
        autocomplete="off"
        show-word-limit
        placeholder="请输入您的个性化问题"
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
        maxlength="20"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <div class="button-group">
        <el-button @click="cancel" :loading="loading">取消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>
<style scoped lang="less">
.login-form {
  width: 80%;
  margin: 0 auto;
  .title {
    margin: 0 auto;
    font-size: 25px;
  }
  .button-group {
    margin: 0 auto;
  }
}
</style>
