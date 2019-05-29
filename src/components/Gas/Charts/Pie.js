import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

const Pie = ({ height='310px', data={}, theme='dark', option={} }) =>{

    let x = [], y = [];

    for(let i in data){
        x.push(i);
        y.push({ value: data[i], name: i })
    }

    const themes = {
        dark: {
            title: '#fff',  // 标题颜色
            label: '#fff', // 标签颜色
            labelLine: '#fff', // 标签线颜色
        },
        light: {
            title: '#000',
            label: '#000',
            labelLine: '#000',
        }
    }
    const color = (thme)=>{
        return themes[thme] ? themes[thme] : themes.dark;
    }
    
    const defaultOption = {
        color: ['#939ff5','#3ce6b7','#51c4f0','#ef819c','#ee8f33','#585C8C','#B338B4','#DF1453','#896F54'],
        legend: {
            orient: 'vertical',
            right: 20,
            y: 'center',
            itemGap: 15,
            textStyle:{
                color: color(theme).title
            },
            data: x
        },
        series: [
            {
                type:'pie',
                center: ['35%','50%'],
                radius: ['40%', '55%'],
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: true,
                        formatter: '{c}',
                        color: color(theme).label,
                    }
                },
                labelLine:{
                    lineStyle: {
                        color: color(theme).labelLine
                    }
                },
                data: y
            }
        ],
        ...option
    };
    return (
        <ReactEcharts
            option={ defaultOption }
            style={{ height }}
            lazyUpdate={ true }
        />
    )
}

export default Pie;