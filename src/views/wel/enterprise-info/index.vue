<!-- 企业基本信息 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import EnterpriseInfo from '@/components/enterprise-info/index.vue';
// import enterpriseUser from '@/components/enterprise-user/index.vue';
const state = reactive({
  name: '企业基本信息',
  activeName: 'enterprise-info'
});
const enterpriseInfo = ref(null);
onMounted(() => {});
const { name, activeName } = toRefs(state);

const handleClick = (tab, event) => {
  console.log(tab, event);
};
//企业信息同步
const updataMessage = () => {
  enterpriseInfo.value.updataMessage();
};
</script>

<template>
  <div class="main-content">
    <div class="main-table-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="企业基本信息" name="enterprise-info">
          <EnterpriseInfo ref="enterpriseInfo" />
        </el-tab-pane>
      </el-tabs>
      <div class="btnRight">
        <el-button type="primary" @click="updataMessage">企业信息同步</el-button>
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
