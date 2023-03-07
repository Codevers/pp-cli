<script setup>
import { reactive, computed, toRaw, ref } from 'vue';
import MenuTree from './MenuTree.vue';
import { useRouter } from 'vue-router';
import { appStoreWithOut } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';
const permissionStore = usePermissionStore();
const { navMode } = appStoreWithOut;

const router = useRouter();
const state = reactive({
  showMenu: true,
  expandKeys: ['0']
});

const activeRoute = computed(() => {
  return toRaw(router).currentRoute.value.fullPath;
});

const isCollapse = ref(false);

function expandChange(key) {
  state.expandKeys = [key.toString()];
}
// function handleControl() {
//   isCollapse.value = !isCollapse.value;
// }
</script>
<template>
  <el-aside :class="appStoreWithOut.navMode == 2 ? 'aside-horizontal' : 'aside-vertical'">
    <el-menu
      router
      :default-active="activeRoute"
      :default-openeds="state.expandKeys"
      :collapse="isCollapse"
      :mode="appStoreWithOut.navMode == 2 ? 'horizontal' : 'vertical'"
      :class="appStoreWithOut.navMode == 2 ? 'el-menu-horizontal' : 'el-menu-vertical'"
      @open="expandChange"
    >
      <MenuTree :menuList="permissionStore.sideMenu"></MenuTree>
    </el-menu>
    <!-- <div class="side-control" @click="handleControl">折叠</div> -->
  </el-aside>
</template>
<style scoped lang="less">
.aside-horizontal {
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
}
.aside-vertical {
  width: 280px !important;
  overflow: hidden;
  overflow-y: auto;
  overflow: -moz-scrollbars-none;
  border-right: 1px solid #e8e9eb;
}
.aside::-webkit-scrollbar {
  display: none;
}
</style>
<style>
.el-menu {
  border-right: none;
}
</style>
