/*
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-30 11:10:58
 * @LastEditTime: 2022-08-15 16:49:29
 */
export default function useTableColumn() {

  const tableColumn = [
    {
      prop: 'index',
      width: '80px',
      label: '序号',
      fixed: "left"
    },
    {
      prop: 'accountId',
      width: '130px',
      label: '操作账号',
      fixed: "left"
    },
    {
      prop: 'ip',
      label: 'IP地址',
      width: 130,
    },
    {
      prop: 'rquestApi',
      label: '请求地址'
    },

    {
      prop: 'consumeTime',
      label: '耗时（ms）',
      width: 120,
    },
    {
      prop: 'rquestParams',
      label: '请求参数'
    },
    {
      prop: 'method',
      label: '请求方法',
      width: 100,
    },
    {
      prop: 'operationTime',
      label: '操作时间'
    },
    // {
    //   label: "操作",
    //   width: 200,
    //   fixed: "right",
    //   slotName: "operations",
    // },
  ];

  return {
    tableColumn
  }
}