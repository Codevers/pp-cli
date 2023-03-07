<!--工作台 活动进度 -->
<script setup>
import { ref, onMounted } from 'vue';
import useRequest from '@/hooks/use-request';
import { progressApi } from '@/api/wel.js';

const activeStatus = {
  1: ['UNSUBMIT', 'CITY_BACK', 'PROVINCE_BACK', 'UNSUBMIT_WORKFLOW_END'],
  2: ['CITY_SELECTING', 'CITY_UNSELECTED_WORKFLOW_END'],
  3: ['PROVINCE_SELECTING', 'PROVINCE_UNSELECTED_WORKFLOW_END'],
  4: ['UNDER_PUBLICITY'],
  6: ['END_PUBLICITY']
};
//流程结束/终止
const closeStatus = [
  'UNSUBMIT_WORKFLOW_END',
  'CITY_UNSELECTED_WORKFLOW_END',
  'PROVINCE_UNSELECTED_WORKFLOW_END',
  'END_PUBLICITY'
];

// 0 活动尚未开始
// 1 资料申报阶段
// 2 市级认定阶段
// 3 省级认定阶段
// 4 结果公示阶段
// 6 公示结束阶段/提前终止

// const activeStatus = {
//   UNSUBMIT: '申报资料未提交',
//   CITY_SELECTING: '市级认定中',
//   CITY_BACK: '市退回',
//   PROVINCE_BACK: '省退回',
//   UNSUBMIT_WORKFLOW_END: '未提交资料（*状态*），流程已终止',
//   CITY_UNSELECTED_WORKFLOW_END: '市级未认定上（*状态*），流程已终止',
//   PROVINCE_SELECTING: '省级认定中',
//   PROVINCE_UNSELECTED_WORKFLOW_END: '省级未认定上，流程已终止',
//   UNDER_PUBLICITY: '公示中',
//   END_PUBLICITY: '公示结束',
//   NULL_STATUS: '异常状态'
// };
const active = ref(1);
const endActivity = ref(1);
const progressData = ref({});
const { run: progressFun } = useRequest(progressApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      progressData.value = data.data;
      const nowProgressKey = data.data.nowProgressKey;

      for (let key in activeStatus) {
        if (activeStatus[key].includes(nowProgressKey)) {
          active.value = key;
          console.log(key, nowProgressKey);
        }
      }
      if (closeStatus.includes(nowProgressKey)) {
        endActivity.value = 6;
        active.value = 6;
      } else {
        endActivity.value = active.value;
      }
    }
  }
});

//处理时间  年与日
const getTime = (time, num) => {
  return time?.slice(0, num);
};

//
const getKey = (data = [], value) => {
  return data.includes(value);
};

//判断定位
// function getKey() {
//   const {
//     startDateOfActivity,
//     endDateOfCommit,
//     endDateOfCityElect,
//     startDateOfPublic,
//     endDateOfPublic,
//     endDateOfActivity,
//     declareCommitTime,
//     citySelectTime,
//     provinceSelectTime
//   } = progressData.value;
//   const time = Date.parse(new Date());
//   // 0 活动尚未开始
//   // 1 资料申报阶段
//   // 2 市级认定阶段
//   // 3 省级认定阶段
//   // 4 结果公示阶段
//   // 6 公示结束阶段

//   //当前时间 <= 开始时间
//   if (time <= Date.parse(startDateOfActivity)) {
//     return 0;
//   }
//   //!提交时间 && 开始时间<= 当前时间 <= 资料提交截止时间
//   if (
//     !declareCommitTime &&
//     Date.parse(startDateOfActivity) <= time &&
//     time < Date.parse(endDateOfCommit)
//   ) {
//     return 1;
//   }
//   //提交时间 && 当前时间<= 市级报送截止日期 && !市推选时间
//   if (declareCommitTime && time <= Date.parse(endDateOfCityElect) && !citySelectTime) {
//     return 2;
//   }
//   // //市推选时间 && 当前时间<= 公示开始日期 && !省推选时间
//   // if (citySelectTime && time <= Date.parse(startDateOfPublic) && !provinceSelectTime) {
//   //   return 3;
//   // }
//   //市推选时间 && !公示开始日期
//   if (citySelectTime && !startDateOfPublic) {
//     return 3;
//   }

