import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Table, Badge, Button, Icon, message, Empty, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Line from '@/components/Gas/Charts/Line';
import { isEmpty } from '@/utils/utils';
import styles from '@/utils/table.less';
const { Option } = Select;
const warnstatus = {
    'nowarn': 'green',
    'dropped': '#d9d9d9',
    'warn1': 'yellow',
    'warn2': 'orange',
    'warn3': 'red',
}

@Form.create()
@connect(({ equipment, company, historicallog, loading }) => ({
    equipment,
    eqloading: loading.effects['equipment/query'],
    curveloading: loading.effects['equipment/getCurve'],
    company,
    historicallog,
    logloading: loading.effects['historicallog/query'],
}))
export default class EquipmentSearcher extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            deviceid: '',
            dtype: '',
            params: {},
            pageNumber: 1,
            pageSize: 1,
        };
    }
    componentDidMount() {
        const { dispatch, location: { query } } = this.props;
        const deviceid = query.id;
        const dtype = query.type;

        dispatch({
            type: 'equipment/clear'
        })
        dispatch({
            type: 'historicallog/clear'
        })
        dispatch({
            type: 'company/query'
        })

        if (deviceid) {
            this.setState({
                deviceid
            })
            this.query({ deviceid });
        }

        if (deviceid && dtype) {
            this.setState({
                deviceid,
                dtype
            })
            this.getCurve({ deviceid, dtype })
        }

    }
    query = (params = {}) => {
        const { pageNumber, pageSize } = this.state;
        const { dispatch } = this.props;
        if (!params.deviceid) {
            message.error('请先输入设备编号！');
            return;
        }
        dispatch({
            type: 'equipment/query',
            payload: {
                pageNumber,
                pageSize,
                ...params
            }
        })
        dispatch({
            type: 'historicallog/query',
            payload: {
                pageNumber,
                pageSize: 10,
                mn: params.deviceid
            }
        })
    }
    getCurve = (params = {}) => {
        const { dispatch } = this.props;

        if (!params.dtype) {
            message.error('请先选择设备类型！');
            return;
        }
        dispatch({
            type: 'equipment/getCurve',
            payload: {
                ...params
            }
        })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    params: { ...values }
                })
                this.query({ ...values });
                this.getCurve({ ...values });
            }
        });
    }
    render() {
        const {
            equipment: { data, curveData },
            company: { data: comy },
            historicallog: { data: logs },
            eqloading,
            logloading,
            curveloading,
            form: { getFieldDecorator }
        } = this.props;

        const { deviceid, dtype } = this.state;

        const manufacturer = comy && comy.list ? comy.list : [];

        const curveDataList = deviceid ? curveData : [];
        let curveY = [];
        curveDataList.map(item => curveY.push(item.dttdensity1));
        let curveX = [];
        curveDataList.map(item => curveX.push(item.activedate));

        const boxStyle = {
            background: '#29344a',
            margin: '16px 0'
        };

        const loadingStyle = {
            textAlign: 'center',
            fontSize: '20px',
        }
        
        return (
            <GridContent>
                <Form className={styles.searchForm} layout="inline" onSubmit={this.handleSearch}>
                    <Row gutter={0}>
                        <Col xl={4} lg={6} md={12} sm={24}>
                            <Form.Item
                                label='设备编号'
                            >
                                {getFieldDecorator('deviceid', {
                                    initialValue: deviceid
                                })(<Input size='small' />)}
                            </Form.Item>
                        </Col>
                        <Col xl={4} lg={6} md={12} sm={24}>
                            <Form.Item
                                label='设备类型'
                            >
                                {getFieldDecorator('dtype', {
                                    initialValue: dtype
                                })(
                                    <Select style={{ width: '100%' }} allowClear size="small">
                                        <Option value="NBiot">Nb设备</Option>
                                        <Option value="http">Http设备</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col xl={4} lg={6} md={12} sm={24}>
                            <Form.Item
                                label='归属单位'
                            >
                                {getFieldDecorator('uname')(
                                    <Select style={{ width: '100%' }} allowClear size="small">
                                        {
                                            manufacturer.map((item, index) => (
                                                <Option value={item.unid} key={index}>{item.uname}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <div style={{ margin: '16px 0 24px' }}>
                            <Button type='primary' size='small' htmlType='submit' style={{ borderRadius: 4, marginLeft: 12 }}>查询</Button>
                        </div>
                    </Row>
                </Form>
                <div style={{ ...boxStyle, margin: 0 }}>
                    <Table
                        loading={eqloading}
                        columns={this.columns}
                        dataSource={data.list}
                        pagination={false}
                        scroll={{ x: true }}
                        size='middle'
                        rowKey='id'
                    />
                </div>
                <div style={{ ...boxStyle, padding: '12px 24px' }}>
                    <Spin spinning={!!curveloading}>
                        {
                            curveX.length && curveY.length ? (
                                <Line title='浓度曲线' x={curveX} y={curveY} subData={123} xAxisText='日期' yAxisText='浓度' subTitle='总发送量' />

                            ) : (
                                <Empty description='暂无浓度数据' image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )
                        }
                    </Spin>
                </div>
                <div style={boxStyle}>
                    <Table
                        loading={logloading}
                        title={() => '预警发送记录列表'}
                        columns={this.columns2}
                        dataSource={logs.list}
                        pagination={false}
                        scroll={{ x: true }}
                        size='middle'
                        rowKey='id'
                    />
                </div>
            </GridContent>
        )
    }
    columns = [
        {
            title: '序号',
            key: 'index',
            width: '4%',
            align: 'center',
            render: (_, __, index) => index + 1
        }, {
            title: '设备编号',
            dataIndex: 'deviceid',
            key: 'id',
            width: "8%"
        }, {
            title: '归属单位',
            dataIndex: 'uname',
            key: 'belong',
            width: "12%"
        }, {
            title: '浓度',
            dataIndex: 'density',
            width: "6%",
            render: val => (
                isEmpty(val) + '%LEL'
            )
        }, {
            title: '状态',
            dataIndex: 'warnstatus',
            width: "8%",
            render: (text, record) => (
                <Badge color={warnstatus[text] || '#d9d9d9'} text={record.warnstatusstr || '-'} />
            )
        }, {
            title: '使用状态',
            dataIndex: 'isused',
            width: "8%",
            render: text => (
                <Badge status={text ? 'success' : 'error'} text={text ? '使用中' : '未使用'} />
            )
        }, {
            title: '通信状态',
            width: '8%',
            dataIndex: 'onlinestatus',
            render: text => (
                <div><span className={`${styles.linewrapper} ${text === '离线' ? styles.offline : styles.online}`}></span>{text}</div>
            )
        }, {
            title: '更新时间',
            dataIndex: 'lastdistime'
        }
    ];
    columns2 = [
        {
            title: '序号',
            key: 'index',
            width: '4%',
            align: 'center',
            render: (_, __, index) => (index + 1)
        }, {
            title: '编号',
            dataIndex: 'id',
            width: '6%'
        }, {
            title: '目标',
            dataIndex: 'touser',
            width: '5%'
        }, {
            title: '商户',
            dataIndex: 'shanghu',
            width: '8%'
        }, {
            title: '设备号',
            dataIndex: 'mn',
            width: '8%',
            render: val => isEmpty(val)
        }, {
            title: '浓度',
            dataIndex: 'nongdu',
            width: '5%',
            render: val => isEmpty(val)
        }, {
            title: '发送内容',
            dataIndex: 'content',
            width: '10%',
            render: val => isEmpty(val)
        }, {
            title: '发送类型',
            dataIndex: 'types',
            width: '5%',
            render: val => isEmpty(val)
        }, {
            title: '发送状态',
            dataIndex: 'success',
            width: '5%',
            render: val => (
                <span className={`${val === '1' ? null : styles.unsent}`}>{val === '1' ? '成功' : '失败'}</span>
            )
        }, {
            title: '异常时间',
            dataIndex: 'datetime',
            width: '8%',
            render: val => isEmpty(val)
        }, {
            title: '原因备注',
            dataIndex: 'cause',
        }
    ];
}