<!-- 企业基本信息 -->
<script setup>
import { onMounted, ref, defineProps } from 'vue';
import { ElMessage } from 'element-plus';
import useRequest from '@/hooks/use-request';
import { getDetail, getEnterpriseDetail, SyncCompanyApi } from '@/api/member-admin.js';
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

const getApi = () => {
  if (props.id) {
    return getDetail;
  } else {
    return getEnterpriseDetail;
  }
};
const details = ref({});
const { run: detailFun } = useRequest(getApi(), {
  manual: true,
  onSuccess: (data, isSuccess) => {
    details.value = data.data;
  }
});

//企业信息同步
const { run: syncCompany } = useRequest(SyncCompanyApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (data?.success) {
      ElMessage.success('同步成功');
      detailFun({ id: props.id });
    } else {
      ElMessage.error(data?.msg);
    }
  }
});

//企业信息同步
function updataMessage() {
  syncCompany();
}
defineExpose({
  updataMessage
});
onMounted(() => {
  detailFun({ id: props.id });
});
</script>

<template>
  <el-descriptions class="enterpriseInfo" :column="2" border>
    <el-descriptions-item label-align="right" align="left" label="企业名称">
      {{ details?.companyName }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="统一社会信用代码">
      {{ details?.code }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="所在地市">
      {{ details?.region }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="办公地址">
      {{ details?.location }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="法定代表人">
      {{ details?.corp }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="法人电话">
      {{ details?.legalPersonTel }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="联系人">
      {{ details?.techLead }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="固定电话">
      {{ details?.fixedTelephoneNumb }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="入会时间">
      {{ details?.memberJoinTime?.slice(0, 10) }}
    </el-descriptions-item>
    <el-descriptions-item label-align="right" align="left" label="会员编号">
      {{ details?.membershipNum }}
    </el-descriptions-item>
  </el-descriptions>
  <p style="margin-top: 10px">
    <a
      type="primary"
      href="http://hy.ahzjxh.org.cn"
      target="_blank"
      style="margin-top: 10px; color: #409eff"
    >
      更改会员信息
    </a>
  </p>
</template>

<style scoped lang="less">
.enterpriseInfo {
  :deep(.is-right) {
    width: 180px;
  }
  :deep(.el-descriptions__cell) {
    color: #323232;
  }
}
</style>
