<script setup>
import { ref } from 'vue';
import useRequest from '@/hooks/use-request';
import { getRowspanMethod } from '@/hooks/use-span-methods';
import { GetStandardDetailApi } from '../api';
const visible = ref(false);
const dlTitle = ref('');
const spanMethod = ref(null);

const standardDetail = ref([]);

const { run: getStandardDetail } = useRequest(GetStandardDetailApi, {
  manual: true,
  onSuccess: ({ data }) => {
    let index = 0;
    let arr = [];
    // 铺平格式
    for (let item of data.details) {
      for (let item2 of item.children) {
        item2.description.replace(/\n/g, '<br/>');
        item2.projectName = item.name;
      }
      // 默认将子级提出，合并到一级内
      if (item?.children?.length) {
        arr.push(...item.children);
      } else {
        // 处理无子级的情况
        item.projectName = item.name;
        item.name = ''; //无子级时，不显示
        arr.push(item);
      }
    }
    // 合并序号
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].projectName !== arr[i - 1]?.projectName) {
        index += 1;
      }
      arr[i].index = index;
    }
    console.log('arr', arr);
    standardDetail.value = arr;
    spanMethod.value = getRowspanMethod(standardDetail.value, ['index', 'projectName']);
  }
});
function open(params) {
  const { id, name } = params;
  getStandardDetail({ standardId: id });
  visible.value = true;
  dlTitle.value = name;
}

function headerStyle({ row, columnIndex }) {
  row[1].colSpan = 2;
  row[2].colSpan = 0;
  if (columnIndex === 2) {
    return { display: 'none' };
  }
}

function hasValue(value) {
  return value !== '' || value !== undefined || value !== null ? true : false;
}

function close() {
  visible.value = false;
}

// setup语法糖中，必须使用该方法暴露出去
defineExpose({
  open
});
</script>

<template>
  <el-dialog v-model="visible" :title="dlTitle" :width="1400" center @close="close">
    <el-table
      :data="standardDetail"
      :span-method="spanMethod"
      :header-cell-style="headerStyle"
      border
      center
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="index" label="序号" width="70" align="center" />
      <el-table-column
        prop="projectName"
        label="评分项目"
        width="150"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column prop="name" width="180" label="" show-overflow-tooltip />
      <el-table-column prop="score" label="单项分值（最低~最高）" width="190" align="center">
        <template #default="scope">
          <span v-if="hasValue(scope.row.maxScore) || hasValue(scope.row.minScore)">
            {{ scope.row.minScore }}
            <em class="division">~</em>
            {{ scope.row.maxScore }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="评分说明" />
      <el-table-column prop="memo" label="备注" width="120" show-overflow-tooltip />
      <el-table-column prop="isPublic" label="是否公示" width="90" align="center">
        <template #default="scope">
          <span>{{ scope.row.isPublic ? '是' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allowDeclare" label="内容是否可填" width="100" align="center">
        <template #default="scope">
          <span>{{ scope.row.allowDeclare ? '是' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isAutoScore" label="客观分" width="70" align="center">
        <template #default="scope">
          <span>{{ scope.row.isAutoScore ? '是' : '' }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<style scoped lang="less">
.page-content {
  height: 100%;
  background: #fff;
}
.division {
  margin: 0 3px;
  color: #ccc;
}
:deep(.cell) {
  white-space: break-spaces;
}
</style>
