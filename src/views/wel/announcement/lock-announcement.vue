<!-- 查看 -- 通知公告 -->
<script setup>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useRequest from '@/hooks/use-request';
import { detailAnnouncement, announcementLog } from '@/api/announcement.js';
const router = useRoute();
const goPath = useRouter();
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;

const fileType = ['pdf', 'doc', 'docx', 'xlsx', 'xls'];
const fileLog = {
  pdf: new URL(`../../../assets/img/pdf.png`, import.meta.url).href,
  doc: new URL(`../../../assets/img/word.png`, import.meta.url).href,
  docx: new URL(`../../../assets/img/word.png`, import.meta.url).href,
  xlsx: new URL(`../../../assets/img/excel.png`, import.meta.url).href,
  xls: new URL(`../../../assets/img/excel.png`, import.meta.url).href
};
function getPath(item, flag = false, path = 'path') {
  const testFile = item.fileName.substring(item.fileName.lastIndexOf('.') + 1).toLowerCase();
  if (fileType.includes(testFile) && !flag) {
    return fileLog[testFile];
  }
  const paths = item[path].split('/');
  paths[paths.length - 1] = encodeURIComponent(paths[paths.length - 1]);
  return baseUrl + paths.join('/');
}

//判断是否是 pdf 文件
const affirmPdf = (file) => {
  const testFile = file.fileName?.substring(file.fileName.lastIndexOf('.') + 1).toLowerCase();
  const fileType = ['jpg', 'png', 'pdf', 'jpeg'];
  return fileType.includes(testFile);
};

const state = reactive({
  fileData: [],
  history: []
});
const { fileData, history } = toRefs(state);
const content = ref('');
const viewLog = ref(false); //判断能否看到右侧修改记录
const { data: lockData = {}, run: lockFun } = useRequest(detailAnnouncement, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    state.fileData = data.data.accessory;
    content.value.contentDocument.body.innerHTML = data.data.document;
  }
});
//公告记录 api
const { run: getLogFun } = useRequest(announcementLog, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      history.value = data.data;
    }
  }
});

//返回上一个页面
const goBack = () => {
  goPath.go(-1);
};
onMounted(() => {
  lockFun({ id: router.query.id, category: 2 });
  getLogFun({ id: router.query.id });

  viewLog.value = router.query.viewLog ? true : false;
});
</script>
<template>
  <div class="main-content">
    <el-button @click="goBack" class="goBack">返回</el-button>
    <div class="main-table-content contentLeft">
      <h3 class="title">
        {{ lockData?.data?.title }}
      </h3>
      <header class="heade">
        <div>发布日期： {{ lockData?.data?.releaseDate }}</div>
        <div>发布部门： {{ lockData?.data?.department }}</div>
      </header>
      <iframe src="about:blank" ref="content" frameborder="0" width="100%" height="600"></iframe>
      <section class="footer">
        <a
          :href="getPath(item, true)"
          v-bind="!affirmPdf(item) ? { download: item.fileName } : {}"
          target="_block"
          v-for="(item, index) in fileData"
          :key="index"
        >
          <div class="itemFile">
            <img :src="getPath(item)" alt="" />
            <div class="file">
              <div class="fileName">
                <span v-if="item.fileName.length < 10">{{ item.fileName }}</span>
                <el-tooltip
                  v-else
                  class="box-item"
                  effect="dark"
                  :content="item.fileName"
                  placement="top"
                >
                  {{ item.fileName.slice(0, 10) }}...
                </el-tooltip>
              </div>
              <div class="fileSize">{{ (item.fileSize / 1024).toFixed(2) }} KB</div>
            </div>
          </div>
        </a>
      </section>
    </div>
    <el-divider v-show="viewLog" direction="vertical" style="height: 100%" border-style="dashed" />
    <section class="contentRight" v-if="viewLog">
      <div class="main-header-area">
        <div class="main-title">修改记录</div>
      </div>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in history"
          :key="index"
          :timestamp="activity.createTimeStr"
          color="#007ffd"
        >
          <div style="display: flex">
            <h1 style="font-weight: bold; margin-right: 10px; word-break: break-all">
              {{ activity.operatorName }}
            </h1>
          </div>

          <p
            v-for="(item, i) in JSON.parse(activity.content)"
            :key="i"
            style="word-break: break-all"
          >
            {{ item }}
          </p>
        </el-timeline-item>
      </el-timeline>
    </section>
  </div>
</template>

<style scoped lang="less">
.main-content {
  position: relative;
  height: 100%;
  background: #fff;
  overflow-y: auto;
  display: flex;
  .contentLeft {
    flex: 1;
  }
  .contentRight {
    width: 25vw;
    // height: 45vh;
    padding-top: 20px;
    overflow: hidden;
    overflow-y: auto;
    :deep(.el-timeline-item__tail) {
      border-left: 1px solid rgba(36, 146, 252, 0.5);
    }
    :deep(.el-timeline-item__tail) {
      left: 5px;
    }
    :deep(.el-timeline-item__node--normal) {
      left: 0;
    }
  }
  .goBack {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 90px;
    height: 35px;
    z-index: 1000;
  }

  .title {
    // height: 26px;
    padding-right: 100px;
    text-align: center;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 700;
    color: #323232;
    line-height: 26px;
    white-space: pre-wrap;
  }
  .heade {
    width: 100%;
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      height: 20px;
      font-size: 14px;
      margin: 0 45px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #989cb0;
      line-height: 20px;
    }
  }
  // .content {
  //   overflow: auto;
  //   max-height: 65vh;
  // }

  .footer {
    display: flex;
    flex-wrap: wrap;
    .itemFile {
      display: flex;
      width: 220px;
      height: 60px;
      padding: 10px;
      margin: 10px;
      border: 1px solid #9bccfb;
      box-sizing: border-box;
    }
    img {
      width: 42px;
      height: 42px;
      margin-right: 10px;
    }
    .fileName {
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323232;
      line-height: 20px;
      overflow: hidden;
    }
    .fileSize {
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #707070;
      line-height: 17px;
    }
  }
}
</style>
