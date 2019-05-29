import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Link from 'umi/link';
import moment from 'moment';
import { Row, Col, Table, Form, Input, DatePicker, Select, Button, Rate } from 'antd'
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import TableContent from '@/components/Gas/TableContent';
import WdCreate from './WdCreate';
import { isEmpty } from '@/utils/utils';

import styles from './WorkorderManage.less';

const { Item } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
@connect(({ workorder, loading }) => ({
    workorder,
    loading: loading.models.workorder
}))
class WorkorderManage extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,

            params: {},
            pageNumber: 1,
            pageSize: 10,
        }
    }
    componentDidMount() {
        this.query();
    }
    query = (params = {}) => {
        const { pageNumber, pageSize } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'workorder/query',
            payload: {
                pageNumber,
                pageSize,
                ...params
            }
        })
    }
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.createtime && values.createtime.length) {
                    values.startTime = values.createtime[0].format('YYYY-MM-DD');
                    values.endTime = values.createtime[1].format('YYYY-MM-DD');
                    delete values.createtime;
                }
                console.log('values', values)
                this.setState({
                    params: { ...values }
                })
                this.query({ ...values });
            }
        });
    }
    handlePageChange = (pageNumber, pageSize) => {
        const { params } = this.state;
        this.query({ pageNumber, pageSize, ...params })
    }
    switchVisible = (visible = false) => {
        this.setState({
            visible
        })
    }
    handleCreate = (formVals) => {
        const { dispatch } = this.props;
        // console.log('formVals', formVals);
        // return;
        dispatch({
            type: 'workorder/add',
            payload: { ...formVals },
            callback: this.switchVisible
        })
    }
    renderSearchForm = () => {
        const {
            form: { getFieldDecorator },
        } = this.props;

        const btnStyle = {
            borderRadius: '4px',
            marginLeft: '12px'
        }

        const layoutCol = {
            xl: 4,
            lg: 6,
            md: 12,
            sm: 24
        }

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row>
                    <Col {...layoutCol}>
                        <Item label="设备编号">
                            {getFieldDecorator('workorderid')(<Input size="small" />)}
                        </Item>
                    </Col>
                    <Col {...layoutCol} xl={6}>
                        <Item label="创建日期">
                            {getFieldDecorator('createtime')(
                                <RangePicker
                                    disabledDate={(current) => current && current > moment().endOf('day')}
                                    format={'YYYY-MM-DD'}
                                />
                            )}
                        </Item>
                    </Col>
                    <Col {...layoutCol}>
                        <Item label="单位名称">
                            {getFieldDecorator('unitname')(<Input size="small" />)}
                        </Item>
                    </Col>
                    <Col {...layoutCol}>
                        <Item label="工单内容">
                            {getFieldDecorator('workordername')(<Input size="small" />)}
                        </Item>
                    </Col>
                    <Col {...layoutCol}>
                        <Item label="工单状态">
                            {getFieldDecorator('status')(
                                <Select style={{ width: '100%' }} allowClear size="small">
                                    <Option value="unreceived">未接收</Option>
                                    <Option value="processing">处理中</Option>
                                    <Option value="hangup">挂起</Option>
                                    <Option value="completed">已结束</Option>
                                    <Option value="other">其他</Option>
                                </Select>
                            )}
                        </Item>
                    </Col>
                    <Col {...layoutCol}>
                        <Item label="接收人">
                            {getFieldDecorator('receivername')(<Input size="small" />)}
                        </Item>
                    </Col>
                    <Col {...layoutCol}>
                        <Item label="创建人">
                            {getFieldDecorator('creatername')(<Input size="small" />)}
                        </Item>
                    </Col>
                    <div style={{ margin: '16px 0 24px' }}>
                        <Button htmlType="submit" size="small" type="primary" style={btnStyle}> 查询 </Button>
                    </div>
                </Row>
            </Form>
        )
    }
    render() {
        const { visible } = this.state;
        const { loading, workorder: { data } } = this.props;

        return (
            <GridContent contentStyle={{ padding: 0 }}>
                <TableContent
                    title='预警工单管理'
                    extraContent={
                        <Button
                            type="primary"
                            style={{
                                height: 26,
                                borderRadius: 8,
                                background: '#ff9916',
                                border: 'none'
                            }}
                            onClick={() => this.switchVisible(true)}
                        >
                            手动创建
                        </Button>
                    }
                >
                    <div className={styles.main}>
                        <div className={styles.searchForm}>{this.renderSearchForm()}</div>
                        <Table
                            loading={loading}
                            columns={this.columns}
                            dataSource={data.list}
                            pagination={{
                                total: Number(data.total),
                                showSizeChanger: true,
                                showQuickJumper: true,
                                current: Number(data.pageNum),
                                pageSize: Number(data.pageSize),
                                size: 'small',
                                pageSizeOptions: ['10', '15', '30'],
                                onChange: this.handlePageChange,
                                onShowSizeChange: this.handlePageChange
                            }}
                            scroll={{ x: true }}
                            rowKey='workorderid'
                        />
                        <WdCreate
                            visible={visible}
                            onCancel={() => this.switchVisible()}
                            onSubmit={this.handleCreate}
                        />
                    </div>
                </TableContent>
            </GridContent>
        )
    }
    columns = [
        {
            title: '序号',
            key: 'index',
            width: '4%',
            align: 'center',
            fixed: true,
            render: (_, __, index) => (index + 1)
        }, {
            title: '工单编号',
            dataIndex: 'workorderid',
            width: '6%',
            render: val => <Link to={`/workorderDetail?id=${val}`}>{val}</Link>
        }, {
            title: '工单名称',
            dataIndex: 'workordername',
            width: '5%',
            render: val => isEmpty(val)
        }, {
            title: '工单状态',
            dataIndex: 'status',
            width: '8%',
            render: val => isEmpty(val)
        }, {
            title: '创建时间',
            dataIndex: 'createtime',
            width: '8%',
            render: val => isEmpty(val)
        }, {
            title: '创建人',
            dataIndex: 'creatername',
            width: '5%',
            render: val => isEmpty(val)
        }, {
            title: '接收人',
            dataIndex: 'receivername',
            width: '7%',
            render: val => isEmpty(val)
        }, {
            title: '内容',
            children: [
                {
                    title: '设备编号',
                    dataIndex: 'deviceid',
                    width: '5%',
                    render: val => isEmpty(val)
                }, {
                    title: '归属单位',
                    dataIndex: 'unitname',
                    width: '5%',
                    render: val => isEmpty(val)
                }, {
                    title: '异常内容',
                    dataIndex: 'content',
                    width: '5%',
                    render: val => isEmpty(val)
                }, {
                    title: '原因',
                    dataIndex: 'reason',
                    width: '5%',
                    render: val => isEmpty(val)
                }, {
                    title: '处理结果',
                    dataIndex: 'result',
                    render: val => isEmpty(val)
                }
            ]
        }, {
            title: '处理时长',
            dataIndex: 'duration',
            render: val => isEmpty(val)
        }, {
            title: '备注',
            dataIndex: 'remarks',
            render: val => isEmpty(val)
        }, {
            title: '评价',
            dataIndex: 'evaluate',
            render: val => (
                <Rate
                    disabled
                    defaultValue={isEmpty(val, 0)}
                    style={{ fontSize: 14 }}
                />
            )
        }
    ]
}

export default WorkorderManage;