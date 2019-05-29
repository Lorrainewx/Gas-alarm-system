import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Row, Col, Table, Form, Input, Select, Button } from 'antd'
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { isEmpty } from '@/utils/utils';

import styles from './HistoricalLog.less';
const { Item } = Form;
const { Option } = Select;

@Form.create()
@connect(({ historicallog, loading }) => ({
	historicallog,
	loading: loading.models.historicallog
}))
class HistoricalLog extends PureComponent {
	constructor(props){
		super(props);

		this.state = {
			showtouser: false,
			params: {},
			pageNumber: 1,
			pageSize: 10,
		}
	}
	componentDidMount() {
		this.query();
	}
	query = (params={})=>{
		const { pageNumber, pageSize } = this.state;
		const { dispatch } = this.props;
		dispatch({
			type: 'historicallog/query',
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
	handlePageChange = (pageNumber, pageSize)=>{
		const { params } = this.state;
		this.query({ pageNumber, pageSize, ...params })
	}
	handleTypesChange = (val)=>{
		this.setState({
			showtouser: !!val
		})
	}
	renderSearchForm = () => {
		const { showtouser } = this.state;
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
								<Item label="编号">
									{getFieldDecorator('id')(<Input size="small" />)}
								</Item>
						</Col>
						<Col {...layoutCol}>
								<Item label="发送内容">
									{getFieldDecorator('content')(<Input size="small" />)}
								</Item>
						</Col>
						<Col {...layoutCol}>
								<Item label="发送类型">
									{getFieldDecorator('types')(
										<Select style={{ width: '100%' }} allowClear size="small" onChange={this.handleTypesChange}>
											<Option value="wechat">微信</Option>
											<Option value="message">短信</Option>
											<Option value="telephone">电话</Option>
											<Option value="gas-sms-jpush">JPUSH</Option>
										</Select>
									)}
								</Item>
						</Col>
						{
							showtouser ? (
								<Col {...layoutCol}>
									<Item label="发送人">
										{getFieldDecorator('touser')(<Input size="small" />)}
									</Item>
								</Col>
							) : null
						}
						<div style={{ margin: '16px 0 24px' }}>
							<Button className={styles.successfulBtn} htmlType="submit" size="small" type="primary" style={btnStyle}> 查询 </Button>
						</div>
					</Row>			
			</Form>
		)
	}
	render() {
		const { loading, historicallog: { data } } = this.props;
		
		return (
			<GridContent>
				<div className={styles.searchForm}>{ this.renderSearchForm() }</div>
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
					rowKey='id'
				/>
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
			render: (_, __, index) => (index+1)
		},{
			title: '编号',
			dataIndex: 'id',
			width: '6%'
		},{
			title: '目标',
			dataIndex: 'touser',
			width: '5%'
		},{
			title: '商户',
			dataIndex: 'shanghu',
			width: '8%'
		},{
			title: '设备号',
			dataIndex: 'mn',
			width: '8%',
			render: val => isEmpty(val)
		},{
			title: '浓度',
			dataIndex: 'nongdu',
			width: '5%',
			render: val => isEmpty(val)
		},{
			title: '发送内容',
			dataIndex: 'content',
			width: '7%',
			render: val => isEmpty(val)
		},{
			title: '发送类型',
			dataIndex: 'types',
			width: '5%',
			render: val => isEmpty(val)
		},{
			title: '发送状态',
			dataIndex: 'success',
			width: '5%',
			render: val => (
				<span className={`${val==='1' ? null : styles.unsent}`}>{ val==='1'? '成功':'失败' }</span>
			)
		},{
			title: '发送时间',
			dataIndex: 'sendTime',
			width: '5%',
			render: val => isEmpty(val)
		},{
			title: '异常时间',
			dataIndex: 'datetime',
			width: '5%',
			render: val => isEmpty(val)
		},{
			title: '原因备注',
			dataIndex: 'cause'
		}
	]
}

export default HistoricalLog