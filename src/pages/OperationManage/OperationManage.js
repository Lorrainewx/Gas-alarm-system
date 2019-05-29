import React, { Component } from 'react';
import { connect } from 'dva';
import { Row,  Col, Table, Form, Input, Button, Popconfirm, Modal, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UpdateForm from './UpdateForm';
import { isEmpty } from '@/utils/utils';

import styles from './OperationManage.less';
const FormItem = Form.Item;

@connect(({ operations, loading }) => ({
	operations,
	loading: loading.models.operations
}))
@Form.create()
class OperationManage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			params: {}, // 搜索条件
			pageNumber: 1,
			pageSize: 10,
			
			visible: false,
			formVals: {}
		}
	}
	componentDidMount() {
		this.query();
	}
	handleVisible = (visible=false, formVals={}) => {
		this.setState({ visible, formVals })
	}
	query = (params={})=>{
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
	handleDelete = (id) => {
		const { dispatch, operations: { data } } = this.props;
		dispatch({
			type: 'operations/delete',
			payload: {
				id,
				pageNumber: data.pageNum,
				pageSize: data.pageSize
			}
		})
	}
	handleUpdateOk = (formVals) => { // 更新运维人员信息
		const { dispatch, operations: { data } } = this.props;
		dispatch({
			type: 'operations/update',
			payload: {
				...formVals,
				pageNumber: data.pageNum,
				pageSize: data.pageSize
			}
		}).then(()=>{
			this.handleVisible()
		})
	}
	handlePageChange = (pageNumber, pageSize)=>{
		const { params } = this.state;
		this.query({ pageNumber, pageSize, ...params })
	}
	renderSearchForm = (getFieldDecorator) => ( // 查询表单
		<Form onSubmit={this.handleSearch} layout="inline">		
			<Row>
				<Col xl={4} lg={6} md={12} sm={24}>
					<FormItem label="姓名">
						{getFieldDecorator('name')(<Input size="small"/>)}
					</FormItem>
				</Col>
				<Col xl={4} lg={6} md={12} sm={24}>
					<FormItem label="电话">
						{getFieldDecorator('tel')(<Input size="small"/>)}
					</FormItem>
				</Col>
				<div style={{ margin: '16px 0 24px' }}>
					<Button className={styles.successfulBtn} htmlType="submit" size="small" type="primary" style={{borderRadius: '4px', marginLeft: '12px' }}> 查询 </Button>
					<Button className={styles.primaryBtn} onClick={() => this.handleVisible(true)} size="small" style={{marginLeft: '20px'}}> 添加人员 </Button>
				</div>
			</Row>
		</Form>
	)
	render() {
		const { operations: { data }, loading, form: { getFieldDecorator } } = this.props;
		const { visible, formVals } = this.state;

		return (
			<GridContent>
				<div className={styles.searchForm}>{ this.renderSearchForm(getFieldDecorator) }</div>				
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
						pageSizeOptions: ['10', '15','30'],
						onChange: this.handlePageChange,
						onShowSizeChange: this.handlePageChange
					}}
					scroll={{ x: true }}
					size='middle'
					rowKey='id'
				/>
				<UpdateForm
					visible={visible}
					formVals={formVals}
					handleOk={this.handleUpdateOk}
					handleCancel={this.handleVisible}
				/>
			</GridContent>
		)
	}
	columns = [
		{
			title: '序号',
			key: 'key',
			width: '4%',
			align: 'center',
			render: (_, __, index) => index + 1
		},{
			title: '编号',
			dataIndex: 'id',
			width: '12%'
		},{
			title: '运维人员姓名',
			dataIndex: 'name',
			width: '8%'
		},{
			title: '电话',
			dataIndex: 'tel',
			width: '8%',
			render: val => isEmpty(val)
		},{
			title: '职务',
			dataIndex: 'postname',
			width: '5%',
			render: val => isEmpty(val)
		},{
			title: '所属分组',
			dataIndex: 'groupname',
			width: '5%',
			render: val => isEmpty(val)
		},{
			title: '系统登录账号',
			dataIndex: 'username',
			width: '7%',
			render: val => isEmpty(val)
		},{
			title: '修改时间',
			dataIndex: 'modifytime',
			width: '5%'
		}, {
			title: '操作',
			key: 'action',
			render: (_, record) => (
				<div>
					<Button className={ styles.primaryBtn } size="small" style={{ marginRight: '10px' }} onClick={() => this.handleVisible(true, record)} >编辑</Button>
					<Popconfirm title="确定删除该记录吗？" okText="是" cancelText="否" onConfirm={()=>this.handleDelete(record.id)}>
						<Button size="small">删除</Button>
					</Popconfirm>
				</div>
			)
		}
	]
}

export default OperationManage;