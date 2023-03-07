/*
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-30 11:10:58
 * @LastEditTime: 2022-09-20 10:05:15
 */
import dayjs from 'dayjs'
export default function useTableColumn() {

    const entColumn = [
        {
            type: 'selection',
            width: 55,
            fixed: "left"
        },
        {
            prop: 'index',
            width: 60,
            label: '序号',
            fixed: "left"
        },
        {
            prop: 'city',
            width: 130,
            label: '所在市',
            fixed: "left"
        },
        {
            slotName: 'company',
            label: '认定对象',
            "min-width": 250,
            fixed: "left"
        },
        {
            prop: 'submitter',
            width: 150,
            label: '提交人'
        },
        {
            prop: 'phone',
            width: 130,
            label: '提交人手机号'
        },
        {
            slotName: 'selfGrade',
            width: 130,
            label: '自评分'
        },
        {
            slotName: 'cityGrade',
            width: 130,
            label: '市评分'
        },
        {
            slotName: 'technicalGrade',
            width: 100,
            label: '省专家评分'
        },
        {
            slotName: "provinceGrade",
            width: 180,
            label: '省终评分'
        },
        {
            prop: 'electTime',
            width: 200,
            label: "省推选日期",
            formatter: (row) => {
                return row.electTime ? dayjs(row.electTime).format('YYYY-MM-DD') : row.electTime
            }
        },
        {
            label: "操作",
            width: 200,
            fixed: "right",
            slotName: "operations",
        },
    ];
    const personColumn = [
        {
            type: 'selection',
            width: 55,
            fixed: "left"
        },
        {
            prop: 'index',
            width: 60,
            label: '序号',
            fixed: "left"
        },
        {
            prop: 'city',
            width: 130,
            label: '所在市',
            fixed: "left"
        },
        {
            slotName: 'person',
            width: 120,
            label: '认定对象',
            fixed: "left"
        },
        {
            prop: 'company',
            "min-width": 250,
            label: '认定对象从业单位'
        },
        {
            prop: 'submitter',
            width: 150,
            label: '提交人'
        },
        {
            prop: 'phone',
            width: 130,
            label: '提交人手机号'
        },
        {
            slotName: 'selfGrade',
            width: 130,
            label: '自评分'
        },
        {
            slotName: 'cityGrade',
            width: 130,
            label: '市评分'
        },
        {
            slotName: 'technicalGrade',
            width: 100,
            label: '省专家评分'
        },
        {
            slotName: "provinceGrade",
            width: 180,
            label: '省终评分'
        },
        {
            prop: 'electTime',
            width: 200,
            label: "省推选日期",
            formatter: (row) => {
                return row.electTime ? dayjs(row.electTime).format('YYYY-MM-DD') : row.electTime
            }
        },
        {
            label: "操作",
            width: 200,
            fixed: "right",
            slotName: "operations",
        },
    ];
    return {
        entColumn,
        personColumn,
    }
}