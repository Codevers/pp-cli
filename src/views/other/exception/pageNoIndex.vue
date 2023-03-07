<script setup>
import { router } from '@/router';
</script>

<template>
  <div class="page-content">
    <div class="content">
      <SvgIcon name="not-found" size="450px" />
      <p>哎呀～该账号未分配工作台</p>
    </div>
  </div>
</template>

<style scoped lang="less">
.page-content {
  height: 100%;
  background: #fff;
  .abs-center;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      font-size: 18px;
      color: #272829;
    }
    .btn {
      margin-top: 30px;
      width: 135px;
      height: 40px;
      background-color: #007ffd;
      color: #fff;
      font-size: 14px;
      .abs-center;
      border-radius: 20px;
    }
  }
}
</style>
