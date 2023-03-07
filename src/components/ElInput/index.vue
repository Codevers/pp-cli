<template>
  <el-input
    maxlength="100"
    clearable
    :placeholder="`请输入${formItem?.label || ''}`"
    :class="class"
    :style="style"
    v-model.trim="model"
  >
    <template v-for="(slot, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </el-input>
</template>

<script setup>
import { inject } from 'vue';
import { ElInput, formItemContextKey } from 'element-plus';
const formItem = inject(formItemContextKey);
</script>
