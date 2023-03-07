<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { appStoreWithOut } from '@/store/modules/app';
import LeftSide from './LeftSide.vue';
import { ElMessageBox } from 'element-plus';
import SystemConfig from './SystemConfig.vue';

const userStore = useUserStore();
const router = useRouter();
const systemConfig = ref(null);
const { organizationName, userName, typeKey } = userStore.userInfo;
//适配不同接口的显示字段
const nickName =
  userStore.loginType === 'enterprise' ? userName : `${userName} (${organizationName})`;

function handleSignOut() {
  ElMessageBox.confirm('您确认要退出系统吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout();
  });
}
</script>
<template>
  <div class="header" id="layoutHeader">
    <div class="left">
      <SvgIcon v-if="typeKey == '0' || typeKey == '1'" name="header-logo1" size="550px" />
      <SvgIcon v-else name="header-logo2" size="550px" />
    </div>
    <div class="center" v-if="appStoreWithOut.navMode == 2">
      <LeftSide />
    </div>
    <div class="right">
      <router-link class="pubilcityName" :to="{ path: '/publicity/index' }" tag="a" target="_blank">
        <SvgIcon name="public-site" size="16" color="#fff" style="margin-right: 5px" />
        公示平台
      </router-link>
      <div class="nickname">
        <span>{{ nickName }}</span>
      </div>
      <div class="systemIcon" @click="systemConfig.open()">
        <el-icon :size="18" color="#fff">
          <Setting />
        </el-icon>
      </div>
      <div class="systemIcon" @click="handleSignOut()">
        <SvgIcon name="login-out" size="16px" color="#fff"></SvgIcon>
      </div>
    </div>
  </div>
  <SystemConfig ref="systemConfig"></SystemConfig>
</template>
<style scoped lang="less">
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #007ffd;
  background: linear-gradient(90deg, #1d42ab, #2173dc, #1e93ff);
  padding: 0 30px;

  .left {
    margin-top: 7px;
    overflow: hidden;
    font-weight: bold;
  }

  .center {
    flex: 1;
  }

  .right {
    display: flex;
    align-items: center;

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
      display: flex;
      align-items: center;

      &:hover {
        color: #eeebe6;
      }
    }

    .nickname {
      margin: 0 0 0 20px;
      .abs-center;
      color: #fff;

      .nick-avatar {
        width: 35px;
        height: 35px;
        background-color: #fff;
        border-radius: 50%;
        .abs-center;
        color: #333;
        font-size: 14px;
        margin-right: 10px;
      }

      .logout {
        margin-left: 15px;
        cursor: pointer;
      }
    }

    .systemIcon {
      padding: 4px;
      cursor: pointer;
      transition: 0.2s;
      border-radius: 4px;
      .abs-center;
      margin-left: 12px;

      &:hover {
        background-color: #286cd8;
      }
    }
  }
}
</style>
