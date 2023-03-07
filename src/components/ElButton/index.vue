<template>
  <el-button :type="buttonType" :plain="buttonPlain" :icon="buttonIcon">
    <template v-for="(slot, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </el-button>
</template>

<script setup>
import { useSlots } from 'vue';
import {
  Delete,
  Edit,
  Search,
  Upload,
  Sort,
  CircleCheck,
  CircleClose,
  EditPen,
  Warning,
  Plus,
  CirclePlus
} from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';
let buttonIcon = null;
let buttonType = null;
let buttonPlain = false;
const slots = useSlots().default && useSlots().default();
const mapIcon = [
  {
    title: ['查询', '搜索'],
    iconKey: Search
  },
  {
    title: ['重置'],
    iconKey: Sort,
    plain: true,
    type: ''
  },
  {
    title: ['导出'],
    iconKey: Upload,
    plain: true,
    type: 'primary'
  },
  {
    title: ['确认', '保存'],
    iconKey: CircleCheck
  },
  {
    title: ['取消', '暂不', '我再', '关闭'],
    iconKey: CircleClose
  },
  {
    title: ['编辑'],
    iconKey: EditPen
  },
  {
    title: ['创建', '新增'],
    iconKey: CirclePlus
  },
  {
    title: ['添加'],
    iconKey: Plus
  },
  // {
  //   title: ['禁用'],
  //   iconKey: Warning
  // },
  {
    title: ['删除'],
    iconKey: Delete
  }
];
const slotsContent = slots?.length ? slots.find((i) => typeof i.children === 'string') : {};
const getSlotDefault = slotsContent?.children || '';
const filterContent = getSlotDefault.replace(/(^\s*)|(\s*$)/g, '');
// 图标映射
const iconObj = mapIcon.find((i) => i.title.includes(filterContent));
buttonIcon = iconObj?.iconKey;
buttonType = iconObj?.type;
buttonPlain = iconObj?.plain;
</script>
