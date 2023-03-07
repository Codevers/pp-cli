export default function usePageHooks() {

  const tableColumn = [
    {
      prop: 'index',
      width: '60px',
      label: '序号'
    },
    {
      prop: 'name',
      label: '用户名称',
      align: 'left',
      showOverflowTooltip: true
    },
    {
      prop: 'account',
      label: '登录账号',
      align: 'left'
    },
    {
      prop: 'phone',
      label: '手机号',
      width: 120
    },
    {
      prop: 'currentCity',
      label: '组织机构',
      minWidth: 200
    },
    {
      prop: 'userRole',
      label: '用户角色'
    },
    {
      prop: 'userStatus',
      label: '用户状态',
      slotName: "isEnabled",
      width: 90
    },
    {
      prop: 'addDate',
      label: '入库时间',
      width: 160
    },
    {
      label: "操作",
      width: 220,
      fixed: "right",
      slotName: "operations",
    },
  ];

  return {
    tableColumn
  }
}