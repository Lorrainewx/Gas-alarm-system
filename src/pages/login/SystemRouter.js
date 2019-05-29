import React, { PureComponent } from 'react';
import { Icon, message } from 'antd';
import Link from 'umi/link';

import styles from './styles.less';
import model1 from '@/assets/model01.png';
import model2 from '@/assets/model02.png';
import model3 from '@/assets/model03.png';

import { getAuthority } from '@/utils/authority';

function SystemBtn ({ title, image }){
    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>{title}</div>
            <img src={image} alt={title} />
        </div>
    )
}

function CircleBtn ({ title, icon, image, background, font, handleClick=null }){
    return (
        <div className={styles.circleBtn} title={title} style={background ? { background } : null} onClick={ handleClick }>
            {
                background && icon ? <Icon type={icon} style={{ fontSize: 28 }} /> : (
                    font ? <span>{ font }</span> :  <img src={image} alt={title} />
                )
            }
        </div>
    )
}

const rolenames = {
    'administrator': '/',
    'operaman': '/operamanHome',
    'projectLeader': '/projectLeaderHome'
}

const rolename = getAuthority();

export default class extends PureComponent{
    system = [{
        name: '安全检查',
        model: model1,
        route: ''
    },{
        name: '泄露报警',
        model: model2,
        route: rolenames[rolename]
    },{
        name: '增值服务',
        model: model3,
        route: ''
    }];
    footBtn = [{
        title: '0',
        hide: true,
        image: ''
    },{
        title: '1',
        icon: 'stock',
        background: '#f56a01',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    },{
        title: '2',
        icon: 'dashboard',
        background: '#7265e6',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    },{
        title: '3',
        font: 'M',
        background: '#00a2ad',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    },{
        title: '4',
        icon: 'wechat',
        background: '#87d067',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    },{
        title: '5',
        icon: 'qrcode',
        background: '#595959',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    },{
        title: '6',
        icon: 'android',
        background: '#86d067',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    },{
        title: '7',
        icon: 'cluster',
        background: '#fee3d0',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    },{
        title: '8',
        icon: 'rise',
        background: '#f56a01',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    },{
        title: '9',
        icon: 'setting',
        background: '#ffbe00',
        handleClick: ()=>{
            message.error('功能未上线！');
        }
    }];
    render(){
        return (
            <div className={styles.fullScreen}>
                <div className={styles.container}>
                    <div className={styles.title}>智慧燃气监管平台</div>
                    <div className={styles.systemBtnGroup}>
                        {
                            this.system.map(item=> (
                                <Link to={item.route} key={item.name}>
                                    <SystemBtn title={item.name} image={item.model} />
                                </Link>
                            ))
                        }
                    </div>
                    <div className={styles.circleBtnGroup}>
                        {
                            this.footBtn.map(item=>(
                                item.hide ? null : <CircleBtn {...item} key={item.title} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}