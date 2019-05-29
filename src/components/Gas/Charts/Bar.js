import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

const Bar = ({ height='310px', data={}, theme='dark', option={} }) => {

    let x = [], y = [];

    for(let i in data){
        x.push({value:i, textStyle: {color: '#ffffff'}});
        y.push(data[i]);
    }  
    const themes = {
        dark: {
            xAxisText: '#fff', // x轴文本颜色
            yAxisText: '#fff', // y轴文本颜色
            lineStyle: '#40444f', // 线颜色
            offsetEnd: '#222e3a' // 底部渐变结束颜色
        },
        light: {
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
        color: ['#60D795'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            
                type : 'shadow'     
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : x,
                axisTick: {
                    alignWithLabel: true
                },
                nameTextStyle: {
                    color: color(theme).xAxisText
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                name : '时间',
                nameTextStyle: {
                    color: color(theme).yAxisText
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: color(theme).yAxisText
                    }
                },
                splitLine:{
                    lineStyle: {
                        color: color(theme).lineStyle,
                        width: 2
                    }
                },
            }
        ],
        series : [
            {
                name:'时长',
                type:'bar',
                barWidth: '25%',
                data: y,
               
            }
        ],
        ...option
    }

    return (
        <ReactEcharts
            option={ defaultOption }
            style={{ height }}
            lazyUpdate={ true }
        />
    )
}


export default Bar;