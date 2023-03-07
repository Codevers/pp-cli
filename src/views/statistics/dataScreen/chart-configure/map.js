import ahMap from './map-ah'
import * as echarts from 'echarts';
export const getMapOption = (data) => {
    echarts.registerMap('安徽', ahMap);
    return {
        tooltip: {
            show: true,
            padding: 0,
            backgroundColor: '#062043',
            enterable: true,
            transitionDuration: 0.2,
            formatter: function (params) {
                const { name } = params;
                const areaInfo = data[name]
                const toolTip = `<div class="map-tool-tips">
                    <h4>${name}</h4>
                    <p>专家会员：${areaInfo?.professionalNum}</p>
                    <p>企业会员：${areaInfo?.enterpriseNum}</p>
                    <p>个人会员：${areaInfo?.personalNum}</p>
                </div>`
                return toolTip;
            },
        },
        geo: {
            map: "安徽",
            aspectScale: 0.8,
            // 底层遮罩偏移量
            layoutCenter: ["50%", "50%"],
            layoutSize: "100%",
            itemStyle: {
                areaColor: {
                    type: "linear-gradient",
                    x: 0,
                    y: 1200,
                    x2: 1000,
                    y2: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: "#152E6E", // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: "#0673AD", // 50% 处的颜色
                        },
                    ],
                    global: true, // 缺省为 false
                },
                shadowColor: "#90BEFF",
                shadowOffsetX: 10,
                shadowOffsetY: 8,
                opacity: 0.2,
            },
        },
        series: [
            {
                type: "map",
                map: "安徽",
                aspectScale: 0.8,
                layoutCenter: ["50%", "50%"], //地图位置
                layoutSize: "100%",
                zoom: 1, //当前视角的缩放比例
                // roam: true, //是否开启平游或缩放
                scaleLimit: {
                    //滚轮缩放的极限控制
                    min: 1,
                    max: 2,
                },
                label: {
                    show: true,
                    color: "#DCDCDC",
                    fontSize: 12, // 字体大小
                    opacity: 0.7, // 字体透明度
                },
                emphasis: {
                    areaColor: "#56b1da",
                    label: {
                        show: false,
                        color: "#fff",
                    },
                },
                itemStyle: {
                    // normal: {
                    areaColor: "RGBA(20, 42, 88, 1.00)",
                    borderColor: "RGBA(193, 198, 205, 1.00)",
                    borderWidth: 1.8,
                    shadowColor: 'RGBA(49, 109, 171, 1.00)',
                    shadowOffsetY: 2,
                    shadowOffsetX: 2,
                    shadowBlur: 10,
                    // opacity: 0.5
                    // },

                },
            }
        ],
    };

}

