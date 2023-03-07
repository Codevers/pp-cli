<!-- 专家工作台 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { getTodoList, userPageList } from '@/api/wel.js';
import calendar from '@/utils/calendar.js';
import { getSelecting, getTechnicalIssue } from './api';
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
  issueData: []
});
const { userPageData, todoData, issueData } = toRefs(state);
//查询系统公告
const { run: userPageFun } = useRequest(userPageList, {
  manual: true,
  onSuccess: (data) => {
    userPageData.value = data.data.data;
  }
});
//查询我的待办
const { run: todoListFun } = useRequest(getTodoList, {
  manual: true,
  onSuccess: (data) => {
    state.todoData = data.data;
  }
});
//查询我的事项
useRequest(getTechnicalIssue, {
  onSuccess: (data) => {
    state.issueData = data.data;
  }
});
onMounted(() => {
  userPageFun({ pageIndex: 1, pageSize: 3 });
  todoListFun({ userCategory: typeKey == 0 ? 'ENTERPRISE' : 'PERSONAL' });
});

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
            <div class="my-todoList">
              <div class="todoList">
                <div class="todoList-img">
                  <img src="@/assets/img/todoList.png" alt="" />
                </div>
                <div class="todoList-content">
                  <p>待办事项</p>
                  <router-link class="todo-number" :to="{ path: '/specialist/backlog' }">
                    {{ issueData.todoCount }}
                  </router-link>
                </div>
              </div>
              <div class="doneList">
                <div class="todoList-img">
                  <img src="@/assets/img/doneList.png" alt="" />
                </div>
                <div class="todoList-content">
                  <p>已办事项</p>
                  <router-link class="done-number" :to="{ path: '/specialist/haveDone' }">
                    {{ issueData.doneCount }}
                  </router-link>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="item-card-top">
            <div class="card-header">
              <div class="card-title">系统操作手册</div>
            </div>
            <div class="manual">
              <div class="appraise_bg">
                <a
                  target="_blank"
                  href="/operationManual/安徽省工程造价咨询行业优秀企业和优秀个人专家评分操作手册.pdf"
                >
                  <img src="@/assets/img/technicalManual.png" class="appraise_img" />
                  <p>专家评分操作手册</p>
                </a>
              </div>
              <div class="appraise_bg">
                <a
                  target="_blank"
                  href="/operationManual/安徽省工程造价咨询行业优秀企业和个人公示平台操作手册.pdf"
                >
                  <img src="@/assets/img/publicity_tech.png" class="appraise_img" />
                </a>
                <p>外网公示使用说明</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-card class="item-card-bottom">
            <div class="card-header">
              <div class="card-title">系统公告</div>
              <el-button type="primary" text="primary" @click="move" v-if="userPageData.length">
                更多
              </el-button>
            </div>
            <div class="bottom-content" v-if="userPageData.length">
              <div class="cloumn" v-for="item in userPageData" :key="item.id">
                <div class="cloumn-content">
                  <div class="content_title">
                    <el-tag>认定</el-tag>
                    <span link @click="lockAnnouncement(item.id)" class="content-button">
                      {{ item.title }}
                    </span>
                  </div>
                  <div class="content_issue">
                    <span>发布日期:{{ item.time }}</span>
                    <span class="content_release">发布部门:{{ item.issuer }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="noContent" v-else></div>
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
  .content {
    flex: 1;
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

          -items: center;
          margin: 0 20px;
          .appraise_bg {
            width: 6vw;
            margin: auto;
            background-size: cover;
            text-align: center;
            .appraise_img {
              width: 80px;
              height: 80px;
            }
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
            height: 120%;
            display: flex;
            background-color: rgba(255, 192, 36, 0.05);
          }
          .doneList {
            width: 40%;
            height: 120%;
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
              width: 60%;
            }
          }
          .todoList-content {
            width: 50%;
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
      }
      .calendarDate {
        overflow: auto;
      }
      .item-card-bottom {
        box-sizing: border-box;
        height: 47vh;
        padding: 16px;
        .bottom-content {
          flex: 1;
          overflow: auto;
        }
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
              :deep(.el-tag) {
                --el-icon-size: 10px;
                color: #2bb9d4;
                margin-right: 6px;
              }
              .content-button {
                align-items: center;
                font-size: 16px;
                font-weight: 600;
                color: #4a4a4a;
                line-height: 20px;
                margin-bottom: 8px;
                cursor: pointer;
                color: rgb(64, 158, 255);
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
                // .content-card {
                //   display: flex;
                //   width: 100%;
                //   height: 100%;
                //   text-align: center;
                //   justify-content: center;
                //   align-items: center;
                //   background-color: rgba(248, 251, 255, 1);
                // }
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
  :deep(.el-card.is-always-shadow) {
    box-shadow: none;
  }
}
</style>
