<!-- 预览填报信息 -->
<script setup>
import { onMounted, reactive, toRefs, ref, computed } from 'vue';
import useRequest from '@/hooks/use-request';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getPath, getFileData, getImgindex } from '@/utils/index.js';

const column = [
  {
    type: 'index',
    width: '60px',
    label: '序号',
    align: 'center'
  },
  {
    prop: 'name',
    label: '评分项目'
  },
  {
    prop: 'maxScore',
    label: '单项分值',
    formatter: (row) => {
      let minScore = row.minScore != null ? row.minScore : ' ';
      return minScore + '~' + row.maxScore + '分';
    }
  },
  {
    prop: 'selfRatingScore',
    label: '自评分',
    width: 80
  },
  {
    prop: 'description',
    slotName: 'description',
    align: 'left',
    label: '备注说明（对证明文件的描述）',
    minWidth: 200,
    'show-overflow-tooltip': true
  },
  {
    prop: 'isPublicStr',
    label: '是否公示',
    width: 100
  },
  {
    prop: 'files',
    label: '证明文件',
    slotName: 'supportFiles',
    width: 200
  }
];
const fileType = ['pdf', 'doc', 'docx', 'xlsx', 'xls'];
const fileLog = {
  pdf: new URL(`../../assets/img/pdf.png`, import.meta.url).href,
  doc: new URL(`../../assets/img/word.png`, import.meta.url).href,
  docx: new URL(`../../assets/img/word.png`, import.meta.url).href,
  xlsx: new URL(`../../assets/img/excel.png`, import.meta.url).href,
  xls: new URL(`../../assets/img/excel.png`, import.meta.url).href
};
//判断是否是图片
const getfileType = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  return fileType.includes(testFile);
};
//获得图片log
const getFileLog = (file) => {
  const testFile = file.name?.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  // const testFile = file.name.split('.')[1].toLowerCase();
  if (fileType.includes(testFile)) {
    return fileLog[testFile];
  }
};

const state = reactive({
  data: [],
  history: [],
  totalPoints: 0,
  fileList: [],
  activityTopic: ''
});
const { data, totalPoints, history, fileList, activityTopic } = toRefs(state);
const lockDialog = ref(false);

//计算属性获得 totalPoints
state.totalPoints = computed({
  get() {
    let count = state.data.reduce((total, cur) => {
      return total + Number(cur.selfRatingScore);
    }, 0);
    return count;
  }
});

// const close = () => {
//   lockDialog.value = false;
// };

function filexd(id) {
  //当点击"定位"按钮之后,实现屏幕滚动到这个id的位置,并且在屏幕的中间
  let element = document.getElementById(id);
  if (id) {
    element.style.color = 'red';
    element.scrollIntoView({ block: 'center' });
  }
}

//打开弹窗并接受父组件参数
function open({ api, id, reportorId, projectName }) {
  //调用获得详情接口
  useRequest(() => api({ activityId: id, reportorId: reportorId }), {
    onSuccess: (data, isSuccess) => {
      if (isSuccess) {
        state.data = data.data.details;
        let history = data.data.history;
        // 将 content 转换为数组
        history.forEach((item) => {
          item.content = JSON.parse(item.content);
        });
        state.history = history;
        state.fileList = data.data.files;
        state.activityTopic = data.data.activityTopic;

        lockDialog.value = true;
        setTimeout(() => {
          filexd(projectName);
        }, 10);
      } else {
        ElMessage.error(data.msg);
      }
    }
  });
}
// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});
</script>

