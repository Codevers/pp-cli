<!-- 认定须知-->
<script setup>
import { onMounted, reactive, toRefs, ref, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useRequest from '@/hooks/use-request';
import { ElForm, ElMessage } from 'element-plus';
import { mobilePhone } from '@/utils/regExp.js';
import { activityApi, infoApi } from '@/api/enterpriseKpi.js';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const { typeKey } = userStore.userInfo;

const router = useRoute();
const goPath = useRouter();
const state = reactive({
  disabled: true,
  activityTopic: '',
  time: 10
});
const { activityTopic, disabled, time } = toRefs(state);
const content = ref('');
const submitFormRef = ref(ElForm);
const submitForm = ref({
  reportName: '',
  reportPhoneNum: ''
});
const reportPhoneNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入上报人手机号'));
    return;
  }
  if (mobilePhone.test(value)) {
    //合法的邮箱
    return callback();
  } else {
    callback(new Error('请输入正确手机号'));
  }
};

const rules = {
  reportName: [{ required: true, message: '请输入上报人姓名', trigger: 'blur' }],
  reportPhoneNum: [{ required: true, validator: reportPhoneNum, trigger: 'blur' }]
};
//查询申报明细 (Auth)
const { run: activityFun } = useRequest(activityApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      state.activityTopic = data.data.activityTopic;
      content.value.contentDocument.body.innerHTML = data.data.selectionNotice;
    }
  }
});

// 新增申报信息
const { run: infoFun } = useRequest(infoApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      goPath.push({
        path: '/wel/enterpriseKpi/index',
        query: { id: router.query.id, type: true, category: router.query.category }
      });
    } else {
      ElMessage.error(data.msg);
    }
  }
});
const submit = () => {
  submitFormRef.value.validate((valid) => {
    if (valid) {
      infoFun({ activityId: router.query.id, ...submitForm.value });
    }
  });
};
const close = () => {
  goPath.push({
    path: '/workbench/index'
  });
};

onMounted(() => {
  activityFun({ activityId: router.query.id });
  let times = null;
  times = setInterval(() => {
    state.time = time.value - 1;
    if (state.time == 0) {
      state.disabled = false;
      times = null;
    }
  }, 1000);

  //强制更改 iframe 中样式
  nextTick(() => {
    content.value.contentDocument.body.style.wordBreak = 'break-all';
  });
});

const pdfUrl =
  typeKey === 0
    ? '/operationManual/安徽省工程造价咨询行业优秀企业申报系统操作手册.pdf'
    : typeKey === 1
    ? '/operationManual/安徽省工程造价咨询行业优秀个人申报系统操作手册.pdf'
    : '';
</script>
<template>
  <div class="box">
    <div class="header">
      <div class="header-btn">
        <div class="head-title">{{ activityTopic }}</div>
        <a target="_blank" :href="pdfUrl">
          <el-button type="warning" round style="margin-left: 20px">认定申请操作手册</el-button>
        </a>
      </div>
    </div>
    <el-card class="box-card">
      <h3 class="title">“{{ activityTopic }}”认定须知</h3>
      <iframe src="about:blank" ref="content" frameborder="0" width="100%" height="460"></iframe>
    </el-card>

    <el-card class="footer">
      <el-form
        :inline="true"
        :model="submitForm"
        label-width="150px"
        ref="submitFormRef"
        :rules="rules"
      >
        <el-form-item label="上报人姓名" prop="reportName">
          <el-input
            v-model.trim="submitForm.reportName"
            placeholder="请输入"
            maxlength="20"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item label="上报人手机号码" prop="reportPhoneNum">
          <el-input
            v-model.trim="submitForm.reportPhoneNum"
            placeholder="请输入"
            maxlength="11"
            clearable
            style="width: 200px"
          />
        </el-form-item>
      </el-form>
      <section style="text-align: center">
        <el-button
          type="primary"
          :disabled="disabled"
          @click="submit"
          class="btn"
          style="margin-right: 30px"
        >
          我已阅读完成，继续填报
          <span v-show="disabled">({{ time }}s)</span>
        </el-button>
        <el-button class="btn" @click="close">暂不填报，回到工作台</el-button>
      </section>
    </el-card>
  </div>
</template>

<style scoped lang="less">
.header {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding: 0 14px;
  background-image: url('../../../assets/img/kpiHeade.jpg');
  background-size: 100% 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-btn {
    display: flex;
  }

  .head-title {
    font-weight: bold;
    font-size: 20px;
    margin-left: 35px;
    margin-right: 50px;
    color: white;
    line-height: 32px;
  }
}

.box-card {
  box-sizing: border-box;
  height: 100%;
  padding: 20px 30px;
  margin-top: 14px;
}

.title {
  height: 26px;
  text-align: center;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 700;
  color: #323232;
  line-height: 26px;
}

.footer {
  margin-top: 14px;
  display: flex;
  justify-content: center;

  .btn {
    height: 40px;
    margin: 0 15px;
  }
}
</style>
