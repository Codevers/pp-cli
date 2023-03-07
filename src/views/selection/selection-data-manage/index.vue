<script setup>
import { provide, ref } from 'vue';
import Enterprise from './views/Enterprise.vue';
import Personal from './views/Personal.vue';
import { getCountByType, GetDictionaryApi } from '@/api/common.js';

const active = ref('0');
const count = ref({ enterpriseActivityCount: '', personActivityCount: '' });
getCountByType({ type: 'CITY_SELECTION_DATA_MANAGE' }).then(({ data }) => (count.value = data));
// 活动状态 下拉数据
const activityStatus = ref([]);
GetDictionaryApi({ category: 12 }).then(
  ({ data }) =>
    (activityStatus.value = data?.filter((item) => !['未发布', '已发布'].includes(item.value)))
);
provide('activityStatus', activityStatus);

// 申报状态 下拉数据
const declareStatus = ref([]);
GetDictionaryApi({ category: 11 }).then(({ data }) => (declareStatus.value = data));
provide('declareStatus', declareStatus);

// 认定结果 下拉数据
const selectionResults = ref([]);
GetDictionaryApi({ category: 13 }).then(({ data }) => (selectionResults.value = data));
provide('selectionResults', selectionResults);
</script>

<template>
  <el-tabs type="card" class="tabs-view" v-model="active">
    <el-tab-pane :label="`企业认定（${count?.enterpriseActivityCount}）`" name="0">
      <Enterprise v-if="active === '0'" />
    </el-tab-pane>
    <el-tab-pane :label="`个人认定（${count?.personActivityCount}）`" name="1" lazy>
      <Personal v-if="active === '1'" />
    </el-tab-pane>
  </el-tabs>
</template>

<style lang="less" scoped>
.tabs-view {
  padding: 5px;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  --el-tabs-header-height: 42px;

  :deep(.el-tabs__header) {
    margin-bottom: 0;
    border: 0;
    background-color: #eff2fa;
  }

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
    background-color: #fff;
  }

  :deep(.el-tabs__nav) {
    border: 0;
  }

  :deep(.el-tabs__item) {
    border: 0;
    font-size: 15px;
    font-weight: normal;
    padding: 0 15px;

    &.is-active {
      background-color: #fff;
      color: #007ffd;
      border-top: 4px solid #007ffd;
    }
  }

  .el-tab-pane {
    height: 100%;
  }

  .main-content {
    padding: 0;
  }
}
</style>
