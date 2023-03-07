export default function usePageHooks() {

  const tableColumn = [
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
      width: 110,
      label: '所在市'
    },
    {
      prop: 'selectionObj',
      label: '认定对象',
      width: 300
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
      prop: 'isDistribution',
      width: 100,
      label: '已分配',
      slotName: 'isDistribution'
    },
    {
      prop: 'date',
      width: 100,
      label: '分配日期'
    },
    {
      prop: 'expert',
      label: '评分专家',
      slotName: 'expert',
      align: 'left'
    },
    {
      label: '操作',
      width: 140,
      fixed: 'right',
      slotName: 'operations'
    }
  ];

  return {
    tableColumn
  }
}