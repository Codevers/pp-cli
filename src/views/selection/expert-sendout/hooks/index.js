import { ref, watch } from 'vue'
export default function usePageHooks(declareType) {
  let tableColumn = ref([
    {
      prop: 'index',
      width: '60px',
      label: '序号'
    },
    {
      type: 'selection',
      width: '60px',
      label: ''
    },
    {
      prop: 'regionName',
      width: 100,
      label: '所在市',
    },
    {
      prop: 'selectionObj',
      label: '认定对象',
      align: 'left',
      'min-width': declareType.value == 1 ? 200 : 100,
    },
    {
      prop: 'commiter',
      width: 170,
      label: '提交人',
    },
    {
      prop: 'phone',
      width: 120,
      label: '提交人手机号'
    },
    {
      prop: 'isSend',
      width: 100,
      label: '已发待办',
      slotName: 'isSend'
    },
    {
      prop: 'date',
      width: 120,
      label: '待办发送日期'
    },
    {
      prop: 'expert',
      label: '评分专家',
      align: 'left',
      'min-width': 120,
      slotName: 'expert'
    },
    {
      label: '操作',
      width: 140,
      fixed: 'right',
      slotName: 'operations'
    }
  ])
  watch(declareType, () => {
    tableColumn.value.find(i => i.prop == 'selectionObj')['min-width'] = declareType.value == 1 ? 200 : 100
  })
  return {
    tableColumn
  }
}