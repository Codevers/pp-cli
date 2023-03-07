export default function usePageHooks() {

  const tableColumn = [
    {
      prop: 'index',
      width: 60,
      label: '序号'
    },
    {
      prop: 'city',
      width: 80,
      label: '地市'
    },
    {
      prop: 'city',
      label: '会员数量'
    },
    {
      prop: 'city',
      label: '会员比%',
      children: [{
        prop: 'city',
        label: '会员数量/总数'
      }]
    },
    {
      prop: 'city',
      label: '上报数量'
    },
    {
      prop: 'city',
      label: '上报率%',
      children: [{
        prop: 'city',
        label: '上报数量/会员数量'
      }]
    },
    {
      prop: 'city',
      label: '市推选数量'
    },
    {
      prop: 'city',
      label: '市推选率%',
      children: [{
        prop: 'city',
        label: '市推选数量/上报数量'
      }]
    },
    {
      prop: 'city',
      label: '评优数量'
    },
    {
      prop: 'city',
      label: '评优率%',
      children: [{
        prop: 'city',
        label: '评优数量/市推选数量'
      }, {
        prop: 'city',
        label: '评优数量/上报数量'
      }, {
        prop: 'city',
        label: '评优数量/会员数量'
      },]
    },

  ];

  return {
    tableColumn
  }
}