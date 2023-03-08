<!-- 企业工作台 -->
<script setup>
import { onMounted, ref, reactive, toRefs, onUpdated } from 'vue';
import { getTodoList, userPageList } from '@/api/wel.js';
import schedule from '@/components/schedule/index.vue';
import useRequest from '@/hooks/use-request';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import LinkmanDialog from './components/linkmanDialog.vue';
const userStore = useUserStore();
const { typeKey } = userStore.userInfo;

const router = useRouter();
//处理时间  年与日
const getTime = (time, num) => {
  return time?.slice(0, num);
};

const edit = [
  'SAVED', //未提交
  'REVOKED', //已撤回
  'CITY_REJECTED', //市退回
  'PROVINCE_REJECTED' //省退回
];
//UnDeclared  未申报
const lock = [
  'SUBMITTED', //已提交
  'CITY_PASSED', //市审核通过
  'CITY_NOMINATED', //市已推选
  'CITY_REVOKE_NOMINATED', //市推选撤回
  'PROVINCE_PASSED', //省审核通过
  'PROVINCE_REJECTED_CITY_NOMINATED' //省退回市推选
];

//判断是否要禁用 我的填报按钮  以及提示语句
function showType(item) {
  item.disabled = false;
  item.content = '点此进入填报页面！';
  //当前时间 <【活动开始时间】
  if (new Date() < new Date(item.startDateOfActivity)) {
    item.content = '活动还未开始，请耐心等待！';
    item.disabled = true;
  }
  //【活动提交截止时间】< 当前时间 && declareStatus == 撤回 || 未提交 || 未申报 && 没有省市退回的
  if (
    new Date(item.endDateOfCommit) < new Date() &&
    ['SAVED', 'REVOKED', 'UnDeclared'].includes(item.declareStatus) &&
    !item.existRejected
  ) {
    item.content = '当前活动申报已结束！敬请期待下一个活动，感谢您的关注！';
    item.disabled = true;
  }

  //当前时间 > 【退回提交截止时间】
  if (new Date() > new Date(item.endDateOfReturn)) {
    item.content = '当前活动申报已结束！敬请期待下一个活动，感谢您的关注！';
    item.disabled = true;
  }

  // //【退回提交截止时间】> 当前时间 >【活动提交截止时间】
  // //item.declareStatus == 'UnDeclared'
  // if (
  //   new Date(item.endDateOfReturn) > new Date() &&
  //   new Date() > new Date(item.endDateOfCommit) &&
  //   !item.existRejected
  // ) {
  //   item.content = '当前活动申报已结束！敬请期待下一个活动，感谢您的关注！';
  //   item.disabled = true;
  // }

  return item;
}
const state = reactive({
  todoData: [],
  userPageData: []
});
const { userPageData, todoData } = toRefs(state);
//各地联系方式  弹窗
const linkmanDialog = ref(null);
//查询系统公告
const { run: userPageFun } = useRequest(userPageList, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      userPageData.value = data.data.data;
    }
  }
});
//查询我的认定
const { run: todoListFun } = useRequest(getTodoList, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      let list = data.data;
      list.forEach((item) => {
        item = showType(item);
      });
      state.todoData = list;
    }
  }
});

onMounted(() => {
  userPageFun({ pageIndex: 1, pageSize: 3, customerType: typeKey });
  todoListFun({ userCategory: typeKey == 0 ? 'ENTERPRISE' : 'PERSONAL', num: 10 });
});
onUpdated(() => {
  userPageFun({ pageIndex: 1, pageSize: 3, customerType: typeKey });
  todoListFun({ userCategory: typeKey == 0 ? 'ENTERPRISE' : 'PERSONAL', num: 10 });
});

//我的填报
const flexible = (item) => {
  if (item.declareStatus == 'UnDeclared') {
    router.push({
      path: '/wel/enterpriseKpi/notice',
      query: { id: item.id, category: item.category }
    });
  } else {
    //type 为true 可编辑 false 查看
    const type = edit.includes(item.declareStatus);
    router.push({
      path: '/wel/enterpriseKpi/index',
      query: { id: item.id, type, category: item.category }
    });
  }
};
//我的认定更多
const selectionMove = () => {
  router.push({
    path: '/mySelection/index'
  });
};

//系统公告更多
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
const pdfUrl =
  typeKey === 0
    ? '/operationManual/安徽省工程造价咨询行业优秀企业申报系统操作手册.pdf'
    : typeKey === 1
    ? '/operationManual/安徽省工程造价咨询行业优秀个人申报系统操作手册.pdf'
    : '';

// 打开 各地联系方式弹窗
const openLinkmanDialog = () => {
  linkmanDialog.value.open();
};
</script>

