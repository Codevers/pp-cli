<script setup>
import { ref, reactive, toRefs } from 'vue';
import { rulePassword } from '@/config/reg-validate';
import { Postcard, LocationFilled } from '@element-plus/icons-vue';
import { useUserStoreWithOut } from '@/store/modules/user';
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  close: {
    type: Function,
    default: (fun) => fun()
  },
  confirm: {
    type: Function,
    default: (fun) => fun()
  }
});
const formRefs = ref(null);
const { show } = toRefs(props);
const userStore = useUserStoreWithOut();
const state = reactive({
  ruleForm: {
    account: '',
    password: ''
  },
  rules: {
    account: [{ required: true, message: '账号不可为空', trigger: 'blur' }],
    password: [
      { required: true, message: '密码不可为空', trigger: 'blur' },
      {
        required: true,
        trigger: ['change', 'blur'],
        validator: validatePass
      }
    ]
  }
});
const { ruleForm, rules } = toRefs(state);

function validatePass(rule, value, callback) {
  if (!rulePassword.rule.test(value)) {
    return callback(new Error(rulePassword.tip));
  }
  callback();
}
const emits = defineEmits(['update:show']);

function loginOut() {
  props.close();
  // userStore.logout();
}

function loginAgain() {
  formRefs.value.validate(async (valid) => {
    if (valid) {
      emits('update:show', false);
      props.confirm({ a: 1 });
    }
  });
}
</script>
<template>
  <el-dialog
    v-model="show"
    width="25%"
    title="重新登录"
    :show-close="false"
    :center="true"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-form
      :rules="rules"
      :model="ruleForm"
      ref="formRefs"
      class="modify-form"
      label-width="100px"
    >
      <el-form-item label="登录账号" prop="account">
        <el-input
          type="text"
          v-model.trim="ruleForm.account"
          :prefix-icon="Postcard"
          autocomplete="off"
          placeholder="请输入登录账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input
          type="password"
          show-password
          v-model.trim="ruleForm.password"
          :prefix-icon="LocationFilled"
          autocomplete="off"
          placeholder="请输入登录密码"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="loginOut()">退出</el-button>
      <el-button type="primary" @click="loginAgain()" :loading="loading">登录</el-button>
    </template>
  </el-dialog>
</template>
