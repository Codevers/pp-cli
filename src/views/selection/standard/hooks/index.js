export default function usePageHooks() {

  const tableColumn = [
    {
      prop: 'index',
      width: 60,
      label: '序号'
    },
    {
      prop: 'name',
      label: '认定标准名称',
      slotName: 'name',
      align: 'left',
    },
    {
      prop: 'standardDescription',
      label: '认定标准说明',
      width: 300,
      'show-overflow-tooltip': true
    },
    {
      prop: 'createTime',
      width: 170,
      label: '创建时间',
    },
    {
      prop: 'creatorName',
      width: 100,
      label: '创建人',
      'show-overflow-tooltip': true
    },
    {
      prop: 'isRefer',
      width: 100,
      label: '是否引用',
      slotName: 'isRefer'
    },
    {
      prop: 'enabled',
      width: 100,
      label: '状态',
      slotName: 'enabled'
    },
    {
      label: '操作',
      width: 320,
      fixed: 'right',
      slotName: 'operations'
    }
  ];

  return {
    tableColumn
  }
}