<!-- 各地市上报数量设置 -->
<script setup>
import { reactive, toRefs, ref } from 'vue';
import useRequest from '@/hooks/use-request';
import { getCityListApi, saveSubmissionApi } from '@/api/wel.js';
const column = [
  {
    type: 'index',
    width: '60px',
    label: '序号'
  },
  {
    prop: 'regionName',
    label: '所在市',
    width: 100
  },
  {
    prop: 'organizationName',
    label: '管理机构名称',
    showOverflowTooltip: true
  },
  {
    prop: 'maxNum',
    label: '上报数量',
    slotName: 'maxNum',
    width: 150
  }
];
const dataList = ref([]);
let activityId = ''; //活动id
const type = ref('view'); //控制上传数量的编辑/查看
const dialogVisible = ref(false);
function open({ types, id = '' }) {
  type.value = types;
  activityId = id;
  getCityList({ activityId: id });
  dialogVisible.value = true;
}
defineExpose({
  open
});
//获得各省市列表
const { run: getCityList } = useRequest(getCityListApi, {
  manual: true,
  // msgTxt: [],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dataList.value = data.data;
    }
  }
});
//保存接口
const { run: saveSubmission } = useRequest(saveSubmissionApi, {
  manual: true,
  msgTxt: ['保存成功'],
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      dialogVisible.value = false;
    }
  }
});
//保存
function save() {
  let organizationApplyNumList = [];
  dataList.value.forEach((item) => {
    if (item.maxNum != null && item.maxNum >= 0) {
      let obj = {};
      obj.regionCode = item.regionCode;
      obj.maxNum = item.maxNum;
      organizationApplyNumList.push(obj);
    }
  });
  let params = {
    activityId: activityId,
    organizationApplyNumList
  };
  saveSubmission(params);
}
</script>
<template>
  <el-dialog v-model="dialogVisible" title="各地市上报数量" width="70%" destroy-on-close center>
    <el-table-next :column="column" :data="dataList" height="520" border>
      <template #maxNum="{ row }">
        <!-- <el-input-number
          v-if="type == 'edit'"
          v-model="row.maxNum"
          size="small"
          :min="0"
          :step="1"
          :controls="false"
        /> -->
        <el-input
          v-if="type == 'edit'"
          v-model="row.maxNum"
          oninput="value=value.replace(/^(0+=)|[^\d]+/g,'')"
          placeholder="请输入"
        />
        <span v-else>{{ row.maxNum }}</span>
      </template>
    </el-table-next>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          style="width: 180px; height: 40px; margin-right: 30px"
        >
          关闭
        </el-button>
        <el-button
          type="primary"
          v-if="type == 'edit'"
          @click="save"
          style="width: 180px; height: 40px"
        >
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
