// 蓝色
const color1 = [{
    offset: 0,
    color: 'RGBA(24,109,211,0.1)',
}, {
    offset: 1,
    color: 'RGBA(24,109,211,1)',
}]
const color1_1 = 'RGBA(24,109,211,1)'

// 黄色
const color2 = [{
    offset: 0,
    color: 'RGBA(215, 176, 9, 0.1)',
}, {
    offset: 1,
    color: 'RGBA(215, 176, 9, 1)',
}]
const color2_2 = 'RGBA(215, 176, 9, 1)'

export const getLineOption = (data, colorType) => {
    const xData = []
    const yData = []
    for (let i in data) {
        xData.push(i)
        yData.push(data[i])

    }
    return {
        grid: {
            x: "12%",// x 偏移量
            y: "10%", // y 偏移量
            width: "82%", // 宽度
            height: "75%"// 高度
        },
        tooltip: {
            trigger: 'axis'
        },
        dataZoom: [
            {
                disabled: true,
                type: 'inside',
                xAxisIndex: 0,
                start: 0,
                end: 100,
            },
        ],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLabel: {
                color: '#eaeaea'
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '30%'], // y轴留白
            axisLabel: {
                color: '#eaeaea'
            }
        },
        series: [
            {
                data: yData,
                type: 'line',
                lineStyle: {
                    color: colorType === 1 ? color1_1 : color2_2,
                },
                symbol: 'circle',
                itemStyle: {
                    color: colorType === 1 ? color1_1 : color2_2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 1,
                        x2: 0,
                        y2: 0,
                        colorStops: colorType === 1 ? color1 : color2,
                        global: false,
                    }
                },
                smooth: true
            }
        ]
    };
}