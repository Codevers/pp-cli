export default function usePageHooks() {

  const tableColumn = [
    {
      type: 'index',
      width: '60',
      label: '序号',
      align: 'center',
      className: 'custom-tree-index'
    },
    {
      prop: 'menuName',
      label: '菜单名称',
      align: 'left',
    },
    {
      prop: 'path',
      label: '路由地址'
    },
    {
      prop: 'component',
      label: '组件地址'
    },
    {
      prop: 'icon',
      label: '图标',
      slotName: "icon",
    },
    {
      prop: 'sortIndex',
      label: '顺序号',
      width: 80,
    },
    {
      prop: 'status',
      label: '状态',
      width: 80,
      slotName: "isEnabled",
    },
    {
      prop: 'remarks',
      label: '说明',
      width: 100
    },
    {
      label: "操作",
      width: 270,
      align: 'right',
      fixed: "right",
      slotName: "operations",
    },
  ];

  return {
    tableColumn
  }
}