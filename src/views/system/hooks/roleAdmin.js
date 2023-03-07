export default function usePageHooks() {

  const tableColumn = [
    {
      prop: 'index',
      width: '60px',
      label: '序号'
    },
    {
      prop: 'roleName',
      label: '角色名称'
    },
    {
      prop: 'userCount',
      label: '角色用户数'
    },
    {
      prop: 'createTime',
      label: '创建时间'
    },
    {
      label: "操作",
      width: 150,
      fixed: "right",
      slotName: "operations",
    },
  ];

  return {
    tableColumn
  }
}