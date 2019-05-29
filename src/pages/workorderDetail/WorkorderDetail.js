import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Icon, Button, Timeline, Modal, Spin, Empty } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import TableContent from '@/components/Gas/TableContent';
import { isEmpty } from '@/utils/utils';

import styles from './WorkorderDetail.less';

const Detail = function ({
    deviceid, unitname, content, reason,
    workorderid, workordername, type, status, createtime, creatername, receivername, result
}) {
    return (
        <div className={styles.workDetail}>
            <ul>
                <li>设备编号：{isEmpty(deviceid)}</li>
                <li>归属单位：{isEmpty(unitname)}</li>
                <li>异常内容：{isEmpty(content)}</li>
                <li>原因：{isEmpty(reason)}</li>
            </ul>
            <ul>
                <li>工单编号：{isEmpty(workorderid)}</li>
                <li>工单名称：{isEmpty(workordername)}</li>
                <li>工单类型：{isEmpty(type)}</li>
                <li>工单状态：{isEmpty(status)}</li>
                <li>创建时间：{isEmpty(createtime)}</li>
                <li>创建人：{isEmpty(creatername)}</li>
                <li>接收人：{isEmpty(receivername)}</li>
                <li>处理结果：{isEmpty(result)}</li>
            </ul>
        </div>
    );
}

const Work = connect(({ login }) => ({
    userInfo: login.userInfo
}))(function ({ status, onClick, userInfo }) {
    const types = {
        'receive': { text: '接收', action: '接收', color: '#ff9916' },
        'process': { text: '处理', action: '处理', color: '#e84f61' },
        'hangup': { text: '挂起', action: '挂起', color: '#61d797' },
        'close': { text: '关闭', action: '关闭', color: '#62d794' },
        'completed': { text: '当前', action: '已关闭', color: '#62cdd7', disabled: true },
        'other': { text: '当前', action: '其他', color: '#62cdd7', disabled: true },
    }
    const typeCur = types[status];

    return typeCur ? (
        <>
            <div className={`${styles.workContent} ${styles.title}`}>
                <div>{typeCur.text}人员</div>
                <div>{typeCur.text}时间</div>
                <div>操作</div>
                <div>附件</div>
            </div>
            <div className={styles.workContent}>
                <div>{userInfo.realname}</div>
                <div>{moment().format('l')}</div>
                <div>
                    <Button
                        type='primary'
                        size='small'
                        style={{
                            borderRadius: 8,
                            background: typeCur.color,
                            border: 'none'
                        }}
                        disabled={typeCur.disabled}
                        onClick={onClick}
                    >
                        {typeCur.action}
                    </Button>
                </div>
                <div style={{ color: '#fc9917' }}>上传</div>
            </div>
        </>
    ) : null;
})

@connect(({ workorder, loading }) => ({
    workorder,
    detailLoading: loading.effects['workorder/query'],
    timeLineLoading: loading.effects['workorder/record'],
}))
export default class EquipmentRules extends PureComponent {
    constructor(props) {
        super(props);

        // this.handleChangeStatus=this.handleChangeStatus.bind(this);
    }
    componentDidMount() {
        const { dispatch, location: { query } } = this.props;
        const workorderid = query.id;

        if (!workorderid) return;
        dispatch({
            type: 'workorder/query',
            payload: { workorderid }
        })
        dispatch({
            type: 'workorder/record',
            payload: { workorderid }
        })
    }
    handleDelete = () => {
        const { dispatch, location: { query } } = this.props;
        const workorderid = query.id;

        Modal.confirm({
            title: '提示',
            content: '确定删除此工单吗?',
            okText: '是的',
            okType: 'danger',
            cancelText: '不',
            onOk: () => {
                dispatch({
                    type: 'workorder/delete',
                    payload: { workorderid }
                })
            }
        })
    }
    handleChangeStatus = (status) => {
        if (!status) return;
        const { dispatch, location: { query } } = this.props;
        const workorderid = query.id;

        dispatch({
            type: 'workorder/update',
            payload: {
                workorderid,
                status
            }
        })
    }
    // unreceived processing hangup completed other
    actionType = {
        'unreceived': { status: 'receive', next: 'processing' },
        'processing': { status: 'close', next: 'completed' },
        'completed': { status: 'completed', next: '' }
    }
    render() {
        const { workorder: { data, timeLineData }, detailLoading, timeLineLoading } = this.props;

        const detail = Object.keys(data).length > 0 ? data.list[0] : {};
        const timeLineList = Object.keys(timeLineData).length > 0 ? timeLineData.list : [];
        let actionType;

        try {
            actionType = this.actionType[detail.status];
        } catch(e){
            actionType = false;
        }

        return (
            <GridContent contentStyle={{ padding: '0' }}>
                <TableContent
                    title='工单详情'
                    extraContent={(
                        <div style={{ color: '#63d796' }} onClick={this.handleDelete}>
                            <Icon type='delete' />删除
                        </div>
                    )}
                >
                    <Spin spinning={detailLoading}>
                        <Detail {...detail} />
                    </Spin>
                    <Row>
                        <Col xl={10} md={12} sm={24}>
                            <TableContent title='操作' style={{ marginRight: 24 }} contentStyle={{ padding: 0 }}>
                                {
                                    actionType ? (
                                        <Work 
                                            status={actionType ? actionType.status : null} 
                                            onClick={() => this.handleChangeStatus(actionType ? actionType.next : null)} 
                                        />
                                    ) : null
                                }
                                {
                                    detail.status === 'processing' || detail.status === 'completed' ? null : (
                                        <Work status='close' onClick={() => this.handleChangeStatus('completed')} />
                                    )
                                }
                            </TableContent>
                        </Col>
                        <Col xl={14} md={12} sm={24}>
                            <TableContent title='工单处理流水' contentStyle={{ background: '#29344a' }}>
                                <div style={{ padding: '24px 24px 0', maxHeight: 350, overflowY: 'auto' }}>
                                    <Spin spinning={timeLineLoading}>
                                        {
                                            timeLineList.length > 0 ? (
                                                <Timeline style={{ paddingLeft: '140px' }}>
                                                    {
                                                        timeLineList.map((item, index) => (
                                                            <Timeline.Item key={index}>
                                                                <span className={styles.timelineTime}>{isEmpty(item.createtime)}</span>
                                                                <span className={styles.timelineName}>{isEmpty(item.who)}</span>
                                                                <span style={{ marginRight: 16 }}>{isEmpty(item.dowhat)}</span>
                                                                <span>备注：{isEmpty(item.remarks)}</span>
                                                            </Timeline.Item>
                                                        ))
                                                    }
                                                </Timeline>
                                            ) : (
                                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                                )
                                        }
                                    </Spin>
                                </div>
                            </TableContent>
                        </Col>
                    </Row>
                </TableContent>
            </GridContent>
        )
    }
}