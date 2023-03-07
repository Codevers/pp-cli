<script setup>
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import useRequest from '@/hooks/use-request';
import { GetLayoutData } from './api';
import { useFullscreen } from 'v3hooks';
import * as echarts from 'echarts';
import { getPieOption } from './chart-configure/pie';
import { getLineOption } from './chart-configure/line';
import { getMapOption } from './chart-configure/map';
import { appStoreWithOut } from '@/store/modules/app';
// import '@/config/charts-theme.js';
// import chartsTheme from '@/config/charts-theme.json';
// let themeObj = JSON.parse(chartsTheme);
// echarts.registerTheme('charts-theme', chartsTheme);
let lineChart1 = null;
let lineChart2 = null;
let pieChart1 = null;
let pieChart2 = null;
let pieChart3 = null;
let pieChart4 = null;
let mapChart = null;
const nowTime = ref('');
const fullScreen = ref();
const personalDataInfo = ref(null);
const professionalDataInfo = ref(null);
const [isFullscreen, { setFull, exitFull }] = useFullscreen(fullScreen, {
  onFull() {
    resizeCharts();
  },
  onExitFull() {
    resizeCharts();
  }
});
watch(
  () => appStoreWithOut.navMode,
  () => {
    resizeCharts();
  }
);
function getDate() {
  const year = new Date().getFullYear();
  const month =
    new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
  const date = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
  const hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
  const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
  const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
  const week = new Date().getDay();
  let nowWeek = '';
  switch (week) {
    case 1:
      nowWeek = '周一';
      break;
    case 2:
      nowWeek = '周二';
      break;
    case 3:
      nowWeek = '周三';
      break;
    case 4:
      nowWeek = '周四';
      break;
    case 5:
      nowWeek = '周五';
      break;
    case 6:
      nowWeek = '周六';
      break;
    case 27:
      nowWeek = '周日';
      break;
  }
  nowTime.value = `${year}年${month}月${date}日 ${nowWeek} ${hh}:${mm}:${ss}`;
}
useRequest(GetLayoutData, {
  deepData: true,
  onSuccess(data) {
    const { provinceInfo, personalInfo, professionalInfo, enterpriseInfo } = data;
    const { titleDistribute, majorDistribute, committeeDistribute, committeeDi, stribute } =
      professionalInfo;
    personalDataInfo.value = personalInfo;
    professionalDataInfo.value = professionalInfo;
    nextTick(() => {
      // 地图
      mapChart.setOption(getMapOption(provinceInfo.customerDistribute));
      // 个人会员-年龄分布
      pieChart1.setOption(getPieOption(personalInfo.ageDistribute));
      // 专家职称分布
      pieChart2.setOption(getPieOption(titleDistribute));
      // 专家从事专业分布
      pieChart3.setOption(getPieOption(majorDistribute));
      // 专家委员会年龄分布
      pieChart4.setOption(getPieOption(professionalInfo.ageDistribute));
      // 个人会员-入会年度走势
      lineChart1.setOption(getLineOption(personalInfo.membershipYear, 2));
      // 企业会员-入会年度走势
      lineChart2.setOption(getLineOption(enterpriseInfo.membershipYear, 1));
    });
  }
});

function resizeCharts() {
  nextTick(() => {
    mapChart?.resize();
    lineChart1?.resize();
    lineChart2?.resize();
  });
}

function initCharts() {
  pieChart1 = echarts.init(document.getElementById('pieChart1'), 'charts-theme');
  pieChart2 = echarts.init(document.getElementById('pieChart2'), 'charts-theme');
  pieChart3 = echarts.init(document.getElementById('pieChart3'), 'charts-theme');
  pieChart4 = echarts.init(document.getElementById('pieChart4'), 'charts-theme');
  lineChart1 = echarts.init(document.getElementById('lineChart1'), 'charts-theme');
  lineChart2 = echarts.init(document.getElementById('lineChart2'), 'charts-theme');
  mapChart = echarts.init(document.getElementById('mapChart'), 'charts-theme');
}

onMounted(() => {
  initCharts();
  setInterval(getDate, 500);
});

function switchFull() {
  // 拦截错误，避免使用esc退出功能，造成无法再次全屏（目的在于激活screen）
  try {
    exitFull();
  } catch (error) {
    setFull();
  }
  isFullscreen.value ? exitFull() : setFull();
}
onBeforeUnmount(() => {
  getDate && clearInterval(getDate);
});
</script>

