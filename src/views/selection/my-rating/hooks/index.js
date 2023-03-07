export default function usePageHooks() {
  const tableColumn = [
    {
      type: 'selection',
      width: 50,
      fixed: true,
      selectable: (row) => !row.scoreSubmitTime && row.operatePermission !== false
    },
    { label: '序号', prop: 'index', width: 60, fixed: true },
    { label: '认定对象', prop: 'session', width: 240, align: 'left' },
    { label: '待办发送日期', prop: 'sendDate', width: 140 },
    { label: '评分项', prop: 'scoringItems', align: 'left' },
    { label: '我的评分结果', prop: 'scores', align: 'left' },
    { label: '评分提交日期', prop: 'scoreSubmitTime', width: 140 },
    { label: '操作', width: 160, fixed: 'right', slotName: 'operations' }
  ];

  return {
    tableColumn
  };
}
