<script setup>
import { ref } from 'vue';
import { appStoreWithOut } from '@/store/modules/app';
const drawer = ref(false);

function navModeSetting(value) {
  drawer.value = false;
  setTimeout(() => {
    appStoreWithOut.setNavMode(value);
  }, 150);
}

function open() {
  drawer.value = true;
}
// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});
</script>
<template>
  <el-drawer v-model="drawer" title="系统配置" direction="rtl" :size="300">
    <el-divider content-position="left">导航栏模式</el-divider>
    <div class="nav-mode-card">
      <el-tooltip effect="dark" content="左侧菜单模式" placement="bottom">
        <div
          class="nav-mode-card__item nav-mode-card__item--mix"
          :class="appStoreWithOut.navMode == 1 && 'nav-mode-card__item--active'"
          @click="navModeSetting(1)"
        >
          <div class="mix-sidebar"></div>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="顶部菜单模式" placement="bottom">
        <div
          class="nav-mode-card__item nav-mode-card__item--top-menu"
          :class="appStoreWithOut.navMode == 2 && 'nav-mode-card__item--active'"
          @click="navModeSetting(2)"
        >
          <div class="mix-sidebar"></div>
        </div>
      </el-tooltip>
    </div>
  </el-drawer>
</template>
<style scoped lang="less">
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007ffd;
  padding: 0 30px;
  .left {
    overflow: hidden;
  }
  .center {
    flex: 1;
  }
  .right {
    display: flex;
    align-items: center;
    margin-right: 20px;
    .indexEntry {
      min-width: 100px;
      padding: 0 15px;
      height: 30px;
      border-radius: 15px;
      transition: 0.2s;
      cursor: pointer;
      .abs-center;
      span {
        color: #fff;
        margin-left: 10px;
      }
      &:hover,
      &.active {
        background-color: #286cd8;
      }
    }
    .pubilcityName {
      color: #fff;
      &:hover {
        color: #eeebe6;
      }
    }
    .nickname {
      margin-left: 20px;
      .abs-center;
      cursor: pointer;
      color: #fff;
      .logout {
        margin-left: 15px;
        cursor: pointer;
      }
    }
    .systemIcon {
      cursor: pointer;
      .abs-center;
      margin-left: 10px;
    }
  }
}
</style>
