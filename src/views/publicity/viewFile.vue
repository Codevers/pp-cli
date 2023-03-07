<!-- 证明文件 -->
<script setup>
import { onMounted, ref } from 'vue';
import { getPath, getFileData, getImgindex } from '@/utils/index.js';
import useRequest from '@/hooks/use-request';
import { fileDataApi } from './api.js';
const viewFile = ref(false);
const fileList = ref([]);
//判断是否是 pdf 文件
// const getfileType = (file) => {
//   if (file.attachmentPath) {
//     return file.attachmentPath?.split('.')[1].toLowerCase() == 'pdf';
//   }
//   return false;
// };

const fileTypes = ['pdf', 'xlsx', 'xls'];
const fileLog = {
  pdf: new URL(`../../assets/img/pdf.png`, import.meta.url).href,
  xlsx: new URL(`../../assets/img/excel.png`, import.meta.url).href,
  xls: new URL(`../../assets/img/excel.png`, import.meta.url).href
};
//判断是否是图片
const getfileType = (file) => {
  if (file.attachmentPath) {
    const testFile = file.attachmentPath
      ?.substring(file.attachmentPath.lastIndexOf('.') + 1)
      .toLowerCase();
    return fileTypes.includes(testFile);
  }
  return false;
};
//获得图片log
const getFileLog = (file) => {
  const testFile = file.attachmentPath
    ?.substring(file.attachmentPath.lastIndexOf('.') + 1)
    .toLowerCase();
  if (fileTypes.includes(testFile)) {
    return fileLog[testFile];
  }
};

//判断是否是 pdf 文件
const affirmPdf = (file) => {
  const testFile = file.attachmentPath
    ?.substring(file.attachmentPath.lastIndexOf('.') + 1)
    .toLowerCase();

  return testFile == 'pdf';
};

const { run: getFileFun } = useRequest(fileDataApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      const fileData = data.data.filter((item) => item.attachmentPath);
      fileList.value = fileData;
      viewFile.value = true;
    }
  }
});

function open({ id }) {
  getFileFun(id);
}
defineExpose({
  open
});
</script>
<template>
  <el-dialog v-model="viewFile" width="50%" destroy-on-close title="证明文件" center>
    <div class="fileData">
      <div class="fileBox" v-for="item in fileList" :key="item.fileCategoryKey">
        <a
          v-if="getfileType(item)"
          v-bind="!affirmPdf(item) ? { download: item.selectProjectSubName } : {}"
          :href="getPath(item, 'attachmentPath')"
          target="_blank"
        >
          <img class="img" :src="getFileLog(item)" />
        </a>
        <el-image
          v-else
          style="width: 100px; height: 100px"
          :src="getPath(item, 'attachmentPath')"
          :preview-src-list="getFileData(fileList, 'attachmentPath', 'attachmentPath')"
          fit="cover"
          :initial-index="getImgindex(item, fileList, 'attachmentPath', 'attachmentPath')"
        />
        <p>{{ item.selectProjectSubName }}</p>
      </div>
    </div>
  </el-dialog>
</template>
<style lang="less" scoped>
.fileData {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .fileBox {
    height: 100px;
    width: 100px;
    text-align: center;
    margin: 0 10px 30px 0;
    a,
    img {
      height: 100px;
      width: 100px;
    }
  }
}
</style>
