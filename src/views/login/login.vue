<script setup>
import { reactive, ref, toRefs, h, watchEffect, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginAdminApi, useGetQuestionApi, getLoginEntExpertApi, getCustomerToken } from './api';
import { useUserStore } from '@/store/modules/user';
import { PageEnum } from '@/enums/pageEnum';
import { Postcard, LocationFilled } from '@element-plus/icons-vue';
// 局部注册组件，需要单独引用组件样式
// 只提供局部引用的方式，不再采用插件形式，方便按需加载，减少主包大小
import SlideVerify from 'vue3-slide-verify';
import FindPassword from './components/FindPassword.vue';
import 'vue3-slide-verify/dist/style.css';
import { Avatar } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRequest } from 'v3hooks';
import { identity } from '@/utils/regExp.js';
import LoginNotice from './components/loginNotice.vue';
const fullscreenLoading = ref(false);
const activeName = ref('enterprise');
const router = useRouter();
const loginForm = ref(null);
const block = ref(null);
const technicalId = ref('');
const disabled = ref(true);
const dialogVisible = ref(false);
const checkDialogVisible = ref(false);
const question = ref('');
const userInfo = ref('');
const imgSource = ref([]);
const userStore = useUserStore();
const chooseTab = ref('enterprise');
// const { setNoticeDialog, noticeDialog } = userStore;
const tips = new Map([
  ['enterprise', '请输入企业统一社会信用代码或个人会员身份证号'],
  ['admin', '请输入账号'],
  ['expert', '请输入身份证号']
]);

watch(
  () => userStore.loginLoading,
  (val) => {
    console.log('val', val);
    fullscreenLoading.value = false;
  }
);

const state = reactive({
  ruleForm: {
    account: '',
    password: ''
  },
  rules: {
    account: [
      {
        required: true,
        trigger: ['blur', 'change'],
        validator: (rule, value, callback) => validAccount(rule, value, callback)
      }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        required: true,
        trigger: ['blur', 'change'],
        validator: (rule, value, callback) => validPassword(rule, value, callback)
      }
    ]
  }
});
const tabs = [
  {
    type: 'enterprise',
    label: '企业/个人登录',
    placeholder: '请输入统一社会信用代码/个人身份证号'
  },
  {
    type: 'admin',
    label: '管理员登录',
    placeholder: '请输入您的登录账号'
  },
  {
    type: 'expert',
    label: '专家登录',
    placeholder: '请输入您的身份证号'
  }
];
const { ruleForm, rules } = toRefs(state);
const getRandomImgs = (num) => {
  imgSource.value = [];
  for (let i = 1; i <= num; i++) {
    // imgSource.value.push(`/source/uploads/imgs/default_img${i}.jpg`);
    imgSource.value.push(`/slide-verify/default_img${i}.jpg`);
  }
};
watchEffect(() => {
  //获取随机图片
  getRandomImgs(10);
});

const { run: toLoginAdmin } = useRequest(useLoginAdminApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      userStore.login(data?.data.token, chooseTab.value);
    } else {
      ElMessage.error(data?.msg);
      block.value?.refresh();
      userStore.setLoginState(false);
    }
  },
  onError() {
    userStore.setLoginState(false);
  }
});
//登录企业/个人、专家
const { run: toLoginEntExpert } = useRequest(getLoginEntExpertApi, {
  manual: true,
  onSuccess: (data) => {
    if (data.success) {
      userInfo.value = data?.data;
      if (data?.data.roleList?.length > 1) {
        checkDialogVisible.value = true;
      } else {
        //企业个人登录直接进入，专家登录绑定组织机构id换取新token后登录
        if (chooseTab.value === 'enterprise') {
          userStore.login(data?.data?.token.token, chooseTab.value);
        } else {
          // userStore.setToken(data?.data?.token.token);
          toGetCustomerToken({
            organizationId: data?.data?.roleList?.length > 0 ? data?.data?.roleList[0].id : '',
            token: data?.data?.token.token
          });
        }
      }
    } else {
      ElMessage.error(data?.msg);
      block.value?.refresh();
      userStore.setLoginState(false);
    }
  },
  onError() {
    userStore.setLoginState(false);
  }
});
const { run: toGetCustomerToken } = useRequest(getCustomerToken, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      userStore.login(data?.data?.token, chooseTab.value);
    } else {
      //失败了清除原始token防止刷新进入界面
      userStore.setToken('');
      ElMessage.error(data?.msg);
    }
  }
});
const { run: toGetQuestion } = useRequest(useGetQuestionApi, {
  manual: true,
  onSuccess: (data) => {
    if (data?.success) {
      if (data.data) {
        dialogVisible.value = true;
        question.value = data?.data;
      } else {
        ElMessage.error(
          '找回密码失败！暂未找到您的密保信息。请先按照登录须知查询是否有登录权限，无登录权限的，请先申请入会。'
        );
      }
    } else {
      ElMessage.error(data?.msg);
    }
  }
});
const validPassword = (rule, value, callback) => {
  let space = new RegExp(/\s+/g);
  if (space.test(value)) {
    callback(new Error('密码不能包含空格！'));
  } else {
    callback();
  }
};
const validAccount = (rule, value, callback) => {
  if (!value) {
    callback(new Error(tips.get(chooseTab.value)));
  } else if (chooseTab.value === 'expert' && !identity.test(value)) {
    callback(new Error('请输入正确专家账号（身份证号码）'));
  } else {
    callback();
  }
};
const submitForm = () => {
  if (!disabled.value) {
    loginForm.value.validate(async (valid) => {
      if (valid) {
        userStore.setLoginState(true);
        if (chooseTab.value === 'admin') {
          toLoginAdmin(ruleForm.value);
        } else {
          toLoginEntExpert({
            ...ruleForm.value,
            customerType: chooseTab.value !== 'enterprise' ? 2 : 0
          });
        }
      }
    });
  }
};
//选择专家身份进入系统
const chooseTechnical = (id) => {
  // userStore.setToken(userInfo.value?.token.token);
  technicalId.value = id;
  fullscreenLoading.value = true;
  toGetCustomerToken({ organizationId: id, token: userInfo.value?.token.token });
};

