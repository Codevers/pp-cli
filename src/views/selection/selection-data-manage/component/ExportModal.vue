<template>
  <el-dialog
    custom-class="view-modal"
    v-model="visible"
    :title="title"
    :width="1400"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    center
    @close="visible = false"
  >
    <h2 class="caption">
      申报单位：
      <span class="mark">安徽省招标集团股份有限公司</span>
      申报联系人：
      <span class="mark">宋颂 18951610000</span>
      申报时间：
      <span class="mark">2022-01-15</span>
    </h2>
    <el-tabs type="border-card" v-model="active">
      <el-tab-pane :name="0">
        <template #label>
          <span>企业基本情况</span>
          <span>（满分25分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="1">
        <template #label>
          <span>企业经营</span>
          <span>（满分20分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="2">
        <template #label>
          <span>企业管理</span>
          <span>（满分15分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="3">
        <template #label>
          <span>党建工作</span>
          <span>（满分10分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="4">
        <template #label>
          <span>行业自律</span>
          <span>（满分10分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="5">
        <template #label>
          <span>行业贡献</span>
          <span>（满分10分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="6">
        <template #label>
          <span>教育研究</span>
          <span>（满分10分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="7">
        <template #label>
          <span>社会责任</span>
          <span>（满分5分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="8">
        <template #label>
          <span>附加项</span>
          <span>（满分10分）</span>
        </template>
      </el-tab-pane>
      <el-tab-pane :name="9">
        <template #label>
          <span>初审</span>
          <span></span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!-- 评分表格 start -->
    <template v-if="active < 9">
      <el-table border :data="tableData">
        <el-table-column label="序号" align="center" width="60">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="评分项目" align="center" width="100" />
        <el-table-column label="单项分值" align="center" width="100" />
        <el-table-column label="评分标准说明" />
        <el-table-column label="申报说明" />
        <el-table-column label="证明文件" align="center" width="100" />
        <el-table-column label="市初审意见" align="center" width="250">
          <template #default="{ row }">
            <el-input v-model="row.text" maxlength="200" show-word-limit type="textarea" />
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 10px; text-align: right">
        <template v-if="active > 0">
          <el-button type="primary" @click="prev">上一项</el-button>
        </template>
        <el-button type="primary">保存</el-button>
        <el-button type="primary" @click="next">下一项</el-button>
      </div>
    </template>
    <!-- 评分表格 end -->
    <!-- 初审意见 start -->
    <template v-else>
      <div style="width: 1000px; margin: 0 auto">
        <h1>证明材料：</h1>
        <el-row :gutter="20" class="file-list">
          <el-col :md="4" v-for="(img, index) in fileList" :key="index">
            <el-image
              style="width: 100px; height: 100px"
              :src="img.url"
              :preview-src-list="urlList"
              :initial-index="0"
              fit="contain"
            />
            <h2>{{ img.name }}</h2>
          </el-col>
        </el-row>
        <el-divider />
        <h1>初审意见：</h1>
        <el-input v-model="opinion" rows="4" maxlength="200" show-word-limit type="textarea" />
      </div>
      <div style="margin-top: 10px; text-align: center">
        <el-button type="primary" @click="active = 8">上一项</el-button>
        <el-button type="primary">初审退回</el-button>
        <el-button type="primary">初审通过</el-button>
      </div>
    </template>
    <!-- 初审意见 end -->
  </el-dialog>
</template>

<script setup>
import { defineExpose, reactive, ref } from 'vue';

const tableData = [
  { number: 1 },
  { number: 2 },
  { number: 3 },
  { number: 4 },
  { number: 5 },
  { number: 6 }
];

const visible = ref(false);
const title = ref('“2022年安徽省优秀造价咨询企业”认定');
const active = ref(0);
const fileList = reactive([
  {
    name: '申请表',
    url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
  },
  {
    name: '承诺书',
    url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
  },
  {
    name: '营业执照',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  }
]);
const urlList = fileList.map((file) => file.url);
const opinion = ref('');

function prev() {
  active.value--;
}

function next() {
  active.value++;
}

defineExpose({
  open(params) {
    const { id, name } = params;
    visible.value = true;
  }
});
</script>

<style scoped lang="less">
.view-modal {
  .caption {
    text-align: center;
    margin-bottom: 15px;
    font-size: 16px;

    .mark {
      color: #ff6600;
      margin-right: 20px;

      &:last-of-type {
        margin: 0;
      }
    }
  }

  .el-tabs {
    margin-bottom: 10px;
    border-bottom: 0;

    :deep(.el-tabs__content) {
      padding: 0 !important;
    }

    :deep(.el-tabs__item) {
      height: 50px;
      line-height: 1;
      display: inline-flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      vertical-align: bottom;

      span + span {
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }

  h1 {
    font-size: 16px;
    margin-bottom: 10px;
  }

  .file-list {
    text-align: center;
  }
}
</style>
