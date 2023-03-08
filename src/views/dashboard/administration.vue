<!-- 企业/个人工作台 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { getTodoList, userPageList } from '@/api/wel.js';
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
  userPageData: []
});
const todoList = [
  {
    id: 1,
    name: '企业',
    title: '2021年优秀造价咨询企业认定',
    selectionTime: '2022-01-24 ~ 2022-06-15',
    ent: 20,
    now: 15
  },
  {
    id: 1,
    name: '企业',
    title: '2021年优秀造价咨询企业认定',
    selectionTime: '2022-01-24 ~ 2022-06-15',
    ent: 20,
    now: 15
  },
  {
    id: 2,
    name: '个人',
    title: '关于2021年优秀造价咨询员工认定',
    selectionTime: '2022-01-24 ~ 2022-06-15',
    ent: 20,
    now: 15
  },
  {
    id: 2,
    name: '个人',
    title: '关于2021年优秀造价咨询员工认定',
    selectionTime: '2022-01-24 ~ 2022-06-15',
    ent: 20,
    now: 15
  },
  {
    id: 2,
    name: '个人',
    title: '关于2021年优秀造价咨询员工认定',
    selectionTime: '2022-01-24 ~ 2022-06-15',
    ent: 20,
    now: 15
  }
];
const { userPageData, todoData } = toRefs(state);
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

//更多
const move = () => {
  router.push({
    path: '/wel/systemNoticeList/index'
  });
};
//查看公告
const lockAnnouncement = (id) => {
  router.push({
    path: '/wel/announcement/lock-announcement',
    query: { id: id }
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
    <img src="@/assets/img/Artwork.jpg" alt="" class="banner" />
    <section class="content">
      <el-row :gutter="10">
        <el-col :span="14">
          <el-card class="item-card-top">
            <div class="card-header">
              <div class="card-title">我的事项</div>
              <el-button type="primary" text="primary" @click="move">更多</el-button>
            </div>
            <div class="my-todoList">
              <div class="todoList">
                <div class="todoList-img">
                  <img src="../../assets/img/todoList.png" alt="" />
                </div>
                <div class="todoList-content">
                  <p>待办事项</p>
                  <span class="todo-number">4</span>
                </div>
              </div>
              <div class="doneList">
                <div class="todoList-img">
                  <img src="../../assets/img/doneList.png" alt="" />
                </div>
                <div class="todoList-content">
                  <p>已办事项</p>
                  <span class="done-number">12</span>
                </div>
              </div>
            </div>
            <!-- <div class="provinceList">
              <el-button type="primary">创建认定标准</el-button>
              <el-button type="primary">创建认定活动</el-button>
              <el-button type="primary">发布系统公告</el-button>
              <el-button type="primary">认定专家管理</el-button>
            </div> -->
            <!-- <div class="noContent" ></div> -->
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="item-card-top">
            <div class="card-header">
              <div class="card-title">统计看板</div>
            </div>
            <div class="statistics">
              <div class="statistics-card">
                <div class="statistics-img">
                  <img src="../../assets/img/entCard.png" alt="" />
                </div>
                <div class="statistics-content">
                  <p>企业数</p>
                  <span class="statistics-total">150</span>
                </div>
              </div>
              <div class="statistics-card">
                <div class="statistics-img">
                  <img src="../../assets/img/personCard.png" alt="" />
                </div>
                <div class="statistics-content">
                  <p>人员数</p>
                  <span class="statistics-total">120</span>
                </div>
              </div>
              <div class="statistics-card">
                <div class="statistics-img">
                  <img src="../../assets/img/technicalCard.png" alt="" />
                </div>
                <div class="statistics-content">
                  <p>专家数</p>
                  <span class="statistics-total">188</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- <el-col :span="12">
          <el-card class="item-card">
            <div class="card-header">
              <div class="card-title">认定结果公示</div>
            </div>
            <div class="content" >
              <div class="cloumn" v-for="item in 6" :key="item">
                <div class="cloumn-content">
                  <div class="content_title">“2022年优秀造价咨询企业”认定结果公示</div>
                  <div class="content_issue">
                    <span>公示发布时间:2022.01.05</span>
                    <span class="content_release">公示截止时间::2022.01.05</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col> -->

        <el-col :span="16">
          <el-card class="item-card-bottom">
            <div class="card-header">
              <div class="card-title">正在进行的认定</div>
              <el-button type="primary" text="primary" @click="move">更多</el-button>
            </div>
            <div class="content" v-if="userPageData">
              <div class="cloumn" v-for="item in userPageData" :key="item.id">
                <div class="cloumn-content">
                  <div class="content_title">
                    <el-tag>认定</el-tag>
                    <div @click="lockAnnouncement(item.id)">
                      {{ item.title }}
                    </div>
                  </div>
                  <div class="content_issue">
                    <span>发布日期:{{ item.time }}</span>
                    <span class="content_release">发布部门:{{ item.issuer }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="selecting-body">
              <div class="selecting" v-for="item in todoList">
                <div class="selecting-list">
                  <div class="selecting-content">
                    <el-tag
                      :color="item.id === 1 ? 'rgba(245, 250, 255, 1)' : 'rgba(255, 252, 244, 1)'"
                      :type="item.id === 2 ? 'warning' : ''"
                    >
                      {{ item.name }}
                    </el-tag>
                    <span class="selecting-title">{{ item.title }}</span>
                  </div>
                  <div class="selecting-time">
                    认定提交开始日期 ~ 认定提交结束日期：{{ item.selectionTime }}
                  </div>
                </div>
                <div class="selecting-cards">
                  <div class="selecting-card">
                    <div class="color-card"></div>
                    <div class="content-card">
                      <p>通知参与企业</p>
                      <span>{{ item.ent }}</span>
                    </div>
                  </div>
                  <div class="selecting-card">
                    <div class="color-card"></div>
                    <div class="content-card">
                      <p>当前提交认定</p>
                      <span>{{ item.now }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="item-card-bottom">
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
  .banner {
    border-radius: 5px;
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

      .item-card-top {
        box-sizing: border-box;
        height: 22vh;
        padding: 16px;
        .content {
          flex: 1;
          overflow: auto;
        }
        .noContent {
          width: 100%;
          height: 100%;
          background: url('@/assets/img/nodata.png') no-repeat center center;
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
            width: 33%;
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
        }
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
          margin: auto 0;

          .selecting {
            margin-bottom: 2%;
            display: flex;
            .selecting-list {
              width: 70%;
              .selecting-content {
                .selecting-title {
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
                  width: 100%;
                  text-align: center;
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
        padding-top: 10px;
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
