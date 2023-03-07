<template>
  <el-dialog
    :class="class"
    :style="style"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <template v-for="(slot, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </el-dialog>
</template>

<script setup>
import { ElDialog } from 'element-plus';
</script>
