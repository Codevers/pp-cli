<script setup>
import { reactive, ref, watchEffect } from 'vue';
import usePagination from '@/hooks/use-pagination';
import useRequest from '@/hooks/use-request';
import useTableColumn from './tableColumn';
import { PageEnum } from '@/enums/pageEnum';
import { useRouter } from 'vue-router';
import { getPubilicityPage, getIssuePage, filePathApi } from './api';
import ViewFile from './viewFile.vue';
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;
const router = useRouter();
const { companyColumn, peopleColumn, standardColumn, entColumn, personColumn } = useTableColumn();
const activeName = ref('first');
const isCompany = ref(true);
const viewFileRef = ref(null);
const searchForm = reactive({
  keyWord: '',
  objType: 1,
  queryType: 1
});
const logo = [
  { type: '.pdf', src: new URL('../../assets/img/pdf.png', import.meta.url).href },
  { type: '.doc', src: new URL('../../assets/img/word.png', import.meta.url).href },
  { type: '.xls', src: new URL('../../assets/img/excel.png', import.meta.url).href }
];
const getLogo = (name) => {
  let res = '';
  logo.forEach((item) => {
    if (name.toLowerCase().indexOf(item.type) !== -1) {
      res = item.src;
    }
  });
  return res;
};
const standard = reactive([
  // {
  //   id: '1',
  //   fileType: '实施细则',
  //   fileName: '《关于安徽省工程造价咨询行业优秀企业的实施细则》',
  //   company: '安徽省建设工程造价管理协会',
  //   printTime: '2022年5月20日',
  //   executeTime: '2022年6月1日'
  // },
  // {
  //   id: '2',
  //   fileType: '实施细则',
  //   fileName: '《关于安徽省工程造价咨询行业优秀企业的实施细则》',
  //   company: '安徽省建设工程造价管理协会',
  //   printTime: '2022年5月20日',
  //   executeTime: '2022年6月1日'
  // }
]);
// 评优标准 api   数据
const issueData = ref([]);
const { run: getIssuePageFun } = useRequest(getIssuePage, {
  manual: false,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      issueData.value = data.data;
    }
  }
});

//防止路径有特殊符号发生转译
function getPath(path) {
  const paths = path.split('/');
  paths[paths.length - 1] = encodeURIComponent(paths[paths.length - 1]);
  return baseUrl + paths.join('/');
}
//下载
const download = (path) => {
  const link = document.createElement('a');
  //link.download = file.fileName;
  link.href = getPath(path);
  link.target = '_block';
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};
//获得文件路径 api
const { run: filePathFun } = useRequest(filePathApi, {
  manual: true,
  onSuccess: (data, isSuccess) => {
    if (isSuccess) {
      download(data.data);
    }
  }
});

const fileList = reactive([
  {
    name: '2022年优秀造价咨询企业”评选结果公示.pdf',
    publicTime: '2022.01.05',
    fileSize: '8.9KB'
  },
  {
    name: '2022年优秀造价咨询企业”评选结果公示.doc',
    publicTime: '2022.01.05',
    fileSize: '8.9KB'
  },
  {
    name: '2022年优秀造价咨询企业”评选结果公示.docx',
    publicTime: '2022.01.05',
    fileSize: '8.9KB'
  },
  {
    name: '2022年优秀造价咨询企业”评选结果公示.xls',
    publicTime: '2022.01.05',
    fileSize: '8.9KB'
  },
  {
    name: '2022年优秀造价咨询企业”评选结果公示.xlsx',
    publicTime: '2022.01.05',
    fileSize: '8.9KB'
  }
]);
const {
  dataSource,
  loading,
  total,
  page,
  handlePageChange,
  run: searchTable
} = usePagination(searchForm, getPubilicityPage);

const switchTablePerson = () => {
  searchForm.objType = 2;
  isCompany.value = false;
  searchForm.keyWord = '';
  searchTable();
};
const switchTableEnt = () => {
  searchForm.objType = 1;
  isCompany.value = true;
  searchForm.keyWord = '';
  searchTable();
};
const handleClick = (name) => {
  searchForm.queryType = name === 'first' ? 1 : 2;
  searchForm.objType = 1;
  searchForm.keyWord = '';
  activeName.value = name;
  switchTableEnt();
};
const goLogin = () => {
  router.push(PageEnum.BASE_LOGIN);
};

