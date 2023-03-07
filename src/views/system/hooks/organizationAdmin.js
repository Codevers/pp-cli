export default function usePageHooks() {

  const tableColumn = [
    {
      type: 'index',
      width: 60,
      label: '序号',
      align: 'center',
      className: 'custom-tree-index'
    },
    {
      prop: 'organizationName',
      label: '组织机构名称',
      align: 'left',
      width: 320,
    },
    {
      prop: 'organizationSimpleName',
      label: '名称'
    },
    {
      prop: 'category',
      label: '分类',
      width: 120,
    },
    {
      prop: 'dataPermission',
      label: '数据权限',
      showOverflowTooltip: true
    },
    {
      prop: 'createTime',
      label: '创建时间'
    },
    {
      prop: 'isEnabled',
      label: '状态',
      width: 80,
      slotName: "isEnabled",
    },
    {
      label: "操作",
      width: 250,
      fixed: "right",
      slotName: "operations",
    },
  ];

  return {
    tableColumn
  }
}