<template>
  <div class="main-content">
    <div class="headeImg">
      <img src="@/assets/img/headerTitle1.png" alt="" class="headeTitle" />
    </div>

    <section class="content">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="item-card">
            <div class="card-header">
              <div class="card-title">系统公告</div>
              <el-button type="primary" text="primary" @click="move">更多</el-button>
            </div>
            <div class="content" v-if="userPageData">
              <div class="cloumn" v-for="item in userPageData" :key="item.id">
                <div class="cloumn-content">
                  <div
                    class="content_title"
                    style="cursor: pointer; color: #409eff"
                    @click="lockAnnouncement(item.id)"
                  >
                    {{ item.title }}
                  </div>
                  <div class="content_issue">
                    <span>发布日期:{{ getTime(item.time, 11) }}</span>
                    <span class="content_release">发布部门:{{ item.issuer }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="noContent" v-else></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="item-card">
            <div class="card-header">
              <div class="card-title">我的活动</div>
              <el-button type="primary" text="primary" @click="selectionMove">更多</el-button>
            </div>
            <div class="content" v-if="todoData.length">
              <div class="cloumn" v-for="item in todoData" :key="item.id">
                <div class="cloumn-content">
                  <div class="content_title">
                    <el-tag size="small" color="#E6FBFF">认定</el-tag>
                    {{ item.topic }}
                  </div>
                  <div class="content_issue">
                    <span>
                      认定提交时间 {{ getTime(item.startDateOfActivity, 11) }} ~
                      {{ getTime(item.endDateOfCommit, 11) }}
                    </span>
                  </div>
                </div>
                <el-tooltip class="box-item" effect="dark" :content="item.content" placement="top">
                  <div>
                    <el-button
                      :type="item.disabled ? 'info' : 'primary'"
                      :disabled="item.disabled"
                      round
                      @click="flexible(item)"
                    >
                      我要填报
                    </el-button>
                  </div>
                </el-tooltip>
              </div>
            </div>
            <div class="noContent" v-else></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="item-card">
            <div class="card-header">
              <div class="card-title">活动进度</div>
            </div>
            <div class="content">
              <schedule />
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="item-card">
            <div class="card-header">
              <div class="card-title">系统资料</div>
            </div>
            <div class="manual">
              <div class="appraise_bg">
                <a target="_blank" :href="pdfUrl">
                  <img src="@/assets/img/appraisedata.png" class="appraise_img" />
                  <br />
                  申报操作手册
                </a>
              </div>

              <!-- <div class="appraise_bg">
                <a href="">
                  <img src="@/assets/img/personnel.png" class="appraise_img" />
                  <br />
                  人员认定操作手册
                </a>
              </div> -->

              <div class="appraise_bg">
                <a
                  target="_blank"
                  href="/operationManual/安徽省工程造价咨询行业优秀企业和个人公示平台操作手册.pdf"
                >
                  <img src="@/assets/img/publicity.png" class="appraise_img" />
                  <br />
                  外网公示使用说明
                </a>
              </div>

              <div class="appraise_bg" @click="openLinkmanDialog">
                <img src="@/assets/img/relation.png" class="appraise_img" />
                <br />
                各地联系方式
              </div>
            </div>
            <div class="footer">
              <em>系统操作技术支持：025-52349033</em>
              <em>技术咨询QQ群：713714877</em>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>

  <LinkmanDialog ref="linkmanDialog" />
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
    margin-top: 10px;

    .el-row {
      height: 100%;

      .el-col {
        margin-bottom: 10px;
      }

      .item-card {
        box-sizing: border-box;
        height: 34vh;
        padding: 16px;

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

        .content {
          flex: 1;
          overflow: auto;
        }

        .noContent {
          width: 100%;
          height: 100%;
          background: url('@/assets/img/nodata.png') no-repeat center center;
        }

        .cloumn {
          padding: 8px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;

          .cloumn-content {
            display: flex;
            flex-direction: column;

            .content_title {
              display: flex;
              align-items: center;
              font-size: 16px;
              font-weight: 600;
              color: #4a4a4a;
              line-height: 20px;
              margin-bottom: 8px;

              :deep(.el-tag--small) {
                padding: 0 2px;
                height: 16px;
                --el-icon-size: 10px;
                color: #2bb9d4;
                margin-right: 6px;
              }
            }

            .content_issue {
              font-size: 14px;
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

            img {
              width: 80px;
              height: 80px;
            }

            text-align: center;
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
      }

      :deep(.el-card.is-always-shadow) {
        box-shadow: none;
      }
    }
  }
}
</style>