const viewFile = (id) => {
  viewFileRef.value.open({ id });
};
</script>
<template>
  <el-container class="page-content">
    <el-header class="header">
      <div class="left">
        <img src="@/assets/img/logo.png" alt="" />
      </div>
      <div class="right">
        <a
          target="_blank"
          href="/operationManual/安徽省工程造价咨询行业优秀企业和个人公示平台操作手册.pdf"
        >
          <el-button round type="primary" plain>操作指南</el-button>
        </a>

        <el-button round type="primary" style="margin-left: 10px" @click="goLogin">
          我要申请
        </el-button>
      </div>
    </el-header>
    <el-main class="main">
      <div class="search">
        <!-- <div class="content_logo">
          <img src="../../assets/img/content_logo.png" alt="" />
        </div> -->
        <el-tabs v-model="activeName" @tab-change="handleClick" :stretch="true">
          <el-tab-pane label="认定结果公示" name="first"></el-tab-pane>
          <el-tab-pane label="认定结果查询" name="second"></el-tab-pane>
          <el-tab-pane label="相关文件" name="third"></el-tab-pane>
        </el-tabs>
        <div class="content">
          <div v-show="activeName === 'first'">
            <el-form
              :inline="true"
              size="large"
              :model="searchForm"
              ref="searchFormRef"
              @submit.native.prevent
              @keyup.enter.native="searchTable"
            >
              <el-form-item label="关键词" prop="keyWord" class="keyWord">
                <el-input
                  v-model="searchForm.keyWord"
                  placeholder="请输入要查询的企业或人员或地市或年度"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchTable">查询</el-button>
              </el-form-item>
              <el-form-item class="search-btns">
                <el-button
                  size="large"
                  :class="searchForm.objType === 1 ? 'selected' : 'unselected'"
                  text
                  @click="switchTableEnt"
                >
                  <img src="../../assets/img/excellentMedal.png" />
                  优秀企业公示
                </el-button>
                <el-button
                  size="large"
                  :class="searchForm.objType !== 1 ? 'selected' : 'unselected'"
                  text
                  @click="switchTablePerson"
                >
                  <img src="../../assets/img/excellentMedal.png" />
                  优秀个人公示
                </el-button>
              </el-form-item>
            </el-form>
            <el-table-next
              :column="searchForm.objType === 1 ? entColumn : personColumn"
              :data="dataSource"
              class="main-table"
              border
              v-loading="loading"
              max-height="500"
            >
              <template #fileData="{ row }">
                <el-button link type="primary" size="small" @click="viewFile(row.id)">
                  查看
                </el-button>
              </template>
            </el-table-next>
            <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
          </div>
          <div v-show="activeName === 'second'">
            <el-form
              :inline="true"
              size="large"
              :model="searchForm"
              ref="searchFormRef"
              @submit.native.prevent
              @keyup.enter.native="searchTable"
            >
              <el-form-item label="关键词" prop="keyWord" class="keyWord">
                <el-input
                  v-model="searchForm.keyWord"
                  placeholder="请输入要查询的企业或人员或地市或年度"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchTable">查询</el-button>
              </el-form-item>
              <el-form-item class="search-btns">
                <el-button
                  size="large"
                  :class="searchForm.objType === 1 ? 'selected' : 'unselected'"
                  text
                  @click="switchTableEnt"
                >
                  <img src="../../assets/img/excellentMedal.png" />
                  优秀企业
                </el-button>
                <el-button
                  size="large"
                  :class="searchForm.objType !== 1 ? 'selected' : 'unselected'"
                  text
                  @click="switchTablePerson"
                >
                  <img src="../../assets/img/excellentMedal.png" />
                  优秀个人
                </el-button>
              </el-form-item>
            </el-form>
            <el-table-next
              :column="searchForm.objType === 1 ? companyColumn : peopleColumn"
              :data="dataSource"
              border
              v-loading="loading"
              max-height="500"
            ></el-table-next>
            <Pagination @pageChange="handlePageChange" :total="total" :page="page" />
          </div>
          <div v-show="activeName === 'third'">
            <!--  v-loading="issueLoading" -->
            <el-table-next
              :column="standardColumn"
              max-height="500"
              :data="issueData"
              border
              class="main-table"
            >
              <template #docName="{ row }">
                <span
                  style="color: #409eff; cursor: pointer"
                  @click="filePathFun({ id: row.systemAttachmentId })"
                >
                  {{ row.docName }}
                </span>
              </template>

              <!-- <template #remark="{ row }">
                <div>{{ row.printTime }} 印发</div>
                <div>{{ row.executeTime }} 施行</div>
              </template> -->
            </el-table-next>
            <!-- <Pagination @pageChange="issuePageChange" :total="issueTotal" :page="issuePage" /> -->
          </div>
        </div>
      </div>
    </el-main>
    <el-footer>
      <div class="web-info">
        <div>
          <span>
            主办单位：
            <a
              style="color: #409eff"
              :underline="false"
              href="http://www.ahzjxh.org.cn"
              target="_blank"
            >
              安徽省建设工程造价管理协会
            </a>
          </span>
          <span>协会咨询电话：0551-62877649、62875245</span>
          <span>
            技术支持：
            <a
              style="color: #409eff"
              :underline="false"
              href=" http://www.futuresoft.com.cn"
              target="_blank"
            >
              南京未来高新技术有限公司
            </a>
          </span>
          <span>技术支持电话：025-52349033</span>
          <span>技术咨询QQ群：713714877</span>
        </div>
        <div>
          <span>本系统建议浏览器：谷歌浏览器、360/搜狗/QQ等浏览器极速模式</span>
        </div>
      </div>
    </el-footer>
    <ViewFile ref="viewFileRef" />
  </el-container>
