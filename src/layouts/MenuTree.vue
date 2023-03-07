<script setup>
import MenuTree from './MenuTree.vue';
import { appStoreWithOut } from '@/store/modules/app';
defineProps({
  menuList: Array
});
// 设置路由缓存
function changeRouter(index) {
  appStoreWithOut.setCacheAppName(index);
}
</script>

<template>
  <div v-for="(item, index) in menuList" :key="item.id">
    <template v-if="!item.children || item?.children?.length == 0">
      <el-menu-item
        :index="item.index"
        @click="changeRouter(item.index)"
        :class="item.level === 1 && 'first-item'"
      >
        <SvgIcon
          :name="item.icon"
          size="16px"
          :color="appStoreWithOut.navMode == 1 ? '#4A4A4A' : '#FFFFFF'"
          style="margin-right: 8px"
        ></SvgIcon>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </template>

    <el-sub-menu v-else :index="index + item.name">
      <template #title>
        <SvgIcon
          :name="item.icon"
          size="16px"
          :color="appStoreWithOut.navMode == 1 ? '#4A4A4A' : '#FFFFFF'"
          style="margin-right: 8px"
        ></SvgIcon>
        <span>{{ item.name }}</span>
      </template>
      <!-- v-bind="$attrs" 设置这个属性，可以将子菜单的事件递归 -->
      <MenuTree v-bind="$attrs" :menuList="item.children"></MenuTree>
    </el-sub-menu>
  </div>
</template>

<style scoped lang="less">
:deep(.first-item) {
  background-color: #f8fbff;
  border-radius: 8px;
  margin: 15px 15px;
  padding: 0 20px;
}
</style>