<template>
  <div class="data-main" ref="fullScreen">
    <!-- 头部背景 -->
    <div class="header">
      <span class="system-date">{{ nowTime }}</span>
      <div class="full-screen-view" @click="switchFull">
        <img src="../../../assets/data-screen/full.png" alt="" />
      </div>
    </div>
    <!-- 主内容 -->
    <div class="data-content">
      <el-row :gutter="15" align="middle" style="height: 65%">
        <!-- 饼图 -->
        <el-col :span="6" class="col-layout">
          <div class="column">
            <!-- <div class="column-content"> -->
            <div class="title">个人会员-性别分布</div>
            <div class="cm-content" style="height: 150px">
              <!-- <div class="sub-content"> -->
              <div class="sex-type">
                <div class="sex">
                  <img src="../../../assets/data-screen/sex-boy.png" />
                  <p>{{ personalDataInfo?.genderDistribute['男'].item1 }}%</p>
                </div>
                <div class="sex">
                  <img src="../../../assets/data-screen/sex-girl.png" />
                  <p style="color: #ffcc00">
                    {{ personalDataInfo?.genderDistribute['女'].item1 }}%
                  </p>
                </div>
              </div>
              <!-- </div> -->
            </div>
            <!-- </div> -->
          </div>
          <div class="column">
            <div class="column-content">
              <div class="title">个人会员-年龄分布</div>
              <div class="cm-content set-center">
                <div id="pieChart1" class="pie-chart-area"></div>
              </div>
            </div>
          </div>
        </el-col>
        <!-- 3d地图 -->
        <el-col :span="12" class="col-layout">
          <div class="main-map" id="mapChart"></div>
        </el-col>
        <!-- 饼图 -->
        <el-col :span="6" class="col-layout">
          <div class="column">
            <div class="title">专家性别分布</div>
            <div class="cm-content">
              <div class="sex-type">
                <div class="sex">
                  <img src="../../../assets/data-screen/sex-boy.png" />
                  <p>{{ professionalDataInfo?.genderDistribute['男'].item1 }}%</p>
                </div>
                <div class="sex">
                  <img src="../../../assets/data-screen/sex-girl.png" />
                  <p style="color: #ffcc00">
                    {{ professionalDataInfo?.genderDistribute['女'].item1 }}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="title">专家职称分布</div>
            <div class="cm-content set-center">
              <div id="pieChart2" class="pie-chart-area"></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 底部折线图+饼图 -->
      <el-row :gutter="15" style="height: 35%">
        <el-col :span="6" class="col-layout">
          <div class="column" style="margin-bottom: 0">
            <div class="title">个人会员-入会年度走势</div>
            <div class="cm-content set-center">
              <div id="lineChart1" class="line-chart-area"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="col-layout">
          <div class="column" style="margin-bottom: 0">
            <div class="title">企业会员-入会年度走势</div>
            <div class="cm-content set-center">
              <div id="lineChart2" class="line-chart-area"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="col-layout">
          <div class="column" style="margin-bottom: 0">
            <div class="title">专家从事专业分布</div>
            <div class="cm-content set-center">
              <div id="pieChart3" class="pie-chart-area"></div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="col-layout">
          <div class="column" style="margin-bottom: 0">
            <div class="title">专家委员会年龄分布</div>
            <div class="cm-content set-center">
              <div id="pieChart4" class="pie-chart-area"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="less" scoped>
@assestUrl: '../../../assets/data-screen/';
.full-screen-view {
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  z-index: 99;
  right: 5px;
  top: 5px;
  .abs-center;
  img {
    width: 16px;
    height: 16px;
  }
}
.pie-chart-area {
  width: 380px;
  height: 212px;
  background: url(../../../assets/data-screen/pie-round.png) 16% 50% no-repeat;
  background-size: 41%;
}
.line-chart-area {
  width: 100%;
  height: 212px;
}
.data-main {
  background: url('@{assestUrl}/bg.jpg') no-repeat;
  height: 100%;
  background-size: cover;
  position: relative;
}
.header {
  background: url('@{assestUrl}/header.png') no-repeat;
  background-size: 100% 106px;
  height: 106px;
  position: relative;
  .system-date {
    position: absolute;
    left: 15%;
    top: 58%;
    font-size: 12px;
    color: #eaeaea;
  }
}
.data-content {
  padding: 0 20px 30px;
  height: calc(100% - 126px);
}
.content-box {
  display: flex;
  justify-content: space-between;
}
.side {
  min-width: 450px;
}
.set-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.column {
  min-width: 350px;
  margin-bottom: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  .column-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .title {
    background: url('@{assestUrl}/head-column.png') no-repeat;
    background-size: 100% 45px;
    height: 45px;
    line-height: 45px;
    padding-left: 60px;
    color: #fff;
    font-size: 18px;
    flex-shrink: 0;
  }
  .cm-content {
    // height: 212px;
    background: rgba(2, 53, 93, 0.31);
    overflow: hidden;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    .sub-content {
      margin-top: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sex-type {
      display: flex;
      justify-content: center;
      margin: 15px 70px;
      justify-content: space-between;
      width: 300px;
      .sex {
        img {
          width: 92px;
          height: 84px;
        }
        p {
          font-size: 22px;
          color: #0077ff;
          text-align: center;
          margin-top: 20px;
        }
      }
    }
  }
}
.main-map {
  flex: 1;
  height: 560px;
  margin: 0 10px;
  display: flex;
  align-items: center;
}
.col-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
