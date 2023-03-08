<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { appStoreWithOut } from '../store/modules/app';
import Header from './Header.vue';
import LeftSide from './LeftSide.vue';
const currentRoute = useRoute();
const viewKey = computed(() => currentRoute.path || Date.now());
</script>
<template>
  <el-container class="layout">
    <el-header height="60px">
      <Header />
    </el-header>
    <el-container class="container">
      <LeftSide v-if="appStoreWithOut.navMode == 1"></LeftSide>
      <el-container class="content">
        <el-header height="40px" style="background-color: #ebf4ff">
          <PageTabs></PageTabs>
        </el-header>
        <el-main>
          <router-view v-slot="{ Component, route }">
            <keep-alive :exclude="appStoreWithOut.destroyNames">
              <component :is="Component" :key="viewKey" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<style scoped lang="less">
:deep(.el-main) {
  --el-main-padding: 12px;
}
:deep(.el-header) {
  --el-header-padding: 0px;
}

.layout {
  background-color: #ffffff;
}
.container {
  height: calc(100vh - 60px);
}

.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
  background: #f2f6fb;
  .main {
    height: 100%;
    overflow: auto;
  }
}
.full-screen-view {
  width: 24px;
  height: 24px;
  background-color: #fff;
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: 0px;
  .abs-center;
  &:hover {
    .full-icon {
      color: #007ffd;
    }
  }
}
.content-main {
  height: 100%;
  position: relative;
  background-color: #f2f6fb;
}
</style>
<style lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
