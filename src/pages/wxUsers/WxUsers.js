import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Table, Button, Avatar, Input, Popover } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import moment from 'moment';
import { isEmpty } from '@/utils/utils';

import styles from '../equipmentRules/EquipmentRules.less';

@Form.create()
@connect(({ wxusers, loading }) => ({
    data: wxusers.data,
    loading: loading.models.wxusers
}))
export default class EquipmentRules extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            params: {},
            pageNumber: 1,
            pageSize: 10,
        };
    }
    componentDidMount() {
        this.query();
    }
    query = (params = {}) => {
        const { pageNumber, pageSize } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'wxusers/query',
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
    render() {
        const { form: { getFieldDecorator }, data, loading } = this.props;

        return (
            <GridContent>
                <Form className={styles.searchForm} layout='inline' onSubmit={this.handleSearch}>
                    <Row gutter={0}>
                        <Col xl={4} lg={6} md={12} sm={24}>
                            <Form.Item
                                label='用户名称'
                            >
                                {getFieldDecorator('nikeName')(
                                    <Input size='small' />
                                )}
                            </Form.Item>
                        </Col>
                        <div style={{ margin: '16px 0 24px' }}>
                            <Button type='primary' size='small' htmlType='submit' style={{ borderRadius: 4, marginLeft: 12 }}>查询</Button>
                        </div>
                    </Row>
                </Form>
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
                    size='middle'
                    rowKey='openId'
                />
            </GridContent>
        )
    }
    columns = [{
        title: '序号',
        key: 'index',
        width: '4%',
        align: 'center',
        render: (_, __, i) => i + 1
    }, {
        title: '用户昵称',
        dataIndex: 'nikename',
        width: '10%',
    }, {
        title: '头像',
        dataIndex: 'headimgurl',
        width: '10%',
        render: val => <Avatar src={val} />
    }, {
        title: '地址',
        dataIndex: 'addr',
        width: '12%',
        render: (_, record) => `${isEmpty(record.country)}/${isEmpty(record.province)}/${isEmpty(record.city)}`.replace(/\/\-|中国\//g,'')
    }, {
        title: '关注时间',
        dataIndex: 'subscribeTime',
        render: val => moment(val * 1000).format("YYYY-MM-DD HH:MM")
    }]
}