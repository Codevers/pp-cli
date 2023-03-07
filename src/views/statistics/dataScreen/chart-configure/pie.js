export const getPieOption = (data) => {
    let datas = []
    if (!data || Object.keys(data).length === 0) {
        datas = [{ value: 0, name: '暂无数据', count: 0 }]
    }
    for (let i in data) {
        // datas.push({ value: data[i], name: i })
        datas.push({ value: data[i].item1, name: i, count: data[i].item2 })
    }
    return {
        tooltip: {
            // trigger: 'item'
            formatter: function (params) {
                const { data: { name, value, count } } = params;
                const toolTip = `<div>${name}：${value + '%'}</div><div>数量：${count}人</div>`
                return toolTip;
            },
        },
        legend: {
            top: 'center',
            orient: 'vertical',
            itemWidth: 4,
            itemHeight: 4,
            itemStyle: {
                'border-radius': '10px',
            },
            left: 220,
            textStyle: {
                color: '#eaeaea',
            },
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '60%'],
                center: ['30%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5
                },
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: datas
            }
        ]
    };
}