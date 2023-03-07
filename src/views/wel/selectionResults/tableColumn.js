/*
 * @Description: 
 * @Autor: wsy
 * @Date: 2022-07-30 11:10:58
 * @LastEditTime: 2022-09-27 13:13:24
 */
import dayjs from 'dayjs'
export default function useTableColumn() {

    const entColumn = [
        {
            prop: 'index',
            width: 60,
            label: '序号',
            fixed: "left"
        },
        {
            type: 'selection',
            width: 55,
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
            fixed: "left"
        },
        {
            prop: 'submitter',
            width: 120,
            label: '提交人'
        },
        {
            prop: 'phone',
            width: 140,
            label: '提交人手机号'
        },
        {
            prop: "provinceGrade",
            width: 120,
            label: '省级评分'
        },
        {
            prop: "status",
            width: 100,
            label: '当前状态'
        },
        {
            prop: 'publicEndTime',
            width: 180,
            label: "公示截止日期",
            formatter: (row) => {
                return row.publicEndTime ? dayjs(row.publicEndTime).format('YYYY-MM-DD') : row.publicEndTime
            }
        },
        {
            prop: 'fileTime',
            width: 180,
            label: "归档日期",
            formatter: (row) => {
                return row.fileTime ? dayjs(row.fileTime).format('YYYY-MM-DD') : row.fileTime
            }
        },
        {
            slotName: 'result',
            width: 110,
            label: "认定结果",
            fixed: "right"
        },
    ];

    const personColumn = [
        {
            prop: 'index',
            width: 80,
            label: '序号',
            fixed: "left"
        },
        {
            type: 'selection',
            width: 55,
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
            'min-width': 200,
            label: '认定对象从业单位',
        },
        {
            prop: 'submitter',
            width: 130,
            label: '提交人'
        },
        {
            prop: 'phone',
            width: 130,
            label: '提交人手机号'
        },
        {
            prop: "provinceGrade",
            width: 100,
            label: '省级评分'
        },
        {
            prop: "status",
            width: 100,
            label: '当前状态'
        },
        {
            prop: 'publicEndTime',
            width: 180,
            label: "公示截止日期",
            formatter: (row) => {
                return row.publicEndTime ? dayjs(row.publicEndTime).format('YYYY-MM-DD') : row.publicEndTime
            }
        },
        {
            prop: 'fileTime',
            width: 180,
            label: "归档日期",
            formatter: (row) => {
                return row.fileTime ? dayjs(row.fileTime).format('YYYY-MM-DD') : row.fileTime
            }
        },
        {
            slotName: 'result',
            width: 110,
            label: "认定结果",
            fixed: "right"
        },
    ];
    return {
        entColumn,
        personColumn
    }
}