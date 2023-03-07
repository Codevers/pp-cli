<script setup>
import { onMounted, reactive, ref, watch, watchEffect } from 'vue';
const state = reactive({
  name: '首页面板'
});

watchEffect(() => {});
</script>

<template>
  <h1>{{ state.name }}</h1>
</template>

<style scoped lang="less">
.read-the-docs {
  color: #888;
}
</style>
