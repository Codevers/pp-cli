export const tableColumn1 = [
    {
        prop: 'info',
        label: '待分配信息',
        width: 190
    },
    {
        prop: 'score',
        label: '认定分数',
        slotName: 'score'
    },
    {
        prop: 'expert',
        label: '分配专家',
        width: 190
    },
    {
        prop: 'expertTotal',
        label: '专家数量'
    },
    {
        prop: 'expertNum',
        label: '专家总数',
        slotName: 'expertNum'
    }
];
export const tableColumn2 = [
    {
        prop: 'groupWay',
        label: '认定内容分组方式设置',
        width: 190,
        slotName: 'groupWay'
    },
    {
        prop: 'group',
        label: '分组',
        slotName: 'group',
        align: 'left'
    }
];
export const tableColumn3 = [
    {
        prop: 'expertSetting',
        label: '认定专家设置',
        slotName: 'operations',
        'header-align': 'center',
        align: 'left'
    }
];
export const tableColumn4 = [
    {
        prop: 'scoreRule',
        label: '计分规则设置',
        slotName: 'operations',
        'header-align': 'center',
        align: 'left'
    }
];
export const datasource1 = [
    {
        info: '选定的待分配任务（份）',
        type: '企业',
        score: '',
        expert: '待分配专家（个）',
        expertTotal: '专家总数',
        expertNum: ''
    },
    {
        info: '选定的待分配任务（份）',
        type: '个人',
        score: '',
        expert: '待分配专家（个）',
        expertTotal: '未分配任务专家',
        expertNum: ''
    }
];
export const datasource2 = [
    {
        groupWay: '分组方式',
        group: ''
    },
    {
        groupWay: '',
        group: ''
    }
];
export const datasource3 = [
    {
        expertSetting: ''
    }
];
export const datasource4 = [
    {
        scoreRule: ''
    }
];
