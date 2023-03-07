<template>
  <el-dialog
    modal-class="view-modal"
    v-model="visible"
    :title="title"
    width="70%"
    destroy-on-close
    center
    @close="visible = false"
  >
    <el-row :gutter="20" v-loading="loading">
      <el-col :md="18">
        <template v-for="(detail, index) in state.details" :key="index">
          <div class="rate-detail">
            <div class="main-header-area">
              <div class="main-title">
                {{ detail.name }}（
                <text style="color: #007ffd; margin-top: 3px">
                  {{ detail.selfRatingTotalScore }}
                </text>
                /{{ detail.totalScore }}分）
              </div>
            </div>
            <el-table border :data="detail.children">
              <el-table-column label="序号" type="index" width="60" align="center" />
              <el-table-column label="评分项目" prop="name" width="140" align="center" />
              <el-table-column label="单项分值" prop="singleScore" width="90" align="center">
                <template #default="{ row }">{{ row.minScore }}~{{ row.maxScore }}分</template>
              </el-table-column>
              <el-table-column
                label="备注说明（对证明文件的描述）"
                width="220"
                prop="declareDesc"
              />
              <el-table-column label="证明文件" prop="files" width="200" align="center">
                <template #default="{ row }">
                  <file-thumb :file-list="row.files" />
                </template>
              </el-table-column>
              <el-table-column label="我的评分" prop="proficientScore" width="90" align="center" />
              <el-table-column label="专家评审意见" prop="proficientOpinion" align="center" />
            </el-table>
          </div>
        </template>
      </el-col>
      <el-col :md="6">
        <div class="main-header-area">
          <div class="main-title">修改记录</div>
        </div>
        <el-divider />
        <template v-if="state.histories?.length">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in state.histories"
              :key="index"
              :timestamp="activity.createTimeStr"
              color="#007ffd"
            >
              <p style="font-weight: bold">
                {{ activity.content }}
              </p>

              <p>{{ activity.operatorName }}</p>
            </el-timeline-item>
          </el-timeline>
        </template>
        <template v-else>
          <el-empty :image-size="50" />
        </template>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { defineExpose, ref } from 'vue';
import { viewDetailApi, scoreLogApi } from '@/views/selection/my-rating/api.js';

const visible = ref(false);
const loading = ref(false);
const title = ref('');
const state = ref({ details: [], histories: [] });

defineExpose({
  async open(row) {
    title.value = `“${row.session || row.name}”专家评分预览`;
    visible.value = true;
    try {
      loading.value = true;
      const params = {
        id: row.id,
        declareId: row.declareInfoId || row.declareId,
        scoreSummaryId: row.scoreSummaryId
      };
      if (row.proficientDeclareDetailSelectionProjectBindId) {
        params.id = row.proficientDeclareDetailSelectionProjectBindId;
        params.proficientId = row.id;
      }
      const res = await viewDetailApi(params);
      const { data: histories } = await scoreLogApi({
        scoreSummaryId: row.scoreSummaryId,
        proficientId: row.id
      });
      state.value.details = res.data.details;
      state.value.histories = histories;
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped lang="less">
.view-modal {
  .rate-detail {
    margin-bottom: 10px;

    h3 {
      margin-bottom: 10px;
    }
  }
}
</style>
