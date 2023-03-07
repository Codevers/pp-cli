<!-- 人员基本信息 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import EnterpriseUser from '@/components/enterprise-user/index.vue';
const state = reactive({
  name: '人员基本信息',
  activeName: 'enterprise-user'
});
const enterpriseUser = ref(null);
onMounted(() => {});
const { name, activeName } = toRefs(state);

const handleClick = (tab, event) => {
  console.log(tab, event);
};

//人员信息同步
const updataMessage = () => {
  enterpriseUser.value.updataMessage();
};
</script>

<template>
  <div class="main-content">
    <div class="main-table-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="人员基本信息" name="enterprise-user">
          <EnterpriseUser ref="enterpriseUser" />
        </el-tab-pane>
      </el-tabs>
      <div class="btnRight">
        <el-button type="primary" @click="updataMessage">人员信息同步</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.main-table-content {
  position: relative;
  .btnRight {
    position: absolute;
    top: 15px;
    right: 20px;
  }
}
</style>
