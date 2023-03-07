export default function usePageHooks() {

  const tableColumn = [
    {
      type: 'index',
      width: 60,
      label: '序号'
    },
    {
      prop: 'key',
      width: 120,
      label: '地市'
    },
    {
      prop: 'numOfMember',
      label: '会员数量',
      width: 100,
    },
    {
      label: '会员比%',
      children: [{
        prop: 'memberRate',
        label: '会员数量/总数'
      }]
    },
    {
      prop: 'reportLimit',
      label: '各市上报限额',
      width: 120,
      formatter: (row) => {
        let reportLimit = row.reportLimit != null ? row.reportLimit : '无限制';
        return reportLimit;
      }
    },
    {
      prop: 'numOfReport',
      label: '已上报数量',
      width: 100,
    },
    {
      label: '已上报率%',
      children: [{
        prop: 'reportRate',
        label: '已上报数量/会员数量'
      }]
    },
    {
      prop: 'numOfCityPush',
      label: '市推选数量',
      width: 100,
    },
    {
      label: '市推选率%',
      children: [{
        prop: 'cityPushRate',
        label: '市推选数量/已上报数量'
      }]
    },
    {
      prop: 'numOfSelection',
      label: '评优数量',
      width: 100,
    },
    {
      label: '评优率%',
      children: [{
        prop: 'selectionWithCityPushRate',
        label: '评优数量/市推选数量'
      }, {
        prop: 'selectionWithReportRate',
        label: '评优数量/已上报数量'
      }, {
        prop: 'selectionWithMemberRate',
        label: '评优数量/会员数量'
      },]
    },

  ];

  return {
    tableColumn
  }
}