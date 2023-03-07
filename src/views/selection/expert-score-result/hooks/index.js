export default function usePageHooks(regionLevel) {

  const tableColumn = [
    {
      prop: 'index',
      width: 60,
      label: '序号'
    },
    {
      prop: 'selectionObj',
      label: '认定对象',
      align: 'left',
      'show-overflow-tooltip': true
    },
    {
      prop: 'proficientName',
      label: '专家组',
      width: 80,
      slotName: 'expert',
      align: 'center',
    },
    {
      prop: 'scoreSum',
      label: "合计",
      width: 70,
      fixed: "right",
      slotName: 'scoreSum',
    },
    {
      label: "操作",
      width: 110,
      fixed: "right",
      slotName: "operations",
    },
  ];
  const obj = {
    prop: 'city',
    width: 80,
    label: '所在市',
  }
  if (regionLevel == 1) {
    tableColumn.splice(1, 0, obj)
  }

  return {
    tableColumn
  }
}