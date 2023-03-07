<template>
  <el-container>
    <el-main>
      <el-row :gutter="4" style="margin-bottom: -6px">
        <el-col :span="3" v-for="item in systemIcons">
          <div
            class="item"
            @click="handleSelected(item.name)"
            :class="props.currentName === item.name ? 'selected' : ''"
          >
            <SvgIcon :name="item.name" size="18px"></SvgIcon>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
const systemIcons = ref([]);
const emit = defineEmits(['selectIcon']);
const svgIcons = import.meta.glob('/src/assets/svg/aside/**/*.svg');
const keys = Object.keys(svgIcons);
keys.forEach((i) => {
  const routePath = i.replace('/src/assets/svg/', '').replace('/', '-').replace('.svg', '');
  systemIcons.value.push({
    name: routePath
  });
});
const props = defineProps({
  currentName: {
    type: String
  }
});

function handleSelected(name) {
  emit('selectIcon', name);
}
</script>
<style lang="less" scoped>
:deep(.el-main) {
  --el-main-padding: 4px;
}
.item {
  .abs-center;
  width: 40px;
  height: 40px;
  transition: 0.2s;
  border: 1px solid #e5e7eb;
  margin-bottom: 6px;
  cursor: pointer;
  &:hover,
  &.selected {
    border-color: #3b6dff;
  }
}
</style>
