<script setup>
import { onMounted, reactive, ref } from 'vue';
import usePageHooks from './hooks/setStandard';
import { randomID } from '@/utils';
import { router } from '@/router';
import { useRoute } from 'vue-router';
import useRequest from '@/hooks/use-request';
import loadsh from 'loadsh';
import { downloadFileByBlob, strIsEmpty } from '@/utils';
import { ElMessage } from 'element-plus';
import {
  CreateStandardProjectApi,
  DeleteStandardProjectApi,
  ModifyStandardProjectApi,
  ExportStandardProjectApi,
  CreateStandardChildProjectApi,
  DeleteStandarChilddProjectApi,
  ModifyStandardChildProjectApi,
  GetStandardDetailApi
} from './api';
const { tableColumn, arraySpanMethod } = usePageHooks();
const route = useRoute();
const dataSource = ref([]);
const currentFirstId = ref('');
const expandKeys = ref([]);

const FirstRow = () => ({
  name: '',
  standardId: route.query.id,
  _isFirst: true,
  _isEdit: true,
  id: randomID(),
  _isBlank: true
});
const ChildRow = () => ({
  name: '',
  description: '',
  minScore: undefined,
  maxScore: undefined,
  score: undefined,
  allowDeclare: true,
  memo: '',
  id: randomID(),
  _isFirst: true,
  _isEdit: true,
  _isBlank: true,
  children: []
});
const { loading, run: getProjects } = useRequest(
  () => GetStandardDetailApi({ standardId: route.query.id }),
  {
    onSuccess: ({ data }) => {
      console.log('data', data);
      // 定义操作辅助字段
      for (let item of data.details) {
        item._isFirst = true;
        item._isEdit = false;
        for (let item2 of item.children) {
          item2._isFirst = false;
          item2._isEdit = false;
        }
      }
      //累加 children 中的值
      data.details.forEach((item) => {
        item.grossScore = item.children.reduce((pre, cur) => {
          return pre + cur.maxScore;
        }, 0);
      });
      dataSource.value = data.details;
    }
  }
);
const { run: createRow } = useRequest(CreateStandardProjectApi, {
  manual: true,
  msgTxt: ['创建成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && getProjects();
  }
});
const { run: createChildRow } = useRequest(CreateStandardChildProjectApi, {
  manual: true,
  msgTxt: ['创建成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && getProjects();
  }
});
const { run: deleteRow } = useRequest(DeleteStandardProjectApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && getProjects();
  }
});
const { run: deleteChildRow } = useRequest(DeleteStandarChilddProjectApi, {
  manual: true,
  msgTxt: ['删除成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && getProjects();
  }
});
const { run: modifyRow } = useRequest(ModifyStandardProjectApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && getProjects();
  }
});
const { run: modifyChildRow } = useRequest(ModifyStandardChildProjectApi, {
  manual: true,
  msgTxt: ['修改成功'],
  onSuccess: (data, isSuccess) => {
    isSuccess && getProjects();
  }
});
const { run: exportTable } = useRequest(ExportStandardProjectApi, {
  manual: true,
  onSuccess: (data) => {
    downloadFileByBlob(data);
  }
});
// 新增行
function handleAddFirstRow() {
  dataSource.value.push(FirstRow());
}
// 添加子菜单
function handleAddChildRow(row) {
  let childRow = loadsh.cloneDeep(ChildRow());
  console.log('childRow', childRow);
  childRow._isFirst = false;
  row.children.push(childRow);
  currentFirstId.value = row.id;
  expandKeys.value.push(row.id);
}
// 导出
function handleExport() {
  exportTable({
    standardId: route.query.id,
    name: '认定标准明细'
  });
}
// 删除行
function handleDeleteRow(row) {
  if (row._isFirst) {
    deleteRow({
      id: row.id
    });
  } else {
    deleteChildRow({
      id: row.id
    });
  }
}
// 输入效验提示，返回false时则为效验通过
function validateFields(row, isFirst) {
  const { name, description, score, minScore, maxScore } = row;
  console.log('minScore', minScore);
  console.log('maxScore', maxScore);
  const min = Number(minScore);
  const max = Number(maxScore);
  return new Promise((resolve) => {
    if (isFirst) {
      if (strIsEmpty(name)) return ElMessage.error('请输入评分项目名称');
      // return strIsEmpty(name);
      resolve();
    } else {
      if (strIsEmpty(name)) return ElMessage.error('请输入评分项目名称');
      if (strIsEmpty(description)) return ElMessage.error('请输入评分说明');
      if (maxScore === undefined) return ElMessage.error('请输入最高单项分值');
      if (minScore === maxScore) return ElMessage.error('最小分值不可等于最大分值');
      if (min > max) return ElMessage.error('最小分值不可大于最大分值');
      resolve();
    }
  });
}
// 保存行
function handleSaveRow(row) {
  const {
    id,
    _isBlank,
    _isFirst,
    name,
    description,
    minScore,
    maxScore,
    isPublic,
    allowDeclare,
    isAutoScore,
    memo
  } = row;
  // 效验必填项
  validateFields(row, _isFirst).then(() => {
    row._isEdit = false;
    // 新增行执行create api
    if (_isBlank) {
      if (_isFirst) {
        // 第一级
        createRow({
          standardId: route.query.id,
          name
        });
      } else {
        // 第二级
        createChildRow({
          standardId: route.query.id,
          projectId: currentFirstId.value,
          name,
          description,
          minScore,
          maxScore,
          isPublic,
          allowDeclare,
          isAutoScore,
          memo
        });
      }
      // 编辑行执行modify api
    } else {
      if (_isFirst) {
        modifyRow({
          id,
          name
        });
      } else {
        modifyChildRow({
          id,
          name,
          description,
          isPublic,
          allowDeclare,
          isAutoScore,
          minScore,
          maxScore,
          memo
        });
      }
    }
  });
}