<template>
  <el-dialog
    v-model="lockDialog"
    width="70%"
    destroy-on-close
    title="认定上报信息预览"
    close-on-press-escape
    center
  >
    <!--  :before-close="close" -->
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="header">
          <h3>{{ activityTopic }}信息预览</h3>
          自评总得分：
          <span style="color: red">{{ totalPoints }}</span>
        </div>
        <el-divider />
        <section v-for="(item, index) in data" :key="index">
          <div class="main-header-area">
            <div class="main-title" :id="item.projectName">
              {{ item.projectName }}（
              <text class="score">
                {{ item.selfRatingScore }}
              </text>
              /{{ item.totalScore }}分）
            </div>
          </div>
          <el-table-next :column="column" :data="item.projectSubs" border>
            <!-- <template #description="{ row }">
              <p style="white-space: break-spaces">{{ row.description }}</p>
            </template> -->
            <template #supportFiles="{ row }">
              <div class="fileList">
                <div v-for="(item, i) in row.files" :key="i">
                  <el-tooltip class="box-item" effect="dark" :content="item.name" placement="top">
                    <a
                      v-if="getfileType(item)"
                      v-bind="item.suffix.toLowerCase() != 'pdf' ? { download: item.name } : {}"
                      :href="getPath(item)"
                      target="_blank"
                    >
                      <img class="img" :src="getFileLog(item)" />
                    </a>
                    <el-image
                      v-else
                      :key="i"
                      style="width: 50px; height: 50px; margin: 0 5px 5px 0"
                      :src="getPath(item)"
                      :preview-src-list="getFileData(row.files)"
                      :initial-index="getImgindex(item, row.files)"
                      fit="cover"
                      preview-teleported
                    />
                  </el-tooltip>
                </div>
              </div>
            </template>
          </el-table-next>
        </section>
        <section>
          <div class="main-header-area">
            <div class="main-title">申请材料</div>
          </div>
          <div class="fileData">
            <div class="fileBox" v-for="item in fileList" :key="item.fileCategoryKey">
              <a
                v-if="getfileType(item)"
                v-bind="item.suffix.toLowerCase() != 'pdf' ? { download: item.name } : {}"
                :href="getPath(item)"
                target="_blank"
              >
                <img class="img" :src="getFileLog(item)" />
              </a>
              <el-image
                v-else
                style="width: 100px; height: 100px"
                :src="getPath(item)"
                :preview-src-list="getFileData(fileList)"
                :initial-index="getImgindex(item, fileList)"
                fit="cover"
              />
              <p>{{ item.fileCategoryName }}</p>
            </div>
          </div>
        </section>
      </el-col>
      <el-col :span="1">
        <el-divider direction="vertical" style="height: 100%" border-style="dashed" />
      </el-col>
      <el-col :span="7" style="padding-top: 10px">
        <div class="main-header-area">
          <div class="main-title">修改记录</div>
        </div>
        <el-divider />
        <section class="contentRight">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in history"
              :key="index"
              :timestamp="activity.operatorTime"
              color="#007ffd"
            >
              <div style="display: flex">
                <h1 style="font-weight: bold; margin-right: 10px">
                  {{ activity.operatorName }}
                </h1>
              </div>
              <div v-for="(item, index) in activity.content" :key="index">{{ item }}</div>
            </el-timeline-item>
          </el-timeline>
        </section>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<style lang="less" scoped>
.header {
  text-align: center;
  color: #989cb0;
  margin-bottom: 10px;
  font-size: 14px;
  h3 {
    font-size: 18px;
    font-weight: bold;
    color: black;
    line-height: 30px;
  }
}
.main-header-area {
  margin: 16px 0;
  .score {
    color: #007ffd;
    margin-top: 3px;
  }
}

.fileList {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  flex-wrap: wrap;
  .img {
    width: 50px;
    height: 50px;
    margin-right: 5px;
  }
}
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

//修改记录
:deep(.el-timeline-item__tail) {
  border-left: 1px solid rgba(36, 146, 252, 0.5);
}
:deep(.el-descriptions__cell) {
  width: 200px;
}
:deep(.el-timeline-item__tail) {
  left: 5px;
}
:deep(.el-timeline-item__node--normal) {
  left: 0;
}
</style>
