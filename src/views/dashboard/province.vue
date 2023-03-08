<!-- 省市工作台 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { getTodoList, userPageList } from '@/api/wel.js';
import { getSelecting, getCount } from './api';
import calendar from '@/utils/calendar.js';
import useRequest from '@/hooks/use-request';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore();
const selectedDates = ref([]);
const { typeKey } = userStore.userInfo;
const calendarDate = ref(new Date());
const router = useRouter();

const state = reactive({
  todoData: [],
  userPageData: [],
  selectingData: [],
  issueData: [],
  countData: []
});

const { userPageData, todoData, selectingData, countData } = toRefs(state);
//查询系统公告
const { run: userPageFun } = useRequest(userPageList, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    userPageData.value = data.data.data;
  }
});
//查询我的待办
const { run: todoListFun } = useRequest(getTodoList, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    state.todoData = data.data;
  }
});
//查询正在进行的认定活动
useRequest(getSelecting, {
  onSuccess: (data) => {
    state.selectingData = data.data;
  }
});
//查询统计面板
useRequest(getCount, {
  onSuccess: (data) => {
    state.countData = data.data;
  }
});
onMounted(() => {
  userPageFun({ pageIndex: 1, pageSize: 3, customerType: typeKey });
  todoListFun({ userCategory: typeKey == 0 ? 'ENTERPRISE' : 'PERSONAL' });
});

const edit = [
  'SAVED', //未提交
  'REVOKED', //已撤回
  'CITY_REJECTED' //市退回
];
//UnDeclared  未申报
const lock = [
  'SUBMITTED', //已提交
  'CITY_PASSED', //市审核通过
  'CITY_NOMINATED', //市已推选
  'CITY_REVOKE_NOMINATED', //市推选撤回
  'PROVINCE_PASSED', //省审核通过
  'PROVINCE_REJECTED', //省退回
  'PROVINCE_REJECTED_CITY_NOMINATED' //省退回市推选
];

//我的填报
const flexible = (item) => {
  if (item.declareStatus == 'UnDeclared') {
    router.push({
      path: '/wel/enterpriseKpi/notice',
      query: { id: item.id }
    });
  } else {
    //type 为true 可编辑
    const type = edit.includes(item.declareStatus);
    router.push({
      path: '/wel/enterpriseKpi/index',
      query: { id: item.id, type }
    });
  }
};

//数据大屏
const goDataScreen = () => {
  router.push({
    path: '/statistics/dataScreen/index'
  });
};

//上报详情
const reportDetail = () => {
  router.push({
    path: '/statistics/reporting/index'
  });
};

//认定专家管理
const goTechnical = () => {
  router.push({
    path: '/expert/expertInfo'
  });
};
//创建认定活动
const createActivity = () => {
  router.push({
    path: '/wel/activityAdmin/index'
  });
};
//创建评分标准
const createRegulation = () => {
  router.push({
    path: '/selection/standard/index'
  });
};
//发布公告
const pushNotice = () => {
  router.push({
    path: '/wel/systemNoticeList/index'
  });
};
// 是否选中日期
const isSelected = (slotData) => {
  return selectedDates.value.includes(slotData.day);
};
// 是否节假日
const isFestival = (slotData) => {
  let solarDayArr = slotData.day.split('-');
  let lunarDay = calendar.solar2lunar(solarDayArr[0], solarDayArr[1], solarDayArr[2]);

  // 公历节日\农历节日\农历节气
  let festAndTerm = [];
  festAndTerm.push(lunarDay.festival == null ? '' : ' ' + lunarDay.festival);
  festAndTerm.push(lunarDay.lunarFestival == null ? '' : '' + lunarDay.lunarFestival);
  festAndTerm.push(lunarDay.Term == null ? '' : '' + lunarDay.Term);
  festAndTerm = festAndTerm.join('');

  return festAndTerm != '';
};
// 公历转农历
const solarToLunar = (slotData) => {
  let solarDayArr = slotData.day.split('-');
  let lunarDay = calendar.solar2lunar(solarDayArr[0], solarDayArr[1], solarDayArr[2]);

  // 农历日期
  let lunarMD = lunarDay.IMonthCn + lunarDay.IDayCn;

  // 公历节日\农历节日\农历节气
  let festAndTerm = [];
  festAndTerm.push(lunarDay.festival == null ? '' : ' ' + lunarDay.festival);
  festAndTerm.push(lunarDay.lunarFestival == null ? '' : '' + lunarDay.lunarFestival);
  festAndTerm.push(lunarDay.Term == null ? '' : '' + lunarDay.Term);
  festAndTerm = festAndTerm.join('');

  return festAndTerm == '' ? lunarMD : festAndTerm;
};
</script>

