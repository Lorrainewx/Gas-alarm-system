import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

import styles from './charts.less';

const Line = ({ 
    title='',
    subTitle='',
    subData='',
    x = [],
    y = [],
    xAxisText='',
    yAxisText='',
    height='280px',
    theme='dark',
    option={}
}) =>{
    const themes = {
        dark: {
            title: '#fff',  // 标题颜色
            xAxisText: '#fff', // x轴文本颜色
            yAxisText: '#fff', // y轴文本颜色
            lineStyle: '#40444f', // 线颜色
            offsetEnd: '#222e3a' // 底部渐变结束颜色
        },
        light: {
            title: '#000',
            xAxisText: '#000',
            yAxisText: '#000',
            lineStyle: '#ccc',
            offsetEnd: '#eee'
        }
    }
    const color = (thme)=>{
        return themes[thme] ? themes[thme] : themes.dark;
    }
    
    const defaultOption = {
        title: {
            text: title,
            left: 'center',
            top: 20,
            textStyle: {
                color: color(theme).title,
                fontWeight: 100,
                fontSize: 14,
            }
        },
        tooltip : {
            trigger: 'axis',
            formatter: '{b}<br />{c}'
        },
        grid: {
            left: 0,
            right: '40px',
            bottom: '12px',
            containLabel: true
        },
        xAxis: [
            {
                type : 'category',
                name: xAxisText,
                nameTextStyle: {
                    color: color(theme).xAxisText
                },
                // boundaryGap : false,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: color(theme).xAxisText
                    }
                },
                axisLine:{
                    show: false
                },
                data : x
            }
        ],
        yAxis: [
            {
                type : 'value',
                name: yAxisText,
                nameTextStyle: {
                    color: color(theme).yAxisText
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: color(theme).yAxisText
                    }
                },
                axisLine:{
                    show: false
                },
                splitLine:{
                    lineStyle: {
                        color: color(theme).lineStyle,
                        width: 2
                    }
                },
            }
        ],
        series: [
            {
                type:'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    color: '#63d796',
                },
                itemStyle: {
                    normal: {
                        color: '#63d796',
                        borderColor: '#63d796'
                    }
                },
                areaStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0.4, color: '#355d55' // 0% 处的颜色
                            }, {
                                offset: 1, color: color(theme).offsetEnd // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                },
                data: y
            }
        ],
        ...option
    };
    return (
        <div className={styles.charts}>
            <ReactEcharts
                option={ defaultOption }
                style={{ height }}
                lazyUpdate={ true }
            />
            <div className={styles.subTitle}></div>
        </div>
    )
}

export default Line;