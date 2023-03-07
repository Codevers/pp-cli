<template>
  <el-select
    clearable
    :placeholder="`请选择${formItem?.label || ''}`"
    :class="class"
    :style="style"
  >
    <template v-for="(slot, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </el-select>
</template>

<script setup>
import { inject } from 'vue';
import { ElSelect, formItemContextKey } from 'element-plus';
const formItem = inject(formItemContextKey);
</script>
