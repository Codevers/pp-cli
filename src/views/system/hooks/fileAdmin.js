export default function usePageHooks() {

  const tableColumn = [
    {
      prop: 'index',
      width: '60px',
      label: '序号'
    },
    {
      prop: 'groupName',
      label: '分组'
    },
    {
      prop: 'fileName',
      label: '附件名称'
    },
    {
      prop: 'suffix',
      label: '格式'
    },
    {
      prop: 'maxSize',
      label: '最大(K)'
    },
    {
      prop: 'maxNum',
      label: '最大数量'
    },
    {
      prop: 'isMust',
      label: '是否必传'
    },
    {
      prop: 'remarks',
      label: '说明'
    },
    {
      label: "操作",
      width: 200,
      fixed: "right",
      slotName: "operations",
    },
  ];

  return {
    tableColumn
  }
}