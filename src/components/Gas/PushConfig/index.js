import React, { Component, Fragment } from 'react';
import { Row, Col, Modal, Table, Spin, Button, message } from 'antd';
import { connect } from 'dva';
import { differenceBy } from 'lodash';
import Optional from './Optional';
import PersonConfig from './PersonConfig';
import { isEmpty } from '@/utils/utils';

import styles from './index.less';

const Title = ({ text, type = 'row', background = false }) => (
    <div className={`${styles.titleBox} ${styles[type]}`} style={background ? { background } : null}>
        {text}
    </div>
);

const InnerBox = ({ defaultItem, children }) => (
    <div className={styles.innerBox}>
        <div className={styles.innerDefault}>{defaultItem}</div>
        <div className={styles.innerContent}>{children}</div>
    </div>
);

@connect(({ rule, operations, loading }) => ({
    rule,
    ruleloading: loading.models.rule,
    operations,
    oploading: loading.models.operations
}))
class PushConfig extends Component {
    static defaultProps = {
        deviceId: '',
        deviceType: ''
    }
    constructor(props) {
        super(props)

        this.state = {
            spVisible: false,
            selectedRowKeys: [],

            person: [],
            isDefault: false,
            warnType: null,
            pushType: null,

            pageNumber: 1,
            pageSize: 10,
        }
    }
    componentDidMount() {
        const { dispatch, deviceId, deviceType } = this.props;
        
        dispatch({
            type: 'rule/getRule',
            payload: {
                deviceId,
                deviceType
            }
        })
    }
    query = (params = {}) => {
        const { pageNumber, pageSize } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'operations/query',
            payload: {
                pageNumber,
                pageSize,
                ...params
            }
        })
    }
    handlePageChange = (pageNumber, pageSize) => {
        const { params } = this.state;
        this.query({ pageNumber, pageSize, ...params })
    }
    switchSPVisible = (spVisible = false) => {
        const { dispatch } = this.props;
        let rules = {};

        if (!spVisible) {
            const { warnType, pushType, isDefault, person } = this.state;
            
            if (person.length) {
                dispatch({
                    type: 'rule/setConfig',
                    payload: {
                        warnType,
                        pushType,
                        person,
                        isDefault
                    }
                })
            }

            rules.selectedRowKeys = [];
        } else {
            this.query();
        }

        this.setState({
            spVisible,
            ...rules
        })
    }
    pushTypeChange = (checked, warnType, pushType) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'rule/setType',
            payload: {
                checked: !checked, warnType, pushType
            }
        })
    }
    handleTypeChange = (checked, warnType, pushType, isDefault) => {
        if (isDefault) {
            message.warn('不能修改默认项');
            return;
        }

        if (checked) {
            Modal.confirm({
                title: '提示',
                content: '删除此项将会清空配置人员',
                okText: '是的',
                okType: 'danger',
                cancelText: '不',
                onOk: this.pushTypeChange.bind(this, checked, warnType, pushType),
                onCancel() {
                    return;
                },
            });
        } else {
            this.pushTypeChange(checked, warnType, pushType)
        }
    }

    handleConfirm = (warnType, pushType, isDefault) => {
        this.switchSPVisible(true)
        this.setState({
            warnType,
            pushType,
            isDefault
        })
    }

    onSelectChange = (selectedRowKeys) => {
        const { rule: { config }, operations: { data } } = this.props;
        const { warnType, pushType, isDefault } = this.state;

        let currentPerson = data.list.filter(item => !!selectedRowKeys.find(id => id === item.id))
        let configItem = config[warnType][isDefault ? 'defaultTypes' : 'optionTypes'][pushType];
        let configPerson = configItem && Array.isArray(configItem.alarmPushmanList) ? configItem.alarmPushmanList : [];
        let person = differenceBy(currentPerson, configPerson, 'pid');

        // 统一字段 pmanname
        person = person.map(item => ({
            ...item,
            pmanname: item.name,
            checked: true
        }))

        this.setState({ selectedRowKeys, person });
    }

    PushType = (props) => (
        <div className={styles.innerItem}>
            <Optional {...props}>
                {props.children}
            </Optional>
        </div>
    )

    getValue = (isDefault, warnType, pushType) => {
        const { rule: { config } } = this.props;
        const onChange = checked => this.handleTypeChange(checked, warnType, pushType, isDefault);
        const onConfirm = () => this.handleConfirm(warnType, pushType, isDefault);
        let value = {
            pushType: {
                checked: isDefault,
                disabled: isDefault,
                onChange
            },
            personConfig: {
                data: [],
                hidden: false,
                onConfirm,
                isDefault,
                warnType,
                pushType,
                focus: false
            }
        };

        if (
            config[warnType] &&
            (
                typeof config[warnType].defaultTypes[pushType] === 'object' ||
                typeof config[warnType].optionTypes[pushType] === 'object'
            )
        ) {
            let item = config[warnType][isDefault ? 'defaultTypes' : 'optionTypes'][pushType] || {};
            
            value.pushType.checked = isDefault ? isDefault : item.checked;
            value.pushType.disabled = isDefault;
            value.personConfig.data = Array.isArray(item.alarmPushmanList) ? item.alarmPushmanList : [];
            value.personConfig.hidden = isDefault ? !isDefault : !item.checked;
            value.personConfig.focus = !!item.focus;
        } else {
            value.personConfig.data = [];
            value.personConfig.hidden = !isDefault;
            value.personConfig.focus = false;
        }
        return value;
    }

    render() {
        const { selectedRowKeys } = this.state;
        const { ruleloading, operations: { data }, oploading } = this.props;
        const PushType = this.PushType;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div className={styles.main}>
                <div style={{ minWidth: '920px' }}>
                    <Spin spinning={ruleloading}>
                        <Row gutter={0} type='flex'>
                            <Col span={3} ><Title text='级别名称' background='rgba(0, 0, 0, 0.5)' /></Col>
                            <Col span={5} ><Title text='推送类型' /></Col>
                            <Col span={16} ><Title text='推送人员选择' /></Col>
                        </Row>
                        <div className={styles.container}>
                            <Row gutter={0} type='flex'>
                                <Col span={3} ><Title text='一级预警' type='col' /></Col>
                                <Col span={5} >
                                    <InnerBox defaultItem={(
                                        <PushType {...this.getValue(true).pushType}>微信</PushType>
                                    )}>
                                        <PushType {...this.getValue(false, 'warn1', 'message').pushType}>短信</PushType>
                                        <PushType {...this.getValue(false, 'warn1', 'telephone').pushType}>电话</PushType>
                                        <PushType {...this.getValue(false, 'warn1', 'jpush').pushType}>jpush</PushType>
                                        <PushType {...this.getValue(false, 'warn1', 'ding').pushType}>钉钉</PushType>
                                    </InnerBox>
                                </Col>
                                <Col span={16} >
                                    <InnerBox defaultItem={(
                                        <PersonConfig title='所有微信关注用户 其他：' {...this.getValue(true, 'warn1', 'wechat').personConfig} />
                                    )}>
                                        <PersonConfig title='发送短信至人员：' {...this.getValue(false, 'warn1', 'message').personConfig} />
                                        <PersonConfig title='致电至人员：' {...this.getValue(false, 'warn1', 'telephone').personConfig} />
                                        <PersonConfig title='极光通知人员：' {...this.getValue(false, 'warn1', 'jpush').personConfig} />
                                        <PersonConfig title='钉钉通知人员：' {...this.getValue(false, 'warn1', 'ding').personConfig} />
                                    </InnerBox>
                                </Col>
                            </Row>
                            <Row gutter={0} type='flex'>
                                <Col span={3} ><Title text='二级预警' type='col' /></Col>
                                <Col span={5} >
                                    <InnerBox defaultItem={(
                                        <Fragment>
                                            <PushType {...this.getValue(true).pushType}>微信</PushType>
                                            <PushType {...this.getValue(true).pushType}>短信</PushType>
                                        </Fragment>
                                    )}>
                                        <PushType {...this.getValue(false, 'warn2', 'telephone').pushType}>电话</PushType>
                                        <PushType {...this.getValue(false, 'warn2', 'jpush').pushType}>jpush</PushType>
                                        <PushType {...this.getValue(false, 'warn2', 'ding').pushType}>钉钉</PushType>
                                    </InnerBox>
                                </Col>
                                <Col span={16} >
                                    <InnerBox defaultItem={(
                                        <Fragment>
                                            <PersonConfig title='所有微信关注用户 其他：' {...this.getValue(true, 'warn2', 'wechat').personConfig} />
                                            <PersonConfig title='发送短信至人员：' {...this.getValue(true, 'warn2', 'message').personConfig} />
                                        </Fragment>
                                    )}>
                                        <PersonConfig title='致电至人员：' {...this.getValue(false, 'warn2', 'telephone').personConfig} />
                                        <PersonConfig title='极光通知人员：' {...this.getValue(false, 'warn2', 'jpush').personConfig} />
                                        <PersonConfig title='钉钉通知人员：' {...this.getValue(false, 'warn2', 'ding').personConfig} />
                                    </InnerBox>
                                </Col>
                            </Row>
                            <Row gutter={0} type='flex'>
                                <Col span={3} ><Title text='三级预警' type='col' /></Col>
                                <Col span={5} >
                                    <InnerBox defaultItem={(
                                        <Fragment>
                                            <PushType {...this.getValue(true).pushType}>微信</PushType>
                                            <PushType {...this.getValue(true).pushType}>短信</PushType>
                                            <PushType {...this.getValue(true).pushType}>电话</PushType>
                                        </Fragment>
                                    )}>
                                        <PushType {...this.getValue(false, 'warn3', 'jpush').pushType}>jpush</PushType>
                                        <PushType {...this.getValue(false, 'warn3', 'ding').pushType}>钉钉</PushType>
                                    </InnerBox>
                                </Col>
                                <Col span={16} >
                                    <InnerBox defaultItem={(
                                        <Fragment>
                                            <PersonConfig title='所有微信关注用户 其他：' {...this.getValue(true, 'warn3', 'wechat').personConfig} />
                                            <PersonConfig title='发送短信至人员：' {...this.getValue(true, 'warn3', 'message').personConfig} />
                                            <PersonConfig title='致电至人员：' {...this.getValue(true, 'warn3', 'telephone').personConfig} />
                                        </Fragment>
                                    )}>
                                        <PersonConfig title='极光通知人员：' {...this.getValue(false, 'warn3', 'jpush').personConfig} />
                                        <PersonConfig title='钉钉通知人员：' {...this.getValue(false, 'warn3', 'ding').personConfig} />
                                    </InnerBox>
                                </Col>
                            </Row>
                            <Row gutter={0} type='flex'>
                                <Col span={3} ><Title text='离线预警' type='col' /></Col>
                                <Col span={5} >
                                    <InnerBox defaultItem={(
                                        <Fragment>
                                            <PushType {...this.getValue(true).pushType}>微信</PushType>
                                        <PushType {...this.getValue(false, 'dropped', 'jpush').pushType}>jpush</PushType>
                                        </Fragment>
                                    )}>
                                        <PushType {...this.getValue(true).pushType}>短信</PushType>
                                        <PushType {...this.getValue(true).pushType}>电话</PushType>
                                    </InnerBox>
                                </Col>
                                <Col span={16} >
                                    <InnerBox defaultItem={(
                                        <Fragment>
                                            <PersonConfig title='所有微信关注用户 其他：' {...this.getValue(true, 'dropped', 'wechat').personConfig} />
                                            <PersonConfig title='极光通知人员：' {...this.getValue(false, 'dropped', 'jpush').personConfig} />
                                        </Fragment>
                                    )}>
                                        <PersonConfig title='发送短信至人员：' {...this.getValue(true, 'dropped', 'message').personConfig} />
                                        <PersonConfig title='致电至人员：' {...this.getValue(true, 'dropped', 'telephone').personConfig} />
                                    </InnerBox>
                                </Col>
                            </Row>
                        </div>
                    </Spin>
                </div>
                <Modal
                    className={styles.myModal}
                    title='选择人员'
                    width='960px'
                    centered
                    visible={this.state.spVisible}
                    maskClosable={false}
                    onCancel={this.switchSPVisible.bind(this, false)}
                    footer={null}
                >
                    <Table
                        loading={oploading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={data.list}
                        pagination={{
                            total: Number(data.total),
                            showQuickJumper: true,
                            current: Number(data.pageNum),
                            pageSize: Number(data.pageSize),
                            size: 'small',
                            onChange: this.handlePageChange,
                        }}
                        scroll={{ x: true }}
                        size='middle'
                        rowKey='id'
                    />
                </Modal>
            </div>
        )
    }
    columns = [
        {
            title: '序号',
            key: 'key',
            width: '4%',
            align: 'center',
            render: (_, __, index) => index + 1
        }, {
            title: '编号',
            dataIndex: 'id',
        }, {
            title: '运维人员姓名',
            dataIndex: 'name',
        }, {
            title: '电话',
            dataIndex: 'tel',
            render: val => isEmpty(val)
        }, {
            title: '职务',
            dataIndex: 'postname',
            render: val => isEmpty(val)
        }, {
            title: '所属分组',
            dataIndex: 'groupname',
            render: val => isEmpty(val)
        }
    ]
}

export default PushConfig;