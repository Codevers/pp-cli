<script setup>
import { pageConfig } from '@/config/pagination';
const props = defineProps({
  total: {
    type: Number
  },
  page: {
    type: Object
  }
});

const emit = defineEmits(['pageChange']);

function handleSizeChange(val) {
  emit('pageChange', {
    /**
     * 修复总页数由多变少（每页条数由小变大）时自定义事件`pageChange`触发两次导致的表格数据清空问题
     * 主动限制当前页码不得超过最大页码，避免同时触发`size-change、current-change`，导致执行两次请求（首次请求参数非法，且响应晚于二次请求时，表格数据被错误清空）
     * @see http://zt.dev.ft/zentao/bug-view-28534.html
     */
    pageIndex: Math.min(props.page.pageIndex, Math.ceil(props.total / val)),
    pageSize: val
  });
}
function handleCurrentChange(val) {
  emit('pageChange', { pageIndex: val });
}
</script>
<template>
  <div class="pagination-div">
    <el-pagination :currentPage="props.page?.pageIndex" :page-size="props.page?.pageSize"
      :page-sizes="pageConfig.pageSizes" :layout="pageConfig.layouts" :total="props.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" background />
  </div>
</template>
<style lang="less" scoped></style>