</template>

<style scoped lang="less">
.page-content {
  height: 100%;
  background: #fff;
  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    .left {
      width: 100%;
      height: 50px;
      img {
        height: 50px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      .indexEntry {
        width: 100px;
        height: 30px;
        border-radius: 15px;
        transition: 0.2s;
        cursor: pointer;
        .abs-center;
        span {
          color: #fff;
        }
        &:hover {
          background-color: #286cd8;
        }
      }
    }
  }
  .main {
    background: url('@/assets/img/bg_publicity.png') no-repeat center top;
    background-size: 100% 50%;
    display: flex;
    width: 100%;
    justify-content: center;
    align-content: center;
    .search {
      margin-top: 2%;
      height: 70%;
      width: 70%;

      .content_logo {
        text-align: center;
      }
      .el-tabs {
        width: 80%;
        margin: 3% auto 0 auto;
        :deep(.el-tabs__item) {
          color: #d1dbe5;
          font-size: 16px;
        }
        :deep(.el-tabs__item.is-active) {
          color: #fff;
          font-size: 18px;
        }
      }
      .content {
        background-color: #fff;
        height: 100%;
        border-radius: 10px 10px 0 0;
        padding: 30px;
        .file-info {
          height: 60px;
          margin: auto 0;
          .el-col {
            margin: auto 0;
            p span {
              margin-right: 10%;
              font-size: 13px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}
.keyWord {
  width: 30%;
}
.search-btns {
  float: right;
  margin-right: 0;
  .el-button {
    border: 1px rgba(244, 167, 2, 1) solid;
    img {
      margin-right: 10px;
    }
    &:hover {
      background-color: rgba(244, 167, 2, 1);
      color: rgba(255, 255, 255, 1);
    }
    &:focus {
      background-color: rgba(244, 167, 2, 1);
      color: rgba(255, 255, 255, 1);
    }
  }
}
.selected {
  background-color: rgba(244, 167, 2, 1);
  color: rgba(255, 255, 255, 1);
}
.unselected {
  color: rgba(244, 167, 2, 1);
}
:deep(.el-tabs__nav-wrap::after) {
  position: static;
}

:deep(.el-tabs__active-bar.is-top) {
  background-color: transparent;
}
:deep(.el-tabs__active-bar.is-top::before) {
  content: '';
  display: block;
  background: #fff;
  height: 2px;
  width: 100px;
  margin: auto;
}
.web-info {
  text-align: center;
  div {
    margin-bottom: 10px;
    span {
      margin-left: 10px;
    }
  }
}
</style>
