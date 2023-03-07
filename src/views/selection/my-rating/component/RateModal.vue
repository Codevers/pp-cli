<template>
  <el-dialog
    modal-class="view-modal"
    v-model="visible"
    width="60%"
    fullscreen
    destroy-on-close
    center
    @close="visible = false"
  >
    <template #title>
      <p style="font-size: 20px; font-weight: bold; color: white">{{ title }}</p>
      <div class="detail" v-if="cache.row.activityCategory == 1">
        <p>
          申报时企业一级注册造价师 {{ auditPointInfo?.firstCostNum }} 人，二级注册造价师
          {{ auditPointInfo?.secondCostNum }}
          人，企业信用等级 {{ auditPointInfo?.creditLevel }}
        </p>
        <p>
          当前企业一级注册造价师 {{ commitPointInfo?.firstCostNum }} 人，二级注册造价师
          {{ commitPointInfo?.secondCostNum }} 人，企业实时信用 {{ auditPointInfo?.creditLevel }}
        </p>
      </div>
    </template>

    <el-row :gutter="20" v-loading="loading">
      <el-col :md="10">
        <h2>申报资料</h2>
        <div class="rate-detail">
          <div class="rate-detail-header">
            <span>
              {{ current.name }}（专家评分：
              <span style="color: red; font-weight: bolder">
                {{ subtotal ?? current.totalScore }}
              </span>
              分）
            </span>
            <div>
              <el-button
                type="primary"
                size="small"
                @click="onChange(-1)"
                :disabled="currentIndex === 0"
              >
                上一项
              </el-button>
              <template v-if="currentIndex < items.length - 1">
                <el-button
                  type="primary"
                  size="small"
                  @click="onChange(1)"
                  :disabled="currentIndex === items.length - 1"
                >
                  下一项
                </el-button>
              </template>
              <template v-else>
                <el-button type="warning" size="small" @click="onDone(true)">提交评分</el-button>
              </template>
              <el-button type="primary" size="small" @click="onDone()">保存评分</el-button>
            </div>
          </div>
          <el-table
            ref="tableRef"
            :data="current.children"
            row-key="id"
            border
            highlight-current-row
            @row-click="onRowClick"
            v-loading="saving"
            element-loading-text="正在保存，请稍等"
          >
            <el-table-column label="评分项" prop="name" width="120" align="center" />
            <el-table-column
              label="备注说明（对证明文件的描述）"
              prop="declareDesc"
              show-overflow-tooltip
            />
            <el-table-column label="专家评分" prop="proficientScore" width="100" align="center">
              <template #default="{ row }">
                <el-input-number
                  style="width: 100%"
                  :max="row.maxScore"
                  :min="row.minScore ?? -Infinity"
                  size="small"
                  :controls="false"
                  :disabled="row.isAutoScore"
                  v-model="row.proficientScore"
                  :precision="2"
                />
                <!--  
                   @change="limitValue($event, row)"
                  @focus="(e) => e.target.click()" -->
              </template>
            </el-table-column>
            <el-table-column
              label="专家评审意见"
              prop="proficientOpinion"
              width="200"
              align="center"
            >
              <template #default="{ row }">
                <el-input v-model="row.proficientOpinion" maxlength="50" show-word-limit />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="rate-detail">
          <div class="rate-detail-header">【{{ selectedRow.name }}】（评分标准）</div>
          <el-table border :data="[selectedRow]">
            <el-table-column label="评分标准" prop="standardDesc">
              <template #default="{ row }">
                <p>{{ row.standardDesc }}</p>
                <p style="color: red" v-show="row.memo">备注：{{ row.memo }}</p>
              </template>
            </el-table-column>
            <el-table-column label="单项分值" prop="singleScore" width="100" align="center">
              <template #default="{ row }">{{ row.minScore }}~{{ row.maxScore }}分</template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :md="14" style="display: flex; flex-direction: column; height: calc(100vh - 139px)">
        <h2>
          相关申报证明文件（共
          <strong style="font-weight: bold; color: red">{{ selectedRow.files?.length }}</strong>
          个）
        </h2>
        <template v-if="selectedRow.files?.length">
          <div style="display: flex; justify-content: center">
            <el-pagination
              background
              layout="prev, pager, next"
              :page-size="1"
              :total="selectedRow.files.length"
              v-model:current-page="activeFileIndex"
            />
          </div>
          <div
            style="
              flex: 1;
              margin-top: 10px;
              overflow: hidden;
              border: 1px solid var(--el-border-color);
            "
          >
            <el-tabs type="card" v-model="activeFileIndex">
              <el-tab-pane
                v-for="(file, index) in selectedRow.files"
                :key="index"
                :label="file.name"
                :name="index + 1"
              >
                <template v-if="file.suffix.toLowerCase() === 'pdf'">
                  <iframe style="width: 100%; height: 100%" frameborder="0" :src="getPath(file)" />
                </template>

                <template v-else-if="['xlsx', 'xls'].includes(file.suffix.toLowerCase())">
                  <div class="fileBox">
                    <a
                      :href="getPath(file)"
                      v-bind="file.suffix.toLowerCase() != 'pdf' ? { download: file.name } : {}"
                      target="_blank"
                    >
                      <img class="img" src="@/assets/img/excel.png" />
                    </a>
                    <p>{{ file.name }}</p>
                  </div>
                </template>

                <template v-else>
                  <el-image
                    style="max-width: 100%; max-height: 100%"
                    fit="contain"
                    :src="getPath(file)"
                  />
                </template>
              </el-tab-pane>
            </el-tabs>
          </div>
        </template>
        <template v-else>
          <div
            class="flex-content-center"
            style="flex: 1; border: 1px solid var(--el-border-color)"
          >
            <el-empty style="height: 360px" :image-size="120" description="未上传相关证明文件" />
          </div>
        </template>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { defineExpose, ref, watch, computed } from 'vue';
