<template>
  <el-row>
    <el-col :span="23">
      <el-tabs
        v-model="currentRouteName"
        type="card"
        height="30px"
        class="top-tabs"
        @tab-remove="handleTabsRemove"
        @tab-click="handleRouter"
        @mousewheel.prevent="handleScroll"
      >
        <el-tab-pane
          v-for="item in tabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.name !== userStore.getHomeRoutePath"
        >
          <template #label>
            <span class="custom-tabs-label" v-if="item.name === userStore.getHomeRoutePath">
              <el-icon><HomeFilled /></el-icon>
              <span>{{ item.title }}</span>
            </span>
            <span v-else>
              {{ item.title }}
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-col :span="1">
      <el-dropdown class="options" trigger="click">
        <el-icon :size="18" style="width: 40px; height: 40px">
          <!-- <Setting /> -->
          <ArrowDown />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleCloseAll">
              <el-icon><Close /></el-icon>
              <span>关闭所有页签</span>
            </el-dropdown-item>
            <!-- <el-dropdown-item @click="handleRefreshRoute">
              <el-icon><Close /></el-icon>
              <span>刷新当前页签</span>
            </el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script setup>
import { watch, computed, ref, onMounted } from 'vue';
import { useTabsStore } from '@/store/modules/tabs';
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';
import { appStoreWithOut } from '@/store/modules/app';
import { useRoute, useRouter } from 'vue-router';
import { WithInRoutes } from '@/router/basic.js';
const route = useRoute();
const currentRouteName = ref(route.name);
const router = useRouter();
const tabStore = useTabsStore();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
const tabs = computed(() => tabStore.tabs);
onMounted(() => {
  redirectRoute();
});
// 监听路由改变 若tabs中不存在当前路由，则增加路由
watch(
  () => route.name,
  () => {
    currentRouteName.value = route.name;
    const userRoutes = permissionStore.getUserRoutes;
    // 获取当前路由所在tabs的下标
    const index = tabs.value.findIndex((item) => item.name === route.name);
    // 当前路由地址是否匹配用户路由表
    const hasRoute = userRoutes && userRoutes.find((i) => i.name === route.name);
    // 当前索引不存在 && 匹配路由表，则增加路由到tabs
    if (index < 0 && hasRoute) {
      tabStore.handleAddRoute(route);
    }
  },
  {
    immediate: true
  }
);
// 外部组件监听调用关闭方法
watch(
  () => tabStore.pageCloseName,
  (newVal) => {
    if (newVal) {
      handleTabsRemove(newVal);
      setTimeout(() => {
        tabStore.closePageNameTab('');
      }, 300);
    }
  }
);
// 初次加载时，若当前地址无效，则重定向到首页（避免权限更改时，页面显示404）
function redirectRoute() {
  const withInRoute = WithInRoutes.find((i) => i.name === route.name);
  if (withInRoute) return; // 忽略无需权限鉴权的路由
  const userRoutes = permissionStore.getUserRoutes;
  const index = tabs.value.findIndex((item) => item.name === route.name);
  const hasRoute = userRoutes && userRoutes.find((i) => i.name === route.name);
  // 当前索引不存在 && 未匹配路由表
  if (index < 0 && !hasRoute) {
    router.push({
      path: userStore.getHomeRoutePath
    });
  }
}
// 路由跳转
function handleRouter(pane) {
  const currentRoute = tabs.value.find((i) => i.name === pane.props.name);
  // appStoreWithOut.setCacheAppName(pane.props.name);
  router.push({
    name: currentRoute.name,
    params: currentRoute.params,
    query: currentRoute.query
  });
}
// 关闭当前页签
function handleTabsRemove(paneName) {
  const currentRoute = tabs.value.find((i) => i.name === paneName);
  const index = tabs.value.findIndex((i) => i.name === paneName);
  tabStore.handleClose(index);
  const targetIndex = tabs.value[index]?.name ? index : index - 1;
  const isCurrentRoute = currentRoute.name === currentRouteName.value;
  // 清除当前路由缓存
  appStoreWithOut.clearCacheAppName(paneName);
  // 如果无法打开下一个，则跳转首页
  if (targetIndex < 0) {
    return router.push({
      path: userStore.getHomeRoutePath
    });
  }
  // 如果关闭的是当前路由，则跳转到tabs的下一个路由
  if (isCurrentRoute) {
    return router.push({
      name: tabs.value[targetIndex].name,
      query: tabs.value[targetIndex].query,
      params: { ...tabs.value[targetIndex].params, refresh: 999 }
    });
  }
}
// const handleCloseOther = () => {
//   // 如果当前路由与右击页签路由不一致，则跳转至右击页签的路由
//   if (currentRouteName.value !== tabs.value[currentContextIndex.value].name) {
//     router.push({
//       name: tabs.value[currentContextIndex.value].name,
//       query: tabs.value[currentContextIndex.value].query,
//       params: tabs.value[currentContextIndex.value].params
//     });
//   }
//   tabStore.handleCloseOther(currentContextIndex.value);
// };
// 关闭所有页签（除了首页）
function handleCloseAll() {
  router.push({
    path: userStore.getHomeRoutePath
  });

  tabStore.handleCloseAll();
}
// 刷新当前路由
function handleRefreshRoute() {
  appStoreWithOut.clearCacheAppName(route.name);
}
</script>
<style lang="less" scoped>
.top-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs__item.is-active) {
    border-bottom-color: transparent;
  }
  :deep(.el-tabs__nav-prev) {
    width: 20px;
    background-color: #e3ebf5;
    text-align: center;
  }
  :deep(.el-tabs__nav-next) {
    width: 20px;
    background-color: #e3ebf5;
    text-align: center;
  }
}
.options {
  height: 40px;
  .abs-center;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #e4e7ed;
}
.custom-tabs-label .el-icon {
  vertical-align: -2px;
}
.custom-tabs-label span {
  margin-left: 4px;
}
</style>