//   //省推选时间 && 公示开始日期 <= 当前时间 <= 公示结束日期
//   if (
//     provinceSelectTime &&
//     Date.parse(startDateOfPublic) < time &&
//     time <= Date.parse(endDateOfPublic)
//   ) {
//     return 4;
//   }
//   //公示结束日期 <= 当前时间
//   if (Date.parse(endDateOfActivity) < time) {
//     return 6;
//   }
// }

//判断是否已经到了 活动开始时间
function getContent() {
  const { startDateOfActivity } = progressData.value;
  const time = Date.parse(new Date());
  return time >= Date.parse(startDateOfActivity);
}

onMounted(() => {
  progressFun();
});
</script>

<template>
  <div class="test" v-if="getContent()">
    <el-steps :active="active" align-center finish-status="finish" process-status="process">
      <el-step class="my-step">
        <template #title>
          <div class="text">
            <h3>活动开始日期</h3>
            <span>
              {{
                progressData?.startDateOfActivity && getTime(progressData?.startDateOfActivity, 10)
              }}
            </span>
          </div>
        </template>
        <template #description>
          <div class="description">
            <span class="stepTitle" :style="{ color: endActivity > 1 ? '#007ffd' : '#a8abb2' }">
              资料申报
            </span>
            <span class="tiny-point" style="--left: 30%" v-show="progressData.declareCommitTime">
              <span class="tiny-title">
                提交时间
                <br />
                {{
                  progressData?.declareCommitTime && getTime(progressData?.declareCommitTime, 10)
                }}
              </span>
            </span>
            <span
              class="tiny-point2"
              style="--left: 50%"
              v-show="getKey(activeStatus[1], progressData.nowProgressKey)"
            >
              <!--    v-show="progressData.nowProgressKey == 'UNSUBMIT'" -->
              <span class="tiny-title2">当前进度：{{ progressData?.nowProgress }}</span>
            </span>
          </div>
        </template>
      </el-step>
      <el-step class="my-step">
        <template #title>
          <div class="text">
            <h3>资料提交截止时间</h3>
            <span>
              {{ progressData?.endDateOfCommit && getTime(progressData?.endDateOfCommit, 10) }}
            </span>
          </div>
        </template>
        <template #description>
          <div class="description">
            <span class="stepTitle" :style="{ color: endActivity >= 2 ? '#007ffd' : '#a8abb2' }">
              市级认定
            </span>
            <span class="tiny-point" style="--left: 30%" v-show="progressData.citySelectTime">
              <span class="tiny-title">
                市推选时间
                <br />
                {{ progressData?.citySelectTime && getTime(progressData?.citySelectTime, 10) }}
              </span>
            </span>
            <span
              class="tiny-point2"
              style="--left: 50%"
              v-show="getKey(activeStatus[2], progressData.nowProgressKey)"
            >
              <!--  v-show="progressData.nowProgressKey == 'CITY_SELECTING'" -->
              <span class="tiny-title2">当前进度：{{ progressData?.nowProgress }}</span>
            </span>
          </div>
        </template>
      </el-step>
      <el-step class="my-step">
        <template #title>
          <div class="text">
            <h3>市级报送截止日期</h3>
            <span>
              {{
                progressData?.endDateOfCityElect && getTime(progressData?.endDateOfCityElect, 10)
              }}
            </span>
          </div>
        </template>
        <template #description>
          <div class="description">
            <span class="stepTitle" :style="{ color: endActivity >= 3 ? '#007ffd' : '#a8abb2' }">
              省级认定
            </span>
            <span class="tiny-point" style="--left: 30%" v-show="progressData.provinceSelectTime">
              <span class="tiny-title">
                省推选时间
                <br />
                {{
                  progressData?.provinceSelectTime && getTime(progressData?.provinceSelectTime, 10)
                }}
              </span>
            </span>
            <span
              class="tiny-point2"
              style="--left: 50%"
              v-show="getKey(activeStatus[3], progressData.nowProgressKey)"
            >
              <!-- v-show="progressData.nowProgressKey == 'PROVINCE_SELECTING'" -->

              <span class="tiny-title2">当前进度：{{ progressData?.nowProgress }}</span>
            </span>
          </div>
        </template>
      </el-step>
      <el-step class="my-step">
        <template #title>
          <div class="text">
            <h3>公示开始日期</h3>
            <span>
              {{ progressData?.startDateOfPublic && getTime(progressData?.startDateOfPublic, 10) }}
            </span>
          </div>
        </template>
        <template #description>
          <div class="description">
            <span class="stepTitle" :style="{ color: endActivity >= 4 ? '#007ffd' : '#a8abb2' }">
              结果公示
            </span>
            <span
              class="tiny-point2"
              style="--left: 50%"
              v-show="getKey(activeStatus[4], progressData.nowProgressKey)"
            >
              <!--   v-show="progressData.nowProgressKey == 'UNDER_PUBLICITY'" -->
              <span class="tiny-title2">当前进度：{{ progressData?.nowProgress }}</span>
            </span>
          </div>
        </template>
      </el-step>
      <el-step class="my-step">
        <template #title>
          <div class="text">
            <h3>公示结束日期</h3>
            <span>
              {{ progressData?.endDateOfPublic && getTime(progressData?.endDateOfPublic, 10) }}
            </span>
          </div>
        </template>
        <template #description>
          <div class="description">
            <span class="stepTitle" :style="{ color: endActivity >= 5 ? '#007ffd' : '#a8abb2' }">
              活动结束
            </span>
            <span
              class="tiny-point2"
              style="--left: 50%"
              v-show="getKey(activeStatus[6], progressData.nowProgressKey)"
            >
              <!--  v-show="progressData.nowProgressKey == 'END_PUBLICITY'" -->
              <span class="tiny-title2">当前进度：{{ progressData?.nowProgress }}</span>
            </span>
          </div>
        </template>
      </el-step>
      <el-step class="my-step">
        <template #title>
          <div class="text">
            <h3>活动结束</h3>
          </div>
        </template>
      </el-step>
    </el-steps>
  </div>
  <div class="noContents" v-else></div>
