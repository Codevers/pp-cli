<script setup>
import { ref, reactive, computed, watch, defineEmits } from 'vue';
import useRequest from '@/hooks/use-request';
import { getRowspanMethod } from '@/hooks/use-span-methods';
import { appStoreWithOut } from '@/store/modules/app';
import { numToNumRange } from '@/utils';
import { useThrottleFn } from 'v3hooks';
import {
  GetExpertTotalApi,
  DistributeExpertApi,
  GetUnassignedTaskApi,
  GetAppointGroupListApi,
  GetScoreItemApi,
  GetScoreRuleApi
} from '../api';
import {
  expertScoreOptions,
  expertMajorOptions,
  expertAvoidOptions,
  scoreRuleOptions,
  groupOptions
} from './dictionary';
import {
  tableColumn1,
  tableColumn2,
  tableColumn3,
  tableColumn4,
  datasource1,
  datasource2,
  datasource3,
  datasource4
} from './table-column';
const emits = defineEmits(['reload']);
const visible = ref(false);
const visible2 = ref(false);
const formRef1 = ref(null);
const formRef2 = ref(null);
const formRef3 = ref(null);
const previewList = ref([]);
const propsParams = reactive({});
const appointGroupOptions = ref([]);
const scoreSelectedIds = ref([]);

watch(visible, (newVal) => {
  if (!newVal) {
    formRef1.value?.resetFields();
    formRef2.value?.resetFields();
    formRef3.value?.resetFields();
    appointGroupOptions.value = [];
    createForm.model.groupNum = undefined;
    createForm.model.randomGroupNum = 1;
    createForm.model.groupWay = 1;
  }
});

useRequest(GetExpertTotalApi, {
  onSuccess: ({ data }) => {
    datasource1[0].expertNum = data.expertTotal;
    datasource1[1].expertNum = data.unassignedExpert;
  }
});
// 待分配任务数
const { run: getUnassignedTask, data: unassignedTask } = useRequest(GetUnassignedTaskApi, {
  manual: true,
  deepData: true
});
// 指定分组数
const { run: getAppointGroupList, data: appointGroupList } = useRequest(GetAppointGroupListApi, {
  manual: true,
  deepData: true
});

const randomGroupList = computed(() => {
  const item = appointGroupList.value?.slice(-1);
  const itemToNum = Number(item);
  return itemToNum > 0 ? numToNumRange(1, itemToNum + 1) : [];
});

// 评分项目
const { run: getScoreItem, data: scoreItem } = useRequest(GetScoreItemApi, {
  manual: true,
  deepData: true
});
// 完成分配
const { run: distributeExpert } = useRequest(DistributeExpertApi, {
  manual: true,
  msgTxt: ['专家分配成功！'],
  onSuccess(data, isSuccess) {
    if (isSuccess) {
      visible2.value = false;
      visible.value = false;
      emits('reload');
    }
  }
});
// 根据选中的项目，来动态显示任务数
const unassignedTaskCount = computed(() => {
  return propsParams.selectionList.length === 0 ? unassignedTask : propsParams.selectionList.length;
});
const validGroupOptions = (rule, value, callback) => {
  let isOk = appointGroupOptions.value.every((i) => i.selected.length > 0);
  if (!isOk) return callback(new Error('请将评分项配置完成'));
  callback();
};
const createForm = reactive({
  model: {
    groupWay: 1,
    groupNum: undefined,
    randomGroupNum: 1,
    expertScope: '',
    expertMajorSelect: '',
    expertMajor: [],
    expertAvoid: [0],
    groupCount: 1,
    scoringRules: '',
    singleDifferential: undefined,
    totalDifferential: undefined
  },
  rules: {
    groupNum: [
      { required: true, message: '请指定分组数', trigger: 'change' },
      {
        validator: validGroupOptions
      }
    ],
    randomGroupNum: [{ required: true, message: '请选择随机分组', trigger: 'change' }],
    expertScope: [{ required: true, message: '请选择专家范围', trigger: 'change' }],
    expertMajorSelect: [{ required: true, message: '请选择专家专业', trigger: 'change' }],
    expertMajor: [{ required: true, message: '请选择专家专业', trigger: 'change' }],
    expertAvoid: [{ required: true, message: '请选择专家回避机制', trigger: 'change' }],
    groupCount: [{ required: true, message: '请输入每组打分专家人次', trigger: 'change' }],
    scoringRules: [{ required: true, message: '请选择计分规则', trigger: 'change' }]
  }
});