function handleEditRow(row) {
  row._bak = { ...row };
  row._isEdit = true;
}

function deleteNode(list, id) {
  let lists = list.filter((i) => i.id !== id);
  return lists.map((node) => {
    if (node.children) {
      node.children = node.children.filter((i) => i.id !== id);
      return { ...node, children: deleteNode(node.children, id) };
    }
    return node;
  });
}
function cancelOperation(row) {
  const bak = row._bak;
  row._bak = null;
  Object.keys(row).forEach((key) => (row[key] = bak?.[key] ?? row[key]));
  row._isEdit = false;
  if (row._isBlank) {
    dataSource.value = deleteNode(dataSource.value, row.id);
  }
}
// 一键展开折叠
const expand = ref(true);
function spread() {
  expandKeys.value = [];
  // expand.value = !expand.value;
}
</script>

<template>
  <el-container class="main-content">
    <el-main class="main-table-content">
      <div class="operation-buttons-between">
        <el-button @click="router.go(-1)">返回</el-button>
        <h4 class="main-title">{{ route.query.title }}</h4>
        <div>
          <el-button type="primary" @click="handleAddFirstRow()">添加评分项目</el-button>
          <el-button type="primary" @click="handleExport()">导出</el-button>
        </div>
      </div>
      <div style="margin-bottom: 10px">
        <el-radio-group v-model="expand" @change="spread">
          <el-radio-button :label="false">一键折叠</el-radio-button>
          <el-radio-button :label="true">一键展开</el-radio-button>
        </el-radio-group>
      </div>

      <el-table-next
        :column="tableColumn"
        :data="dataSource"
        border
        row-key="id"
        :span-method="arraySpanMethod"
        class="standard-layout main-table"
        v-loading="loading"
        :default-expand-all="expand"
        :expand-row-keys="expandKeys"
      >
        <!-- 评分项目 -->
        <template #name="{ row, column }">
          <el-input
            v-if="row._isEdit"
            maxlength="20"
            show-word-limit
            clearable
            v-model="row[column.property]"
          ></el-input>
          <span v-else>
            {{ row[column.property] }} {{ row.grossScore ? '（' + row.grossScore + '分）' : '' }}
          </span>
          <!-- <span class="editMode">{{ row[column.property] }}</span> -->
        </template>
        <!-- 评分说明 -->
        <template #scoreExplain="{ row, column }">
          <el-input
            v-if="row._isEdit"
            maxlength="500"
            show-word-limit
            clearable
            type="textarea"
            v-model.wrap="row[column.property]"
          ></el-input>
          <span v-else>{{ row[column.property] }}</span>
        </template>
        <!-- 单项分值 -->
        <template #singleScore="{ row }">
          <template v-if="row._isEdit">
            <el-input-number
              v-model="row.minScore"
              :precision="2"
              placeholder="最低"
              :controls="false"
            />
            <em class="division">~</em>
            <el-input-number
              v-model="row.maxScore"
              :precision="2"
              placeholder="最高"
              :controls="false"
            />
            <span style="margin-left: 4px">分</span>
          </template>
          <span style="text-align: center; width: 100%" v-else>
            {{ row.minScore }}
            <em class="division">~</em>
            {{ row.maxScore }}
            <span>分</span>
          </span>
        </template>
        <!-- 是否公示 -->
        <template #isPublic="{ row, column }">
          <el-switch
            v-model="row.isPublic"
            inline-prompt
            active-text="是"
            inactive-text="否"
            @change="!row._isBlank && handleSaveRow(row)"
            v-if="!row._isFirst"
          />
        </template>
        <!-- 内容是否可填 -->
        <template #allowDeclare="{ row, column }">
          <el-switch
            v-model="row.allowDeclare"
            inline-prompt
            active-text="是"
            inactive-text="否"
            @change="!row._isBlank && handleSaveRow(row)"
            v-if="!row._isFirst"
          />
        </template>
        <!-- 是否自动打分 -->
        <template #isAutoScore="{ row, column }">
          <el-switch
            v-model="row.isAutoScore"
            inline-prompt
            active-text="是"
            inactive-text="否"
            @change="!row._isBlank && handleSaveRow(row)"
            v-if="!row._isFirst"
          />
        </template>
        <!-- 备注 -->
        <template #remarks="{ row, column }">
          <el-input
            v-if="row._isEdit"
            maxlength="50"
            show-word-limit
            clearable
            v-model="row[column.property]"
          ></el-input>
          <span v-else>{{ row[column.property] }}</span>
        </template>
        <!-- 操作 -->
        <template #operations="{ row }">
          <template v-if="row?._isFirst && !row?._isEdit">
            <el-button type="primary" plain size="small" @click="handleAddChildRow(row)">
              添加子评分项
            </el-button>
          </template>
          <template v-if="row._isEdit">
            <el-button type="primary" plain size="small" @click="handleSaveRow(row)">
              保存
            </el-button>
            <el-button size="small" @click="cancelOperation(row)">取消</el-button>
          </template>
          <template v-else>
            <el-button type="primary" plain size="small" @click="handleEditRow(row)">
              编辑
            </el-button>
            <el-popconfirm title="确定删除该行吗？" @confirm="handleDeleteRow(row)" width="">
              <template #reference>
                <el-button type="danger" plain size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </template>
      </el-table-next>
    </el-main>
  </el-container>
</template>
<style scoped lang="less">
.operation-buttons-between {
  padding-bottom: 15px;
  .abs-between;
}
:deep(.flex-cell) {
  .cell {
    display: flex;
    align-items: center;
    white-space: break-spaces;
  }
}
.main-title {
  font-size: 18px;
  font-weight: bold;
}
.division {
  margin: 0 3px;
  color: #ccc;
}
</style>
<style lang="less">
.editMode {
  // user-modify: read-write-plaintext-only;
  -webkit-user-modify: read-write-plaintext-only;
  -moz-user-modify: read-write-plaintext-only;
  user-modify: read-write-plaintext-only;
}
</style>
