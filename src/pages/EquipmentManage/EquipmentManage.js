import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Row, Col, Table, Icon, Form, Input, Select, Button, DatePicker, Checkbox, Badge, Spin, Tabs, Popconfirm, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PushConfig from '@/components/Gas/PushConfig';
import UpdateForm from './UpdateForm';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { isEmpty } from '@/utils/utils';
import { getAuthority } from '@/utils/authority';

import styles from './EquipmentManage.less';
const { Option } = Select;
const { Item } = Form;
const { RangePicker, MonthPicker } = DatePicker;
const { TabPane } = Tabs;

const warnstatus = {
	'nowarn': 'green',
	'dropped': '#d9d9d9',
	'warn1': 'yellow',
	'warn2': 'orange',
	'warn3': 'red',
}

@Form.create()
@connect(({ equipment, company, loading }) => ({
	equipment,
	company,
	loading: loading.models.equipment
}))
class EquipmentInfoList extends Component {
	constructor(props) {	// getinitialstate 
		super(props);

		this.state = {
			params: {},
			pageNumber: 1,
			pageSize: 10,

			visible: false,
			updateVisible: false,
			formVals: {},
		}
	}
	componentDidMount() {
		const { dispatch } = this.props;
		this.query();
		dispatch({
			type: 'company/query'
		})
	}
	query = (params = {}) => {
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
	handleDelete = (deviceid, dtype) => {
		const { dispatch, equipment: { data } } = this.props;
		dispatch({
			type: 'equipment/delete',
			payload: {
				deviceid,
				dtype,
				pageNumber: data.pageNum,
				pageSize: data.pageSize
			}
		})
	}
	handleUpdateModalVisible = (visible = false, formVals = {}) => {
		if(visible){
			const { dispatch } = this.props;
			dispatch({ type: 'equipment/resetSubmited' })
		}
		this.setState({
			visible,
			formVals
		})
	}
	handleSubmit = (value) => {
		const { dispatch } = this.props;
		const { formVals } = this.state;
		dispatch({
			type: 'equipment/update',
			payload: { ...value },
			editStatus: !!(formVals && Object.keys(formVals).length),
			callback: this.handleUpdateModalVisible(),
		});
	}
	renderSearchForm = () => {
		const {
			form: { getFieldDecorator },
			company: { data }
		} = this.props;

		let manufacturer = data && data.list ? data.list : [];

		const layoutCol = {
			xl: 4,
			lg: 6,
			md: 12,
			sm: 24
		}

		const boxStyle = {
			borderRadius: '4px',
			marginLeft: '12px',
			marginRight: '10px'
		}

		return (
			<Form className={styles.searchForm} onSubmit={this.handleSearch} layout="inline">
				<Row>
					<Col {...layoutCol}>
						<Item label="编号" >
							{getFieldDecorator('deviceid')(<Input size="small" />)}
						</Item>
					</Col>
					<Col {...layoutCol}>
						<Item label="归属单位">
							{getFieldDecorator('uname')(
								<Select style={{ width: '100%' }} allowClear size="small">
									{
										manufacturer.map(item => (
											<Option value={item.unid} key={item.unid}>{item.uname}</Option>
										))
									}
								</Select>
							)}
						</Item>
					</Col>
					<Col {...layoutCol}>
						<Item label="使用状态">
							{getFieldDecorator('isused')(
								<Select style={{ width: '100%' }} allowClear size="small">
									<Option value="1">使用中</Option>
									<Option value="0">未使用</Option>
								</Select>
							)}
						</Item>
					</Col>
					<Col {...layoutCol}>
						<Item label="在线状态">
							{getFieldDecorator('warnstatus')(
								<Select style={{ width: '100%' }} allowClear size="small">
									<Option value="1">在线</Option>
									<Option value="0">离线</Option>
								</Select>
							)}
						</Item>
					</Col>
					<Col {...layoutCol}>
						<Item label="厂家分类">
							{getFieldDecorator('ftytype')(<Input size="small" />)}
						</Item>
					</Col>
					<div style={{ margin: '16px 0 24px' }}>
						<Button className={styles.successfulBtn} htmlType="submit" size="small" type="primary" style={{ ...boxStyle }}> 查询 </Button>
						<Button className={styles.primaryBtn} onClick={() => this.handleUpdateModalVisible(true)} size="small"> 添加设备 </Button>
					</div>
				</Row>
			</Form>
		)
	}
	render() {
		const { equipment: { data, submited }, loading } = this.props;
		const { visible, formVals } = this.state;
		const currentrole = getAuthority()[0];

		return (
			<GridContent>
				<div className={styles.searchForm}> {this.renderSearchForm()} </div>
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
					rowKey="id"
				/>
				<UpdateForm
					visible={visible}
					formVals={formVals}
					submited={submited}
					onSubmit={this.handleSubmit}
					onCancel={() => this.handleUpdateModalVisible()}
				/>
			</GridContent>
		)
	}
	columns = [
		{
			title: '序号',
			key: 'index',
			width: "4%",
			align: 'center',
			render: (_, __, i) => i + 1
		}, {
			title: '设备编号',
			dataIndex: 'deviceid',
			width: "8%",
			render: (val, record) => <Link to={`/equipmentSearcher?id=${val}&type=${record.dtype}`}>{val}</Link>
		}, {
			title: '归属单位',
			dataIndex: 'uname',
			width: "10%",
			render: val => isEmpty(val)
		}, {
			title: '浓度',
			dataIndex: 'density',
			width: "5%",
			render: val => isEmpty(val) + '%LEL'
		}, {
			title: '状态',
			dataIndex: 'warnstatus',
			width: '8%',
			render: (text, record) => (
				<Badge color={warnstatus[text] || '#d9d9d9'} text={record.warnstatusstr || '-'} />
			)
		}, {
			title: '使用状态',
			dataIndex: 'isused',
			width: "8%",
			render: text => (
				<Badge status={text === '1' ? 'success' : 'default'} text={text === '1' ? '使用中' : '未使用'} />
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
			width: "8%",
			dataIndex: 'lastdistime',
			render: val => isEmpty(val)
		}, {
			title: '操作',
			key: 'action',
			render: (_, record) => (
				<div>
					<Button size="small" className={styles.primaryBtn} onClick={() => this.handleUpdateModalVisible(true, record)} style={{ marginRight: '10px' }}>编辑</Button>
					<Popconfirm title="确定删除该记录吗？" onConfirm={() => this.handleDelete(record.deviceid, record.dtype)} okText="是" cancelText="否">
						<Button size="small">删除</Button>
					</Popconfirm>
				</div>
			)
		}
	]
}

export default EquipmentInfoList