// 获取计分规则
const { run: getScoreRuleList, data: scoreRuleList } = useRequest(
  () =>
    GetScoreRuleApi({
      groupCount:
        createForm.model.groupWay === 1
          ? createForm.model.randomGroupNum
          : createForm.model.groupNum,
      groupMemberCount: createForm.model.groupCount
    }),
  {
    deepData: true
  }
);
// 监听属性变化拉取计分规则
watch(
  () => [
    createForm.model.groupWay,
    createForm.model.randomGroupNum,
    createForm.model.groupCount,
    createForm.model.groupNum
  ],
  () => {
    console.log('触发');
    getScoreRuleList();
  }
);

const spanMethod = getRowspanMethod(datasource1, ['info', 'score', 'expert']);

const spanMethod2 = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex === 1 && columnIndex === 0) {
    return [1, 2];
  } else if (rowIndex === 1 && columnIndex === 1) {
    return [0, 0];
  }
};

function open({ activityId, selectionList, declareType }) {
  visible.value = true;
  propsParams.activityId = activityId;
  propsParams.selectionList = selectionList;
  propsParams.declareType = declareType;
  getUnassignedTask({ activityId: activityId });
  getAppointGroupList({ id: activityId });
  getScoreItem({ id: activityId });
}
const headerStyle1 = ({ row, columnIndex }) => {
  row[0].colSpan = 6;
  if (columnIndex >= 1) {
    return { display: 'none' };
  }
};
const headerStyle2 = ({ row, columnIndex }) => {
  row[0].colSpan = 2;
  if (columnIndex >= 1) {
    return { display: 'none' };
  }
};
// 生成预览数据
function createPreviewItems() {
  const {
    groupWay,
    randomGroupNum,
    groupNum,
    expertScope,
    expertAvoid,
    expertMajor,
    expertMajorSelect,
    groupCount,
    scoringRules,
    singleDifferential,
    totalDifferential
  } = createForm.model;

  const expertAvoidOptionsValue = expertAvoidOptions
    .filter((i) => expertAvoid.includes(i.value))
    ?.map((i) => i.key);

  const expertMajorDetail = appStoreWithOut
    .getGlobalDict(2)
    .filter((item) => expertMajor.indexOf(item.key) > -1)
    .map((item) => item.value)
    .join('，');
  let list = [
    {
      label: `分配${propsParams.declareType === 1 ? '企业' : '个人'}认定任务数`,
      value: unassignedTaskCount.value
    },
    {
      label: '认定内容分组方式',
      value: groupOptions.find((i) => i.value === groupWay)?.key
    },
    {
      label: '分组组数',
      value: groupWay === 1 ? `${randomGroupNum}组` : `${groupNum}组`
    },
    {
      label: '认定专家范围',
      value: expertScoreOptions.find((i) => i.value === expertScope)?.key
    },
    {
      label: '认定专家专业',
      value: [
        expertMajorOptions.find((i) => i.value === expertMajorSelect)?.key,
        expertMajorSelect > 0 ? `（${expertMajorDetail}）` : ''
      ].join('')
    },
    {
      label: '专家回避机制',
      value: String(expertAvoidOptionsValue)
    },
    {
      label: '每组评分专家人次',
      value: `${groupCount}人/组`
    },
    {
      label: '计分规则',
      value: scoreRuleList.value.find((i) => i.key === scoringRules)?.value
    },
    {
      label: '单项预警分差',
      value:
        singleDifferential !== undefined && singleDifferential !== null
          ? `${singleDifferential}分`
          : ''
    },
    {
      label: '总分预警分差',
      value:
        totalDifferential !== undefined && totalDifferential !== null
          ? `${totalDifferential}分`
          : ''
    }
  ];
  // 插入所有认定内容
  if (groupWay === 1) {
    list.splice(3, 0, { label: '认定内容', scoreItem: scoreItem.value });
  }
  // 插入指定分组选中的认定内容
  else if (groupWay === 2) {
    list.splice(3, 0, ...appointGroupOptions.value);
  }
  previewList.value = list;
}
// 生成提交数据
function createDistributionParams() {
  const ids = propsParams.selectionList.map((i) => i.declareId);
  const activityId = propsParams.activityId;
  const isAll = propsParams.selectionList.length ? false : true;
  let specifyGroupList = [];
  for (let item of appointGroupOptions.value) {
    specifyGroupList.push(item.selected);
  }
  return {
    ...createForm.model,
    specifyGroupList,
    activityId,
    ids,
    isAll
  };
}
// 选中认定项
function handleAppointGroup() {
  formRef1?.value?.validateField('groupNum');
  scoreSelectedIds.value = appointGroupOptions.value.map((i) => i.selected).flat(2);
}
// 单项预警可编辑控制
const groupCountRequired = computed(() => {
  const val = createForm.model.groupCount;
  const result = val !== 1 && val !== undefined && val !== null && val !== 0;
  return result ? true : false;
});
// 总分预警必填控制
const totalDifferentialRequired = computed(() => {
  return createForm.model.randomGroupNum === 1;
});
// 单项预警分差可输入控制
const singleScoreControl = computed(() => {
  const { groupCount } = createForm.model;
  return groupCount < 2 ? true : false;
});
// 总分预警分差可输入控制
const totalScoreControl = computed(() => {
  const { groupWay, randomGroupNum, groupNum, groupCount } = createForm.model;
  const groupNums = groupWay === 1 ? randomGroupNum : groupNum;
  if (groupCount < 2) return true;
  if (groupCount >= 2 && groupNums >= 2) return true;
  return false;
});
// 清除选中的认定项
function clearScoreSelected(selected) {
  scoreSelectedIds.value = scoreSelectedIds.value.filter((i) => i !== selected);
  for (let item of appointGroupOptions.value) {
    item.selected = item.selected.filter((i) => i !== selected);
  }
  formRef1?.value?.validateField('groupNum');
}
// 根据分组数，生成认定list
function handleGroupChange(val) {
  appointGroupOptions.value = [];
  scoreSelectedIds.value = [];
  for (let i = 0; i < val; i++) {
    appointGroupOptions.value.push({
      label: `第${i + 1}组`,
      selected: []
    });
  }
}
// 提交分配（节流）
const { run: throttleSubmit } = useThrottleFn(() => {
  distributeExpert(createDistributionParams());
}, 500);