<template>
  <div class="main-content">
    <!-- <img src="@/assets/img/Artwork.jpg" alt="" class="banner" /> -->
    <div class="headeImg">
      <img src="@/assets/img/headerTitle2.png" alt="" class="headeTitle" />
    </div>
    <section class="content">
      <el-row :gutter="10">
        <el-col :span="14">
          <el-card class="item-card-top">
            <div class="card-header">
              <div class="card-title">我的事项</div>
            </div>
            <div class="provinceList">
              <div
                class="provinceList-card"
                style="background-color: rgba(242, 251, 249, 1)"
                @click="createRegulation"
              >
                <div class="provinceList-img">
                  <img src="@/assets/img/regulation.png" alt="" />
                </div>
                <div class="provinceList-content">创建认定标准</div>
              </div>
              <div
                class="provinceList-card"
                style="background-color: rgba(238, 249, 255, 1)"
                @click="createActivity"
              >
                <div class="provinceList-img">
                  <img src="@/assets/img/activity.png" alt="" />
                </div>
                <div class="provinceList-content">创建认定活动</div>
              </div>
              <div
                class="provinceList-card"
                style="background-color: rgba(255, 252, 244, 1)"
                @click="pushNotice"
              >
                <div class="provinceList-img">
                  <img src="@/assets/img/notice.png" alt="" />
                </div>
                <div class="provinceList-content">发布系统公告</div>
              </div>
              <div
                class="provinceList-card"
                style="background-color: rgba(252, 249, 253, 1)"
                @click="goTechnical"
              >
                <div class="provinceList-img">
                  <img src="@/assets/img/createTechnical.png" alt="" />
                </div>
                <div class="provinceList-content">认定专家管理</div>
              </div>
            </div>
            <!-- <div class="noContent" ></div> -->
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="item-card-top">
            <div class="card-header">
              <div class="card-title">统计信息</div>
              <el-button
                type="primary"
                text="primary"
                @click="goDataScreen"
                v-if="userPageData.length"
              >
                数据大屏
              </el-button>
            </div>
            <div class="statistics">
              <div class="statistics-card">
                <div class="statistics-img">
                  <img src="@/assets/img/entCard.png" alt="" />
                </div>
                <div class="statistics-content">
                  <p>企业数</p>
                  <span class="statistics-total">{{ countData.enterpriseCount }}</span>
                </div>
              </div>
              <div class="statistics-card">
                <div class="statistics-img">
                  <img src="@/assets/img/personCard.png" alt="" />
                </div>
                <div class="statistics-content">
                  <p>人员数</p>
                  <span class="statistics-total">{{ countData.personCount }}</span>
                </div>
              </div>
              <div class="statistics-card">
                <div class="statistics-img">
                  <img src="@/assets/img/technicalCard.png" alt="" />
                </div>
                <div class="statistics-content">
                  <p>专家数</p>
                  <span class="statistics-total">{{ countData.proficientCount }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="item-card-bottom">
            <div class="card-header">
              <div class="card-title">正在进行的认定</div>
              <el-button
                type="primary"
                text="primary"
                @click="reportDetail"
                v-if="userPageData.length"
              >
                上报详情
              </el-button>
            </div>
            <div class="selecting-body" v-if="selectingData.length">
              <div class="selecting" v-for="item in selectingData">
                <div class="selecting-list">
                  <div class="selecting-content">
                    <el-tag
                      :color="
                        item.category === 'ENTERPRISE'
                          ? 'rgba(245, 250, 255, 1)'
                          : 'rgba(255, 252, 244, 1)'
                      "
                      :type="item.category !== 'ENTERPRISE' ? 'warning' : ''"
                    >
                      {{ item.category === 'ENTERPRISE' ? '企业' : '人员' }}
                    </el-tag>
                    <span class="selecting-title">{{ item.activityName }}</span>
                  </div>
                  <div class="selecting-time">
                    认定提交开始日期 ~ 认定提交结束日期：{{ item.startTime }} ~ {{ item.endTime }}
                  </div>
                </div>
                <div class="selecting-cards">
                  <div class="selecting-card">
                    <div class="color-card"></div>
                    <div class="content-card">
                      <div>
                        <p>通知数量</p>
                        <p>{{ item.numOfNotify }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="selecting-card">
                    <div class="color-card"></div>
                    <div class="content-card">
                      <div>
                        <p>当前提交认定</p>
                        <p>{{ item.numOfCommit }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="noContent2" v-else></div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="item-card-bottom calendarDate">
            <el-calendar v-model="calendarDate">
              <template #dateCell="{ data }">
                <div :class="{ selected: isSelected(data) }">
                  <div class="solar">{{ data.day.split('-')[2] }}</div>
                  <div class="lunar" :class="{ festival: isFestival(data) }">
                    {{ solarToLunar(data) }}
                  </div>
                </div>
              </template>
            </el-calendar>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<style scoped lang="less">
.main-content {
  display: flex;
  flex-direction: column;
  .headeImg {
    border: 1px solid #e4e7ed;
    border-radius: 5px;
    height: 20vh;
    background: url('@/assets/img/Artwork.png') no-repeat;
    background-size: 100% 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .headeTitle {
      height: 30px;
      margin-left: 30px;
    }
  }
  :deep(.el-card.is-always-shadow) {
    box-shadow: none;
  }
  .content {
    flex: 1;
    margin-top: 10px;
    .el-row {
      height: 100%;
      .el-col {
        margin-bottom: 10px;
      }
      .noContent {
        width: 100%;
        height: 100%;
        background: url('@/assets/img/nodata.png') no-repeat center center;
      }
      .noContent2 {
        width: 100%;
        height: 100%;
        background: url('@/assets/img/nodata2.png') no-repeat center center;
      }
      .item-card-top {
        box-sizing: border-box;
        height: 22vh;
        padding: 16px;
        .content {
          flex: 1;
          overflow: auto;
        }
        .manual {
          flex: 1;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 20px;
          .appraise_bg {
            width: 6vw;
            margin: auto;
            background-size: cover;
          }
        }
        .footer {
          text-align: center;
          width: 100%;
          margin-bottom: 15px;
          color: #409eff;
          em {
            margin-right: 20px;
          }
        }
        .my-todoList {
          display: flex;
          margin: auto 0;
          justify-content: space-around;
          .todoList {
            width: 40%;
            height: 10vh;
            display: flex;
            background-color: rgba(255, 192, 36, 0.05);
          }
          .doneList {
            width: 40%;
            height: 10vh;
            display: flex;
            background-color: rgba(56, 157, 255, 0.05);
          }
          .todoList-img {
            width: 40%;
            display: flex;
            justify-content: center;
            margin: auto 0;
            img {
              display: flex;
              margin: auto 0;
            }
          }
          .todoList-content {
            width: 60%;
            text-align: center;
            margin: auto 0;
            p {
              font-size: large;
              margin-bottom: 5%;
            }
            .todo-number {
              font-size: 28px;
              color: rgba(255, 164, 30, 1);
            }
            .done-number {
              font-size: 28px;
              color: rgba(36, 146, 252, 1);
            }
          }
        }
        .statistics {
          display: flex;
          margin: auto 0;
          justify-content: space-around;
          .statistics-card {
            height: 10vh;
            width: 33.3%;
            display: flex;
            .statistics-img {
              width: 40%;
              display: flex;
              justify-content: center;
              margin: auto 0;
              img {
                display: flex;
                margin: auto 0;
              }
            }
            .statistics-content {
              width: 50%;
              text-align: center;
              margin: auto 0;
              p {
                margin-bottom: 5%;
              }
              span {
                font-size: 18px;
                font-weight: bold;
                color: rgba(38, 38, 38, 1);
              }
            }
          }
        }
        .provinceList {
          display: flex;
          margin: auto 0;
          justify-content: space-around;
          .provinceList-card {
            cursor: pointer;
            display: flex;
            width: 20%;
            height: 8vh;
            .provinceList-img {
              margin: auto 0;
              text-align: center;
              width: 40%;
            }
            .provinceList-content {
              margin: auto 0;
              font-size: 16px;
            }
          }
        }
      }
      .calendarDate {
        overflow: auto;
      }
      .item-card-bottom {
        box-sizing: border-box;
        height: 47vh;
        padding: 16px;
        .cloumn {
          padding: 8px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .cloumn-content {
            div {
              margin: 2% 0;
            }
            .content_title {
              display: flex;
              font-size: 14px;
              font-weight: 600;
              color: #4a4a4a;
              line-height: 20px;
              :deep(.el-tag) {
                --el-icon-size: 10px;
                color: #2bb9d4;
                margin-right: 6px;
              }
              div {
                margin: auto 0;
              }
            }
            .content_issue {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #989cb0;
              line-height: 17px;
              .content_release {
                margin-left: 1vw;
              }
            }
          }
        }
        .selecting-body {
          margin: 3% 0;
          .selecting {
            margin-bottom: 3%;
            display: flex;
            .selecting-list {
              width: 70%;
              .selecting-content {
                margin-bottom: 8px;
                .selecting-title {
                  align-items: center;
                  font-size: 16px;
                  font-weight: 600;
                  color: #4a4a4a;
                  line-height: 20px;
                  margin-left: 2%;
                }
              }
            }
            .selecting-time {
              font-size: 12px;
              color: rgba(152, 156, 176, 1);
            }
            .selecting-cards {
              width: 30%;
              display: flex;
              justify-content: space-around;
              .selecting-card {
                width: 40%;
                display: flex;
                .color-card {
                  height: 100%;
                  width: 3px;
                  background-color: rgba(0, 127, 253, 1);
                }
                .content-card {
                  display: flex;
                  width: 100%;
                  height: 100%;
                  text-align: center;
                  justify-content: center;
                  align-items: center;
                  background-color: rgba(248, 251, 255, 1);
                }
              }
            }
          }
        }
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .card-title {
          margin-left: 10px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          line-height: 22px;
          position: relative;
          &::before {
            position: absolute;
            content: '';
            left: -10px;
            top: 4px;
            width: 4px;
            height: 15px;
            background: #007ffd;
            border-radius: 2px;
          }
        }
      }
      :deep(.el-card__body) {
        height: 100%;
        padding: 0;
        display: flex;
        flex-direction: column;
      }
      .el-calendar {
        --el-calendar-border: 'none';
      }
      /**月份居中*/
      :deep(.el-calendar__title) {
        font-size: large;
        font-weight: bold;
        text-align: center;
      }
      /**日期div的样式*/
      .el-calendar-table tr td:first-child {
        border-left: 0px;
      }
      :deep(.el-calendar-table thead th) {
        padding: 0 0 1% 0;
      }
      .el-calendar-table td {
        min-height: 110px;
        min-width: 110px;
        border-right: 0px;
      }
      :deep(.el-calendar-table td.is-selected) {
        border-radius: 10%;
        color: rgba(255, 255, 255, 1);
        background-color: rgba(0, 127, 253, 1);
      }
      :deep(.el-calendar-table .el-calendar-day) {
        height: 60px;
        padding: 5px;
        text-align: center;
      }
      .el-calendar-table .el-calendar-day > div {
        margin: auto 0;
        text-align: center;
      }
      /**日期div的样式-公历*/
      .el-calendar-table .el-calendar-day > div .solar {
        font-weight: bold;
        text-align: center;
      }
      /**日期div的样式-农历*/
      .el-calendar-table .el-calendar-day > div .lunar {
        padding-top: 5%;
        font-size: 12px;
        color: rgba(152, 156, 176, 1);
        text-align: center;
      }
      /**日期div的样式-选中*/
      .el-calendar-table .el-calendar-day > div.selected {
        background-color: #fef2f2;
        border: 3px solid #fb0;
        border-radius: 20px;
        text-align: center;
      }

      /**本月周末设置为红色*/
      .el-calendar-table .current:nth-last-child(-n + 2) .solar {
        color: red;
      }
      /**本月农历设置为灰色*/
      .el-calendar-table .current .lunar {
        color: #606266;
      }
      /**本月农历节日设置为红色*/
      .el-calendar-table .current .lunar.festival {
        color: red;
      }
      :deep(.el-calendar-table .el-calendar-day:hover) {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(0, 127, 253, 1);
        border-radius: 10%;
      }
    }
  }
}
</style>