</template>

<style lang="less">
.noContents {
  width: 100%;
  height: 100%;
  background: url('@/assets/img/nodata2.png') no-repeat center center;
}
.test {
  margin: 0 auto;
  margin-top: 15%;
  .stepTitle {
    font-size: 12px;
    font-weight: 600;
    color: #007ffd;
    line-height: 17px;
  }
}

.my-steps {
  .text {
    font-size: 12px;
  }
}

.my-step {
  .el-step__main {
    position: relative;
  }

  // .el-step__description {
  //   width: 60%;
  //   height: 20px;
  //   position: absolute;
  //   top: -33px;
  //   left: 70%;
  //   margin: 0 !important;
  //   padding: 0 !important;
  //   background: #f2f6fb;
  // }

  .description {
    width: 60%;
    height: 20px;
    position: absolute;
    top: -33px;
    left: 70%;
    margin: 0 !important;
    padding: 0 !important;
    background: #f2f6fb;
  }

  .tiny-point,
  .tiny-point2 {
    width: 12px;
    position: absolute;
    bottom: 0;
    left: var(--left);
    display: flex;
    justify-content: center;
    margin-left: -6px;
  }
  .tiny-point {
    top: -30px;
  }
  .tiny-point2 {
    top: -20px;
  }

  .tiny-title {
    white-space: nowrap;
    transform: translateY(-50%);
  }
  .tiny-title2 {
    white-space: nowrap;
    color: #f00;
    transform: translateY(-120%);
  }

  .tiny-point::before,
  .tiny-point2::before {
    content: '';
    width: 12px;
    height: 12px;
    position: absolute;
    left: 0;
    border-radius: 50%;
  }
  .tiny-point::before {
    bottom: 25px;
    background-color: #f4a702;
  }
  .tiny-point2::before {
    bottom: 50px;
    background-color: #f00;
  }

  .tiny-point::after,
  .tiny-point2::after {
    content: '';
    width: 1px;
    position: absolute;
    bottom: 0;
    left: 5px;
  }
  .tiny-point::after {
    height: 25px;
    background-color: #f4a702;
  }
  .tiny-point2::after {
    height: 50px;
    background-color: #f00;
  }

  :deep(.el-step__main) {
    width: 150px;
  }

  .text {
    span,
    h3 {
      font-size: 14px !important;
    }
  }
}
</style>
