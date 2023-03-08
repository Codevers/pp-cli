<!-- 各地联系方式弹窗  -->
<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
const dialogVisible = ref(false);
const column = [
  {
    type: 'index',
    width: '60',
    label: '序号',
    fixed: true
  },
  {
    label: '初审机构',
    prop: 'organization',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '联系电话',
    prop: 'phone',
    align: 'center',
    showOverflowTooltip: true
  }
];

const state = reactive({
  data: []
});
function open() {
  dialogVisible.value = true;
  //获取 本地 json
  axios.get('/operationManual/linkmanData.json').then((res) => {
    state.data = res.data;
  });
}
defineExpose({ open });
</script>
<template>
  <el-dialog v-model="dialogVisible" center title="各初审机构联系方式" width="750px">
    <el-table-next :column="column" :data="state.data" border></el-table-next>
  </el-dialog>
</template>
