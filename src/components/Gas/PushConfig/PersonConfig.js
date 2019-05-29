import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, message }  from 'antd';
import Optional from './Optional';

import styles from './index.less';

@connect(({ rule })=>({
    rule
}))
export default class PersonConfig extends Component{
    static defaultProps = {
        data: [],
        onConfirm: ()=>{}
    }
    handleTap = (checked, item, index)=>{
        const { dispatch, warnType, pushType, isDefault } = this.props;
        
        let person = { ...item, checked: !checked }

        dispatch({
            type: 'rule/editConfig',
            payload: {
                index,
                person,
                warnType,
                pushType,
                isDefault
            }
        })
    }
    handleFocus = ()=>{
        const { onConfirm, dispatch, warnType, pushType, isDefault, data, focus } = this.props;
        // focus 为true提交数据，否则执行父组件方法（打开选择人员窗口）
        if(focus){
            console.log('当前配置人员：', data)
            let pushmans = data.map(man => {
                return ({
                    pid: man.pid || man.id,
                    pkeyword: man.tel,
                    pmanname: man.pmanname,
                    isdefault: isDefault ? 1 : 0,
                    pmantype: man.pmantype || "1",
                    checked: man.checked
                })
            })

            dispatch({
                type: 'rule/update',
                payload: {
                    warntype: warnType,
                    ptype: pushType,
                    isDefault,
                    pushmans
                }
            })
        } else if(typeof onConfirm === 'function') {
            onConfirm();
        }
    }
    render(){
        const { title='', data=[], hidden, focus, pushType } = this.props;
        
        return (
            <div className={`${styles.innerItem} ${focus ? styles.focus : ''}`}>
                {
                    hidden ? null : (
                        <Fragment>
                            <div className={styles.dataBox}>
                                {title}
                                <div className={styles.innerData}>
                                    {
                                        data.length 
                                        ? data.map((item, i)=> (
                                            <Optional 
                                                type='minus' 
                                                checked={item.checked} 
                                                onChange={value=>this.handleTap(value, item, i)} 
                                                key={i}
                                            >
                                                {item.pmanname}
                                            </Optional>
                                        ))
                                        : <span>没有配置人员</span>
                                    }
                                </div>
                            </div>
                            <div className={styles.tools}>
                                {
                                    pushType === 'wechat' ? (
                                        <Button
                                            shape='circle'
                                            icon='exclamation'
                                            type='danger'
                                            size='small'
                                            onClick={()=>message.warning('不能配置此项人员！')}
                                        />
                                    ) : (
                                        <Button
                                            shape='circle'
                                            icon={focus ? 'check' : 'tool'}
                                            type={focus ? 'primary' : 'default'} 
                                            size='small'
                                            onClick={this.handleFocus}
                                        />
                                    )
                                }
                            </div>
                        </Fragment>
                    )
                }
            </div>
        );
    }
}