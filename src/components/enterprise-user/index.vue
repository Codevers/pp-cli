<!-- 人员基本信息 -->
<script setup>
import { onMounted, ref, defineProps } from 'vue';
import { ElMessage } from 'element-plus';
import useRequest from '@/hooks/use-request';
import { getUserDetail, getPersonageDetail, SyncPersonApi } from '@/api/member-admin.js';
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;
const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

const getApi = () => {
  if (props.id) {
    return getUserDetail;
  } else {
    return getPersonageDetail;
  }
};

const details = ref({});

const { run: detailFun } = useRequest(getApi(), {
  manual: true,
  onSuccess: (data, isSuccess) => {
    details.value = data.data;
  }
});

// 人员信息同步
const { run: syncPersonFun } = useRequest(SyncPersonApi, {
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
//人员信息同步
function updataMessage() {
  syncPersonFun();
}

defineExpose({
  updataMessage
});

onMounted(() => {
  detailFun({ id: props.id });
});
</script>

<template>
  <table class="intaltable">
    <tr>
      <td>姓名</td>
      <td>{{ details?.name }}</td>
      <td>身份证号</td>
      <td>{{ details?.idCard }}</td>
      <td rowspan="7">
        <el-image :src="baseUrl + details?.url" fit="cover" v-if="details?.url"></el-image>
        <div v-else style="text-align: center">暂无图片</div>
      </td>
    </tr>
    <tr>
      <td>性别</td>
      <td>{{ details?.sex }}</td>
      <td>出生日期</td>
      <td>{{ details?.birthDayStr }}</td>
    </tr>
    <!-- <tr>
      <td>所学专业</td>
      <td>{{ details?.major }}</td>
      <td>学历</td>
      <td>{{ details?.education }}</td>
    </tr> -->
    <tr>
      <td>从事工程造价年限</td>
      <td>{{ details?.costYear }}</td>
      <td>职称</td>
      <td>{{ details?.postTitle }}</td>
    </tr>
    <tr>
      <td>毕业院校</td>
      <td>{{ details?.graduateSchool }}</td>
      <td>现从事专业</td>
      <td>{{ details?.currentMajor }}</td>
    </tr>
    <tr>
      <td>入会时间</td>
      <td>{{ details?.memberJoinTime?.slice(0, 10) }}</td>
      <td>会员编号</td>
      <td>{{ details?.membershipNum }}</td>
    </tr>
    <tr>
      <td>造价工程师注册证书编号</td>
      <td>{{ details?.certificateNO }}</td>
      <td>从业单位</td>
      <td>{{ details?.enterpriseName }}</td>
    </tr>
    <!-- <tr>
      <td>工作经历</td>
      <td colspan="5">
        <p>{{ details?.occupationalHistory }}</p>
      </td>
    </tr> -->
  </table>
  <p style="margin-top: 10px">
    <a type="primary" href="http://hy.ahzjxh.org.cn" target="_blank" style="color: #409eff">
      更改会员信息
    </a>
  </p>
</template>

<style scoped lang="less">
/*table样式*/
.intaltable {
  width: 100%;
  // margin: 15px 0;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  color: #323232;

  tr {
    td {
      transition: background-color 0.25s ease;
      border-right: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      padding: 10px 10px;
      font-size: 13px;
      vertical-align: middle;

      &:nth-of-type(even) {
        text-align: left;
        background: #fff;
      }

      &:nth-of-type(odd) {
        background: #f5f7fa;
        text-align: right;
        width: 160px;
        font-weight: 700;
      }

      > p {
        // font-size: 13px;
        line-height: 1.7;
      }
    }
    td:nth-child(2) {
      min-width: 200px;
    }
    td:nth-child(4) {
      min-width: 170px;
    }

    .alignleft {
      text-align: left;
      padding-left: 20px;
    }
  }
}
</style>
