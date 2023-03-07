export default function usePageHooks() {

    const tableColumn = [
        {
            prop: 'index',
            width: '60px',
            label: '序号'
        },
        {
            prop: 'docName',
            label: '文件名',
            slotName: "docName",
            showOverflowTooltip: true,
        },
        {
            prop: 'publicTime',
            label: '发文日期'
        },
        {
            prop: 'pubicOffice',
            label: '发文单位',
            showOverflowTooltip: true,
        },
        {
            prop: 'enforceTime',
            label: '实施日期'
        },
        {
            prop: 'createTime',
            label: '创建日期'
        },
        {
            prop: 'creatorName',
            label: '创建人'
        },
        {
            prop: 'status',
            label: '状态'
        },
        {
            label: "操作",
            width: 300,
            fixed: "right",
            slotName: "option",
        },
    ];

    return {
        tableColumn
    }
}