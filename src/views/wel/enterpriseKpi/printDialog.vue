<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { enterpriseApi, personalApi } from '@/api/enterpriseKpi.js';
import useRequest from '@/hooks/use-request';
const userStore = useUserStore();
const typeKey = userStore.userInfo.typeKey; //typeKey  0   企业  1   个人
const dialogVisible = ref(false);
const printData = ref({});
const printOption = ref({
  id: 'print', // 打印元素的id 不需要携带#号
  popTitle: '安徽省工程造价咨询行业优秀企业和个人申报系统' // 页眉标题 默认浏览器标题 空字符串时显示undefined 使用html语言
});
function open({ id }) {
  if (typeKey == 1) {
    personalFun({ declareInfoId: id });
  } else {
    enterpriseFun({ declareInfoId: id });
  }
  dialogVisible.value = true;
}
defineExpose({
  open
});
function getTitle() {
  let title = '';
  if (typeKey == 1) {
    title = '安徽省工程造价咨询行业优秀个人认定申报表';
  } else {
    title = '安徽省工程造价咨询行业优秀企业认定申报表';
  }
  return title;
}
//企业申请报表  api
const { run: enterpriseFun } = useRequest(enterpriseApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      printData.value = data.data;
    }
  }
});

//个人申请报表  api
const { run: personalFun } = useRequest(personalApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      printData.value = data.data;
    }
  }
});

const affirm = () => {
  dialogVisible.value = false;
};
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="getTitle()" width="700px" destroy-on-close center>
    <div id="print">
      <h2>{{ getTitle() }}</h2>
      <p style="margin-bottom: 10px">所在市：{{ printData.regionName }}</p>

      <table border="1" width="100%" cellspacing="0">
        <tr>
          <td class="label">申报事项</td>
          <td colspan="5">{{ printData.topic }}</td>
        </tr>
        <tr v-if="typeKey == 1">
          <td class="label">申请人</td>
          <td>{{ printData.declarerName }}</td>
          <td class="label">身份证号</td>
          <td>{{ printData.idNumber }}</td>
        </tr>
        <tr v-if="typeKey == 1">
          <td class="label">联系电话</td>
          <td>{{ printData.reportPhoneNum }}</td>
          <td class="label">会员编号</td>
          <td>{{ printData.membershipNum }}</td>
        </tr>
        <tr v-if="typeKey == 1">
          <td class="label">所在单位</td>
          <td colspan="5">{{ printData.declarerEnterprise }}</td>
        </tr>
        <tr v-if="typeKey == '0'">
          <td class="label">申报单位</td>
          <td colspan="5">{{ printData.declarerName }}</td>
        </tr>
        <tr v-if="typeKey == '0'">
          <td class="label">法定代表人</td>
          <td>{{ printData.legalPerson }}</td>
          <td class="label">统一社会信用代码证</td>
          <td>{{ printData.socialCreditCode }}</td>
        </tr>
        <tr v-if="typeKey == '0'">
          <td class="label">会员编号</td>
          <td>{{ printData.membershipNum }}</td>
          <td class="label">法人联系电话</td>
          <td>{{ printData.legalPersonTel }}</td>
        </tr>
        <tr v-if="typeKey == '0'">
          <td class="label">申报人</td>
          <td>{{ printData.reportName }}</td>
          <td class="label">申报人联系电话</td>
          <td>{{ printData.reportPhoneNum }}</td>
        </tr>
      </table>
      <div class="promise">
        <div class="content-title" style="border-top: none" v-if="typeKey == 1">个人承诺</div>
        <div class="content">
          <div v-if="typeKey == 1" class="content-detail">
            本人{{
              printData.declarerName
            }}，自愿参加本次认定活动，并在此郑重承诺，本人在认定周期内无违纪违规行为，在申报时所填写的内容和提交的相关证明材料均真实有效，同意对提交的业绩、获得的荣誉等信息进行公示。如有虚假，本人愿承担一切后果及相应的法律责任。
          </div>
          <div v-else class="content-detail">
            本单位自愿参加本次认定活动，并在此郑重承诺所填写的内容和提交的相关证明材料均真实有效，同意对申报时提交的业绩、获得的荣誉等信息进行公示，如有虚假，本单位愿承担一切后果及相应的法律责任。
          </div>

          <div class="idiograph" v-if="typeKey == 1">
            <p>申请人（签字）：</p>
            <p>日期：&emsp; &emsp;年&emsp; &emsp;月&emsp; &emsp;日</p>
          </div>
        </div>
        <div class="content-title" v-if="typeKey == 1">单位意见</div>
        <div class="content-unit" v-if="typeKey == 1">
          <div class="idiograph">
            <p>单位盖章</p>
            <p>日期：&emsp; &emsp;年&emsp; &emsp;月&emsp; &emsp;日</p>
          </div>
        </div>

        <div class="signature" v-if="typeKey == '0'">
          <p>法定代表人（签字）：</p>
          <p>单位名称（盖章）：</p>
          <p>申报日期：&emsp; &emsp;年&emsp; &emsp;月&emsp; &emsp;日</p>
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="dialogVisible = false"
          style="width: 180px; height: 40px; margin-right: 30px"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          v-print="printOption"
          @click="affirm"
          style="width: 180px; height: 40px"
        >
          确认打印
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
tr {
  height: 45px;
  line-height: 45px;

  // td {
  //   min-width: 150px;
  // }
  .label {
    width: 130px;
  }
}

#print {
  height: 100%;
  display: flex;
  flex-direction: column;
  // padding: 0 40px;

  h2 {
    font-size: 22px;
    font-weight: bold;
    height: 25px;
    line-height: 25px;
    text-align: center;
    margin: 5px 0 30px 0;
  }

  .promise {
    flex: 1;
    width: 100%;
    min-height: 520px;
    box-sizing: border-box;
    border: 1px solid #606266;
    border-top: none;
    display: flex;
    flex-direction: column;
    position: relative;
    .content-title {
      font-size: 18px;
      height: 38px;
      letter-spacing: 5px;
      line-height: 38px;
      text-align: center;
      font-weight: bold;
      border-bottom: 1px solid #606266;
      border-top: 1px solid #606266;
    }

    .content {
      flex: 1;
      text-indent: 2em;
      font-size: 18px;
      position: relative;

      .content-detail {
        padding: 25px 30px;
        line-height: 2.2;
        font-weight: 400;
      }
    }
    .content-unit {
      height: 210px;
      text-indent: 2em;
      font-size: 18px;
      position: relative;
    }

    .idiograph {
      position: absolute;
      right: 0;
      bottom: 20px;
      display: flex;

      p {
        margin: 0 25px;
        font-size: 16px;
      }
    }

    .signature {
      position: absolute;
      right: 0;
      width: 50%;
      bottom: 60px;

      p {
        line-height: 40px;
        font-size: 16px;
        font-weight: 400;
      }
    }
  }
}

// :deep(.el-dialog__body) {
//   height: 900px;
// }
</style>
<style media="print">
/*  去除打印的页眉页脚 */
@page {
  size: auto;
  /* margin: 25mm; */
  margin: 20mm 25mm;
}
</style>
