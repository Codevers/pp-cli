/*
 * @Description: 
 * @Version: 1.0.1
 * @Autor: wsy
 * @Date: 2022-07-30 11:10:58
 * @LastEditTime: 2022-08-15 13:30:22
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
            prop: 'loginName',
            label: '登录账号',

            fixed: "left"
        },
        {
            prop: 'loginIp',
            label: '登录IP',
        },
        {
            prop: 'loginTime',
            label: '登录时间'
        },

        {
            slotName: 'loginStatus',
            label: '登录状态',
            width: 120,
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