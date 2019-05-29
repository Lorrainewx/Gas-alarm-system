import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Table, Modal, Button, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PushConfig from '@/components/Gas/PushConfig';
import { isEmpty } from '@/utils/utils';

import styles from './EquipmentRules.less';

@Form.create()
@connect(({ equipment, loading })=>({
    equipment,
	loading: loading.models.equipment
}))
export default class EquipmentRules extends PureComponent {
    constructor(props){
        super(props);
        
        this.state = {
            params: {},
			pageNumber: 1,
            pageSize: 10,
            
            visible: false,
            deviceId: null,
            deviceType: null
        };
    }
	componentDidMount() {	
		this.query();
	}
	query = (params={})=>{
		const { pageNumber, pageSize } = this.state;
		const { dispatch } = this.props;
		dispatch({
			type: 'equipment/query',
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
			console.log('查询条件: ', values);
			if (!err) {
				this.setState({
					params: { ...values }
				})
				this.query({ ...values });
			}
		});
	}
	handlePageChange = (pageNumber, pageSize)=>{
		const { params } = this.state;
		this.query({ pageNumber, pageSize, ...params })
	}
    switchVisible = (visible=false, emRules={})=>{
        this.setState({
            visible,
            deviceId: emRules.deviceid,
            deviceType: emRules.dtype
        })
    }
    render(){
        const { deviceId, deviceType } = this.state;
        const { equipment: { data }, loading, form:{ getFieldDecorator } } = this.props;

        const btnStyle = {
            borderRadius: 4,
            marginLeft: 12
        }
        
        return (
            <GridContent>
                <Form className={styles.searchForm} layout="inline" onSubmit={ this.handleSearch }>
                    <Row gutter={0}>
                        <Col xl={4} lg={6} md={12} sm={24}>
                            <Form.Item
                                label='设备编码'
                            >
                                {getFieldDecorator('deviceid')(
                                    <Input size='small' />
                                )}
                            </Form.Item>
                        </Col>
                        <div style={{ margin: '16px 0 24px' }}>
                            <Button type='primary' size='small' htmlType="submit" style={btnStyle}>查询</Button>
                        </div>
                    </Row>
                </Form>
                <Table
					loading={loading}
                    columns={this.tableColumns}
                    dataSource={data.list}
                    pagination={{
                        total: Number(data.total),
						showSizeChanger: true,
						showQuickJumper: true,
						current: Number(data.pageNum),
						pageSize: Number(data.pageSize),
						size: 'small',
						pageSizeOptions: ['10', '15','30'],
						onChange: this.handlePageChange,
						onShowSizeChange: this.handlePageChange
                    }}
                    scroll={{ x: true }}
                    size='middle'
                    rowKey='id'
                />
                <Modal
                    className={ styles.myModal }
                    title='规则设置'
                    width='960px'
                    centered
                    visible={ this.state.visible }
                    maskClosable={ false }
                    onCancel={ ()=>this.switchVisible(false, {}) }
                    destroyOnClose
                    footer={ null }
                >
                    <PushConfig deviceId={deviceId} deviceType={deviceType} />
                </Modal>
            </GridContent>
        )
    }
    tableColumns = [{
        title: '序号',
        key: 'index',
        width: '4%',
        align: 'center',
        render: (_, __, i)=> i+1
    },{
        title: '编码',
        dataIndex: 'deviceid',
        width: '8%',
    },{
        title: '归属单位',
        dataIndex: 'uname',
        width: '10%',
        render: val => isEmpty(val)
    },{
        title: '是否绑定规则',
        dataIndex: 'hasrule',
        width: '8%',
        render: val=> val === '1' ? '是' : <div style={{ color: '#f00' }}>否</div>
    },{
        title: '创建日期',
        dataIndex: 'createtime',
        width: '12%',
        render: val => isEmpty(val)
    },{
        title: '规则配置',
        key: 'setting',
        render: (_, row)=> <a onClick={ ()=>this.switchVisible(true, row) } style={{ color: '#eaee53' }}>设置规则</a>
    }];
}