import { commitScoreApi, editDetailApi, saveScoreApi } from '@/views/selection/my-rating/api.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getPath } from '@/utils/index.js';
//import { baseUrl } from '@/utils/index.js';
const { VITE_UPLOAD_FILEURL: baseUrl } = import.meta.env;
const cache = {};
const tableRef = ref();
const visible = ref(false);
const loading = ref(false);
const saving = ref(false);
const title = ref('');
const items = ref([]);
const auditPointInfo = ref({});
const commitPointInfo = ref({});
const current = ref({});
const currentIndex = ref(0);
const selectedRow = ref({});
const activeFileIndex = ref(1);
const subtotal = computed(() => {
  const subtotal =
    current.value.children?.map((item) => item.proficientScore).reduce((a, b) => a + b) || 0;
  return parseFloat(subtotal.toFixed(2));
});

const fileTypes = ['xlsx', 'xls'];

function onRowClick(row) {
  console.log(row);
  selectedRow.value = row;
}

async function onChange(value) {
  await onDone(false, true);
  let index = currentIndex.value + value;
  index = Math.max(index, 0);
  index = Math.min(index, items.value.length - 1);
  currentIndex.value = index;
  current.value = items.value[index];
}
// 四舍五入，不补零
function limitValue(val, row) {
  let digit = val.toString().split('.')[1]?.length;
  let floatCount = digit === 1 ? 1 : 2;
  row.proficientScore = val % 1 === 0 ? val : Number(val.toFixed(floatCount));
}

async function onDone(isSubmit = false, quiet = false) {
  const data = {
    id: cache.row.id,
    declareId: cache.row.declareId,
    scoreSummaryId: cache.row.scoreSummaryId,
    projectId: current.value.id,
    details: current.value.children.map((item) => ({
      projectSubId: item.id,
      proficientScore: item.proficientScore,
      proficientOpinion: item.proficientOpinion
    }))
  };
  try {
    saving.value = true;
    const res = await saveScoreApi(data);
    !quiet &&
      ElMessage({
        type: res.success ? 'success' : 'error',
        message: res.msg || (res.success ? '保存成功' : '保存失败')
      });
  } finally {
    saving.value = false;
  }
  if (isSubmit) {
    try {
      await ElMessageBox.confirm('专家评分提交后不可再修改，确认提交吗？', '提示', {
        type: 'warning',
        cancelButtonText: '不，我再想想'
      });
      const res = await commitScoreApi(data);
      if (!res.success) {
        return ElMessage({ type: 'error', message: res.msg || '提交失败' });
      }
      ElMessage({ type: 'success', message: res.msg || '提交成功' });
      visible.value = false;
    } catch (e) {}
  }
}

watch(current, () => {
  selectedRow.value = current.value.children[0] || {};
  tableRef.value.setCurrentRow(selectedRow.value);
});

watch(selectedRow, () => {
  activeFileIndex.value = 1;
  //* mock start
  /*if (!selectedRow.value.files.length) {
    const length = Math.round(Math.random() * 4);
    selectedRow.value.files = new Array(length).fill('').map((file, index) => {
      const isPdf = !Math.round(Math.random());
      return {
        id: '4fcb9eff-7fa4-48e1-bb42-70e82b9e9d68',
        name: `100${index}.${isPdf ? 'pdf' : 'png'}`,
        suffix: isPdf ? 'pdf' : 'png',
        url: isPdf
          ? 'uploads/Temp/2022-09-01/javascript高级程序设计.pdf?_=' + Date.now()
          : 'uploads/Temp/2022-09-01/007.png?_=' + Date.now()
      };
    });
  }*/
  // mock end
});

defineExpose({
  async open(row) {
    cache.row = row;
    currentIndex.value = 0;
    title.value = `“${row.session}”评分`;
    visible.value = true;
    try {
      loading.value = true;
      const { data } = await editDetailApi({
        id: row.id,
        declareId: row.declareId,
        scoreSummaryId: row.scoreSummaryId
      });
      items.value = data.details;
      auditPointInfo.value = data.enterpriseInfo?.auditPointInfo;
      commitPointInfo.value = data.enterpriseInfo?.commitPointInfo;
      if (data.details.length) {
        current.value = data.details[0];
      }
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped lang="less">
.view-modal {
  h2 {
    line-height: 32px;
    text-align: center;
    margin-bottom: 10px;
    background-color: #e8f1ff;
  }

  .rate-detail {
    margin-bottom: 10px;

    .rate-detail-header {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .el-tabs {
    height: 100%;
  }
}

:deep(.el-tabs__header) {
  display: none;
}

:deep(.el-tabs__content),
:deep(.el-tab-pane) {
  height: 100%;
}

.flex-content-center,
:deep(.el-tab-pane) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-table__row) {
  cursor: pointer;

  &.current-row {
    @color: #409eff;
    color: @color;
  }
}

.detail {
  color: #fff;
  display: flex;
  justify-content: center;
  line-height: 30px;
  height: 30px;
  p {
    margin: 0 15px;
    font-size: 12px;
  }
}

.fileBox {
  height: 150px;
  width: 100%;
  text-align: center;
  margin: 0 10px 30px 0;
  a,
  img {
    height: 100px;
    width: 100px;
  }
}
</style>
