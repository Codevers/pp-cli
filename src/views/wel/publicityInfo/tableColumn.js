/*
 * @Description: 
 * @Autor: wsy
 * @Date: 2022-07-30 11:10:58
 * @LastEditTime: 2022-09-20 10:06:54
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
            width: 150,
            label: '提交人'
        },
        {
            prop: 'phone',
            width: 130,
            label: '提交人手机号'
        },
        {
            slotName: "provinceGrade",
            width: 100,
            label: '省级评分'
        },
        {
            prop: "status",
            width: 100,
            label: '当前状态'
        },
        {
            prop: 'publicStartTime',
            width: 200,
            label: "公示开始日期",
            formatter: (row) => {
                return row.publicStartTime ? dayjs(row.publicStartTime).format('YYYY-MM-DD') : row.publicStartTime
            }
        },
        {
            prop: 'publicEndTime',
            width: 200,
            label: "公示截止日期",
            formatter: (row) => {
                return row.publicEndTime ? dayjs(row.publicEndTime).format('YYYY-MM-DD') : row.publicEndTime
            }
        },
    ];
    const personColumn = [
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
            'min-width': 200,
            prop: 'company',
            label: '认定对象从业单位'
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
            slotName: "provinceGrade",
            width: 100,
            label: '省级评分'
        },
        {
            prop: "status",
            width: 100,
            label: '当前状态'
        },
        {
            prop: 'publicStartTime',
            width: 200,
            label: "公示开始日期",
            formatter: (row) => {
                return row.publicStartTime ? dayjs(row.publicStartTime).format('YYYY-MM-DD') : row.publicStartTime
            }
        },
        {
            prop: 'publicEndTime',
            width: 200,
            label: "公示截止日期",
            formatter: (row) => {
                return row.publicEndTime ? dayjs(row.publicEndTime).format('YYYY-MM-DD') : row.publicEndTime
            }
        },
    ];
    return {
        entColumn,
        personColumn
    }
}