const onAgain = () => {
  // 刷新
  block.value?.refresh();
};

const onSuccess = () => (disabled.value = false);

const onRefresh = () => (disabled.value = true);
const handleClick = (val) => {
  console.log(val);
  chooseTab.value = val?.props?.name;
  // 刷新
  block.value?.refresh();
  loginForm.value.resetFields();
};
const getPassword = () => {
  if (chooseTab.value === 'admin') {
    ElMessageBox.alert(
      h('p', null, [
        h('span', null, '管理员用户请联系系统管理员协助重置,如有疑问'),
        h('br'),
        h('span', null, '请咨询QQ：'),
        h('i', { style: 'color: #337ecc' }, '905875524')
      ]),
      '提示',
      {
        type: 'warning',
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道啦'
      }
    );
  } else {
    if (ruleForm.value.account) {
      toGetQuestion({ account: ruleForm.value.account });
    } else {
      ElMessage.error('请先输入账号！');
    }
  }
};
const setDialogVisible = (isTrue) => {
  dialogVisible.value = isTrue;
};

</script>
<template>
  <el-container class="login-body">
    <el-main>
      <div class="login-container">
        <div class="form-login">
          <el-row>
            <el-col>
              <el-form label-position="top" :rules="rules" :model="ruleForm" ref="loginForm"
                @keyup.enter.native="submitForm">
                <el-tabs :stretch="true" v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.type">
                    <el-form-item prop="account">
                      <el-input type="text" clearable maxlength="20" v-model.trim="ruleForm.account"
                        :prefix-icon="Postcard" autocomplete="off" :placeholder="item.placeholder"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <el-input type="password" clearable show-password maxlength="20" v-model.trim="ruleForm.password"
                        :prefix-icon="LocationFilled" autocomplete="off" placeholder="请输入密码"></el-input>
                    </el-form-item>
                  </el-tab-pane>
                </el-tabs>
              </el-form>
            </el-col>
            <el-col class="password-link">
              <el-link :underline="false" @click="getPassword">忘记密码</el-link>
            </el-col>
            <el-col>
              <slide-verify ref="block" slider-text="向右滑动解锁登录" :accuracy="accuracy" :h="100" :w="336" :imgs="imgSource"
                @again="onAgain" @success="onSuccess" @fail="onFail" @refresh="onRefresh"></slide-verify>
            </el-col>
            <el-col>
              <el-button style="width: 100%; height: 40px" type="primary" :disabled="disabled" @click="submitForm"
                :loading="userStore.loginLoading">
                立即登录
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <find-password v-model:dialogVisible="dialogVisible" :questions="question" :account="ruleForm.account"
        @setDialogVisible="setDialogVisible"></find-password>
      <el-dialog v-model="checkDialogVisible" width="30%" title="请选择身份进入平台" center :show-close="false"
        :close-on-click-modal="false" class="checkIdentity-dialog">
        <div class="box-card">
          <el-card shadow="hover" v-for="item in userInfo.roleList" :key="item.id" @click="chooseTechnical(item.id)"
            v-loading="technicalId === item.id && fullscreenLoading">
            <div class="technical-card" :title="item.name">
              <Avatar color="#007FFD"></Avatar>
              {{ item.name.length > 5 ? item.name.substr(0, 5) + '...' : item.name }}
            </div>
          </el-card>
        </div>
      </el-dialog>
    </el-main>
    <el-footer>
      <div class="web-info">
        <div>
          <span>
            主办单位：
            <a style="color: #409eff" :underline="false" href="http://www.ahzjxh.org.cn" target="_blank">
              xxx
            </a>
          </span>
          <span>
            技术支持：
            <a style="color: #409eff" :underline="false" href="http://www.futuresoft.com.cn" target="_blank">
              南京未来高新技术有限公司
            </a>
          </span>
        </div>
        <div>
          <span>本系统建议浏览器：谷歌浏览器、360/搜狗/QQ等浏览器极速模式</span>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>
<style scoped lang="less">
.login-body {
  width: 100%;
  height: 100%;
  background-color: #fff;
  background-image: url('@/assets/img/bg.png');
  background-repeat: no-repeat;
  background-position: 100% 100%;
  background-size: 100%;
}

.login-container {
  float: left;
  position: absolute;
  top: 17%;
  right: 10%;

  .form-login {
    .el-row {
      width: 80%;
    }

    .slide-verify {
      margin: auto;
    }

    width: 420px;
    height: 520px;
    display: flex;
    margin-right: 10%;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
    justify-content: center;
    padding-top: 5%;

    //align-items: center;
    .el-tabs__item.is-active {
      font-size: 25px;
    }
  }
}

.link-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1%;
}

.system-info {
  font-size: 14px;
  line-height: 25px;
  color: #333333;

  span {
    margin-right: 12px;
  }

  a {
    color: #409eff;
  }
}

.web-info {
  text-align: center;

  div {
    margin-bottom: 10px;

    span {
      margin-left: 70px;
    }
  }
}

.password-link {
  text-align: right;
}

.checkIdentity-dialog .el-row .el-col {
  margin: 10px;
}

.technical-card {
  text-align: center;
}

.box-card {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;

  .el-card {
    width: 27%;
    height: 30%;
    margin: 10px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
