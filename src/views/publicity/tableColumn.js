/*
 * @Description: 
 * @Autor: wsy
 * @Date: 2022-08-10 17:13:25
 */
import dayjs from 'dayjs'
export default function useTableColumn() {

    const companyColumn = [
        {
            prop: 'index',
            width: 80,
            label: '序号',
        },
        {
            prop: 'city',
            label: '地市',
            width: 150,
        },
        {
            prop: 'company',
            label: '企业名称',
            align: 'left',
            'min-width': 200,
            'show-overflow-tooltip': true
        },
        {
            prop: 'year',
            label: '认定年度',
            width: 200,
        }

    ];
    const entColumn = [
        {
            prop: 'index',
            width: 80,
            label: '序号',
        },
        {
            prop: 'city',
            label: '地市',
            width: 150,
        },
        {
            prop: 'company',
            label: '企业名称',
            align: 'left',
            'min-width': 200,
            'show-overflow-tooltip': true
        },
        {
            prop: 'year',
            width: 200,
            label: '认定年度'
        },
        {
            prop: 'endTime',
            width: 200,
            label: '公示截止日期',
            formatter: (row) => {
                return row.endTime ? dayjs(row.endTime).format('YYYY-MM-DD') : row.endTime
            }
        },
        {
            label: '证明文件',
            fixed: 'right',
            slotName: 'fileData',
            width: 120
        }

    ];
    const peopleColumn = [
        {
            prop: 'index',
            width: 60,
            label: '序号',
        },
        {
            prop: 'city',
            label: '地市',
            width: 150,
        },
        {
            prop: 'name',
            label: '姓名',
            width: 200,
        },
        {
            prop: 'company',
            label: '企业名称',
            align: 'left',
            'min-width': 200,
            'show-overflow-tooltip': true
        },
        {
            prop: 'year',
            label: '认定年度',
            width: 200,
        },

    ];
    const personColumn = [
        {
            prop: 'index',
            width: 60,
            label: '序号',
        },
        {
            prop: 'city',
            label: '地市',
            width: 150,
        },
        {
            prop: 'name',
            label: '姓名',
            width: 200,
        },
        {
            prop: 'company',
            label: '企业名称',
            align: 'left',
            'min-width': 200,
            'show-overflow-tooltip': true
        },
        {
            prop: 'year',
            width: 200,
            label: '认定年度'
        },
        {
            prop: 'endTime',
            width: 200,
            label: '公示截止日期',
            formatter: (row) => {
                return row.endTime ? dayjs(row.endTime).format('YYYY-MM-DD') : row.endTime
            }
        },
        {
            label: '证明文件',
            fixed: 'right',
            slotName: 'fileData',
            width: 120
        }
    ];
    const standardColumn = [
        // {
        //     prop: 'index',
        //     width: 60,
        //     label: '序号',
        // },
        // {
        //     prop: 'fileType',
        //     label: '文件类型',
        //     width: 130,
        // },
        // {
        //     slotName: 'fileName',
        //     label: '文件名称',
        // },
        // {
        //     prop: 'company',
        //     label: '发文单位',
        // },
        // {
        //     slotName: 'remark',
        //     label: '备注',
        //     width: 180,
        //     align: 'left'
        // }

        {
            type: 'index',
            width: 60,
            label: '序号',
        },
        {
            prop: 'docName',
            slotName: 'docName',
            label: '文件名称',
            align: 'left',
            showOverflowTooltip: true
        },
        {
            prop: 'pubicOffice',
            label: '发文单位',
            align: 'center',
            width: 350,
            showOverflowTooltip: true
        },
        {
            prop: 'publicTime',
            label: '发布日期',
            width: 250,
        },
        // {
        //     prop: 'enforceTime',
        //     label: '实施日期',

        // }

    ];
    return {
        peopleColumn,
        companyColumn,
        standardColumn,
        entColumn,
        personColumn
    }
}