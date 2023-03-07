/*
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-30 11:10:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-16 15:13:58
 */
import { useUserStore } from '@/store/modules/user'
export default function useTableColumn() {

  const tableColumn = [
    {
      prop: 'index',
      width: '60px',
      label: '序号',
      fixed: "left"
    },
    {
      prop: 'name',
      width: '100px',
      label: '姓名',
      fixed: "left"
    },
    {
      prop: 'sexValue',
      width: '80px',
      label: '性别'
    },
    {
      prop: 'idCard',
      width: '180px',
      label: '身份证号'
    },
    {
      prop: 'phone',
      width: '150px',
      label: '手机号'
    },
    {
      prop: 'companyTypeValue',
      width: '120px',
      label: '单位类型'
    },
    {
      prop: 'companyName',
      width: '200px',
      label: '所在单位'
    },
    {
      prop: 'majorValue',
      width: '120px',
      label: '专业'
    },
    {
      prop: 'technical',
      width: '180px',
      label: '技术职称'
    },
    {
      prop: 'qualification',
      width: '180px',
      label: '执业资格及注册证号',
    },
    {
      prop: 'educationValue',
      width: '100px',
      label: '学历'
    },
    {
      prop: 'statusValue',
      label: '状态',
      slotName: "statusValue",
    },
    {
      prop: 'warehousingTime',
      width: '180px',
      label: '入库时间'
    },
    {
      label: "操作",
      width: 200,
      fixed: "right",
      slotName: "operations",
    },
  ];


  const column1 = {
    prop: 'regionName',
    width: '120px',
    label: '所在市',
    fixed: "left"
  }
  const column2 = {
    prop: 'organization',
    width: '200px',
    label: '所属机构（协会）',
    fixed: "left"
  }

  const { userInfo: { regionLevel } } = useUserStore() //   regionLevel 1   省  2   市 
  if (regionLevel === 1) {
    tableColumn.splice(1, 0, column1, column2)
  }

  return {
    tableColumn
  }
}