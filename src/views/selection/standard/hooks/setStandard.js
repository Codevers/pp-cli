export default function usePageHooks() {

  const tableColumn = [
    {
      prop: 'name',
      label: '评分项目',
      align: 'left',
      width: 180,
      slotName: 'name',
      className: 'flex-cell'
      // 'show-overflow-tooltip': true
    },
    {
      prop: 'description',
      label: '评分说明',
      align: 'left',
      slotName: 'scoreExplain',
      'min-width': 250,
      // 'show-overflow-tooltip': true
    },
    {
      prop: 'score',
      label: '单项分值',
      width: 180,
      align: 'center',
      slotName: 'singleScore',
      className: 'flex-cell'
    },
    {
      prop: 'memo',
      label: '备注',
      width: 250,
      slotName: 'remarks',
      'show-overflow-tooltip': true
    },
    {
      prop: 'isPublic',
      label: '是否公示',
      width: 90,
      align: 'center',
      slotName: 'isPublic'
    },
    {
      prop: 'allowDeclare',
      label: '内容是否可填',
      width: 120,
      align: 'center',
      slotName: 'allowDeclare'
    },
    {
      prop: 'isAutoScore',
      label: '客观分',
      width: 90,
      align: 'center',
      slotName: 'isAutoScore'
    },
    {
      label: '操作',
      width: 300,
      fixed: 'right',
      slotName: 'operations'
    }
  ];

  const arraySpanMethod = ({ row, columnIndex }) => {
    if (columnIndex === 0 && row._isFirst) {
      //1表示渲染几次，0表示不渲染，4表示跨几列
      return [1, 4];
    } else if (
      // 控制第一级渲染几列，此处在1、2、3列中不进行渲染（不设置导致跨列错乱）
      (columnIndex === 1 || columnIndex === 2 || columnIndex === 3) &&
      row._isFirst
    ) {
      return [0, 0];
    }
  };


  return {
    tableColumn,
    arraySpanMethod
  }
}