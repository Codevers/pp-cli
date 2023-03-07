<!--
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-28 09:27:09
 * @LastEditors: wsy
 * @LastEditTime: 2022-08-03 17:11:58
-->
<script setup>
import { ref, reactive, toRefs } from 'vue';
// import { useLoginWithOut } from "@/store/modules/login.js";
import { Postcard, LocationFilled } from '@element-plus/icons-vue';
const props = defineProps({
  type: String,
  placeholder: String
});
const loginForm = ref(null);
const msg = ref('');
const isFind = ref(false);
// const store =useLoginWithOut();
const block = ref(null);
//const { data, run: toLogin, loading } = useLoginApi()
const state = reactive({
  ruleForm: {
    username: '',
    password: ''
  },
  rules: {
    username: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
  }
});
//const emits = defineEmits('getPassword');
const submitForm = () => {
  console.log(loginForm);
  emits('submitForm', loginForm);
};
// const getPassword = () => {
//   store.isShow =false
//   store.isFind = true
// }
const { ruleForm, rules } = toRefs(state);
const { type, placeholder } = toRefs(props);
</script>
<template>
  <el-form
    label-position="top"
    :rules="rules"
    :model="ruleForm"
    ref="loginForm"
    class="login-form"
    @keyup.enter.native="submitForm"
  >
    <el-form-item label="" prop="username">
      <el-input
        type="text"
        v-model.trim="ruleForm.username"
        :prefix-icon="Postcard"
        autocomplete="off"
        :placeholder="placeholder"
      ></el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input
        type="password"
        v-model.trim="ruleForm.password"
        :prefix-icon="LocationFilled"
        autocomplete="off"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <div class="password-link">
      <el-link :underline="false" @click="getPassword">忘记密码</el-link>
    </div>
    <el-form-item>
      <slide-verify ref="block"></slide-verify>
    </el-form-item>
    <el-form-item>
      <el-button style="width: 100%" type="primary" @click="submitForm" :loading="loading">
        立即登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="less">
.login-form {
  width: 100%;
  margin: 0 auto;
  .password-link {
    margin: auto 0 10px 80%;
  }
}
</style>