// 效验并提交
function validateToPreview(flag) {
  formRef3.value?.clearValidate();
  formRef1.value.validate((valid1) => {
    formRef2.value.validate((valid2) => {
      formRef3.value.validate((valid3) => {
        if (valid1 && valid2 && valid3) {
          createPreviewItems();
          visible2.value = true;
        }
      });
    });
  });
}

// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});
</script>

<template>
  <el-dialog v-model="visible" title="随机分配专家" :width="1200" center @close="visible = false">
    <!-- 待分配信息 -->
    <el-table-next
      :column="tableColumn1"
      :header-cell-style="headerStyle1"
      :span-method="spanMethod"
      :data="datasource1"
      style="margin-bottom: 30px"
      border
      row-key="id"
    >
      <template #score="{ row }">
        <el-tag>{{ unassignedTaskCount }}</el-tag>
      </template>
      <template #expertNum="{ row }">
        <el-tag type="warning">{{ row.expertNum }}</el-tag>
      </template>
    </el-table-next>
    <!-- 认定内容分组方式设置 -->
    <el-table-next
      :column="tableColumn2"
      :header-cell-style="headerStyle2"
      :data="datasource2"
      :span-method="spanMethod2"
      style="margin-bottom: 30px"
      border
      row-key="id"
    >
      <template #group="{ row }">
        <el-radio-group v-model="createForm.model.groupWay">
          <el-radio :label="item.value" v-for="item in groupOptions">
            {{ item.key }}
          </el-radio>
        </el-radio-group>
      </template>
      <template #groupWay="{ row, $index }">
        <div style="padding: 15px 0; text-align: left" v-if="$index === 1">
          <el-form
            :model="createForm.model"
            ref="formRef1"
            label-width="150px"
            label-position="right"
            :rules="createForm.rules"
            status-icon
          >
            <el-form-item
              label="随机分组"
              prop="randomGroupNum"
              v-if="createForm.model.groupWay === 1"
            >
              <el-select v-model="createForm.model.randomGroupNum">
                <el-option v-for="item in randomGroupList" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <template v-if="createForm.model.groupWay === 2">
              <el-form-item label="指定分组数" prop="groupNum">
                <el-select v-model="createForm.model.groupNum" @change="handleGroupChange">
                  <el-option v-for="item in appointGroupList" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <template v-for="item in appointGroupOptions">
                <el-form-item label="">
                  <el-select
                    v-model="item.selected"
                    placeholder="请指定评分项"
                    style="width: 215px; margin-right: 8px"
                    @change="handleAppointGroup"
                    multiple
                    :clearable="false"
                    collapse-tags
                    collapse-tags-tooltip
                  >
                    <el-option
                      v-for="item in scoreItem"
                      :key="item.id"
                      :label="item.projectName"
                      :value="item.id"
                      :disabled="scoreSelectedIds.includes(item.id)"
                    />
                  </el-select>
                  <div class="tags">
                    <el-tag
                      effect="light"
                      closable
                      @close="clearScoreSelected(item)"
                      v-for="item in item.selected"
                    >
                      {{ scoreItem.find((i) => i.id === item)?.projectName }}
                    </el-tag>
                  </div>
                </el-form-item>
              </template>
            </template>
          </el-form>
        </div>
      </template>
    </el-table-next>
    <el-row :gutter="20">
      <el-col :span="14">
        <!-- 认定专家设置 -->
        <el-table-next :column="tableColumn3" :data="datasource3" border row-key="id">
          <template #operations="{ row }">
            <div style="padding: 15px 0; min-height: 265px">
              <el-form
                :model="createForm.model"
                ref="formRef2"
                label-width="150px"
                label-position="right"
                :rules="createForm.rules"
                status-icon
                @submit.native.prevent
              >
                <el-form-item label="专家范围" prop="expertScope">
                  <el-radio-group v-model="createForm.model.expertScope">
                    <el-radio :label="item.value" v-for="item in expertScoreOptions">
                      {{ item.key }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="专家专业" prop="expertMajorSelect">
                  <el-radio-group v-model="createForm.model.expertMajorSelect">
                    <el-radio :label="item.value" v-for="item in expertMajorOptions">
                      {{ item.key }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label=""
                  prop="expertMajor"
                  v-if="createForm.model.expertMajorSelect === 1"
                >
                  <el-select style="width: 100%" v-model="createForm.model.expertMajor" multiple>
                    <el-option
                      v-for="item in appStoreWithOut.getGlobalDict(2)"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="专家回避机制" prop="expertAvoid">
                  <el-checkbox-group v-model="createForm.model.expertAvoid">
                    <el-checkbox
                      :label="item.value"
                      v-for="item in expertAvoidOptions"
                      :disabled="item.value === 0"
                    >
                      {{ item.key }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="每组打分专家人次" prop="groupCount">
                  <div class="middle">
                    <el-input-number
                      v-model="createForm.model.groupCount"
                      placeholder="每组打分专家人次"
                      style="width: 200px"
                      :precision="0"
                      min="1"
                      max="99"
                      :controls="false"
                    />
                    <span>人/组</span>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-next>
      </el-col>
      <el-col :span="10">
        <!-- 计分规则设置 -->
        <el-table-next :column="tableColumn4" :data="datasource4" border row-key="id">
          <template #operations="{ row }">
            <div style="padding: 15px 0; min-height: 265px">
              <el-form
                :model="createForm.model"
                ref="formRef3"
                label-width="130px"
                label-position="right"
                :rules="createForm.rules"
                status-icon
              >
                <el-form-item label="计分规则" prop="scoringRules">
                  <div class="middle">
                    <el-select v-model="createForm.model.scoringRules" style="width: 200px">
                      <el-option
                        v-for="item in scoreRuleList"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key"
                      />
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item
                  label="单项预警分差"
                  prop="singleDifferential"
                  :rules="
                    groupCountRequired && !singleScoreControl
                      ? [{ required: true, message: '请输入单项预警分差', trigger: 'change' }]
                      : []
                  "
                >
                  <div class="middle">
                    <el-input-number
                      v-model="createForm.model.singleDifferential"
                      placeholder="请输入单项预警分差"
                      style="width: 200px"
                      :precision="2"
                      title=""
                      max="99"
                      :disabled="singleScoreControl"
                      :controls="false"
                    />
                    <span>分</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label="总分预警分差"
                  prop="totalDifferential"
                  title=""
                  :rules="
                    totalDifferentialRequired && !totalScoreControl
                      ? [{ required: true, message: '请输入总分预警分差', trigger: 'change' }]
                      : []
                  "
                >
                  <div class="middle">
                    <el-input-number
                      v-model="createForm.model.totalDifferential"
                      placeholder="请输入总分预警分差"
                      style="width: 200px"
                      :precision="2"
                      max="99"
                      :disabled="totalScoreControl"
                      :controls="false"
                    />
                    <span>分</span>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-next>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="validateToPreview()">确认</el-button>
    </template>
  </el-dialog>
  <!-- 预览配置 -->
  <el-dialog v-model="visible2" title="分配预览" :width="700" center @close="close">
    <el-descriptions :column="1" title="您当前选择的随机分配规则如下：" border>
      <el-descriptions-item
        v-for="item in previewList"
        :label="item.label"
        label-align="right"
        class-name="descriptions-content"
        label-class-name="descriptions-label"
      >
        <span v-if="createForm.model.groupWay === 1 && item.scoreItem">
          <el-tag v-for="item2 in item.scoreItem" style="margin: 2px 4px 2px 0">
            {{ item2.projectName }}
          </el-tag>
        </span>
        <span v-else-if="createForm.model.groupWay === 2 && item.selected">
          <el-tag v-for="item2 in item.selected" style="margin: 2px 4px 2px 0">
            {{ scoreItem.find((i) => i.id === item2)?.projectName }}
          </el-tag>
        </span>
        <span v-else>{{ item.value }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <div class="dialog-footer-center">
        <el-button @click="visible2 = false">暂不分配，我再想想</el-button>
        <el-button type="primary" @click="throttleSubmit()">确认，随机分配</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.page-content {
  height: 100%;
  background: #fff;
}
.middle {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
    white-space: nowrap;
  }
}
.tags :deep(.el-tag) {
  margin-right: 8px;
}
:deep(.el-table tbody tr:hover > td) {
  background-color: transparent !important;
}
:deep(.descriptions-label) {
  width: 150px;
}
:deep(.descriptions-content) {
  color: #007ffd !important;
}
</style>
