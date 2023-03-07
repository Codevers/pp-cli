<template>
  <div>
    <el-date-picker
      v-model="model"
      type="daterange"
      unlink-panels
      value-format="YYYY-MM-DD"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      v-bind="$attrs"
    >
      <template v-for="(slot, name) in $slots" #[name]>
        <slot :name="name" />
      </template>
    </el-date-picker>
    <span @click="model.length = 1">清空</span>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { ElDatePicker, formItemContextKey } from 'element-plus';
const formItem = inject(formItemContextKey);
</script>
