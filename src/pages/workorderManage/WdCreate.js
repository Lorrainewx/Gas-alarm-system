import React, { PureComponent } from 'react';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { Row, Col, Form, Input, Select, Button, Modal, DatePicker, Upload, Icon, Spin, message } from 'antd';
import { getImageUploadProps } from '@/utils/utils';

import styles from './WorkorderManage.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ operations, equipment, loading }) => ({
	operations,
	opLoading: loading.effects['operations/query'],
	equipment,
	eqLoading: loading.effects['equipment/query'],
}))
class WdCreate extends PureComponent {
	static defaultProps = {
		formVals: {}
	}
	constructor(props) {
		super(props);
		this.state = {
			editStatus: false,
		};

		this.uploadProps = getImageUploadProps(this.handleImageUploaded);

		this.handleQueryEquipment = debounce(this.handleQueryEquipment, 800);
		this.handleQueryOperations = debounce(this.handleQueryOperations, 800);
	}
	componentDidMount() {
		// this.handleQueryOperations();
	}
	componentWillReceiveProps(nextProps) {
		const { formVals } = nextProps;
		this.setState({
			editStatus: !!(formVals && Object.keys(formVals).length)
		})
	}
	handleQueryEquipment = (deviceid) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'equipment/query',
			payload: {
				pageNumber: 1,
				pageSize: 10,
				deviceid
			}
		})
	}
	handleQueryOperations = (name) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'operations/query',
			payload: {
				pageNumber: 1,
				pageSize: 10,
				name
			}
		})
	}
	handleImageUploaded = (info) => {
		console.log('图片上传信息', info);
	}
	handleSubmit = (e) => {
		e.preventDefault();

		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { onSubmit, onCancel } = this.props;
				if (typeof values.receiver === 'object') {
					values.receivername = values.receiver.label || '';
					values.receiver = values.receiver.key || '';
				}
				if (typeof onSubmit === 'function') {
					onSubmit({ ...values });
				}
			}
		});
	}
	formRender = () => {
		const {
			form: { getFieldDecorator },
			formVals,
			operations: { data: operations },
			opLoading,
			equipment: { data: equipment },
			eqLoading
		} = this.props;

		return (
			<Form onSubmit={this.handleSubmit} layout="inline" className={styles.form} labelCol={{ span: 6 }}>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem label="设备编号">
							{getFieldDecorator('devId', {
								rules: [{ required: true, message: '请输入设备的编号' }],
								initialValue: formVals.devId || ''
							})(
								<Select
									showSearch
									filterOption={false}
									notFoundContent={opLoading ? <Spin size="small" /> : null}
									onSearch={this.handleQueryEquipment}
									placeholder="请输入设备编号"
								>
									{
										equipment.list ? equipment.list.map(item => (
											<Option value={item.deviceid} key={item.deviceid}>{item.deviceid}</Option>
										)) : null
									}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="设备类型">
							{getFieldDecorator('devType', {
								rules: [{ required: true, message: '请选择设备类型' }],
								initialValue: formVals.devType || ''
							})(
								<Select placeholder="请选择设备类型">
									<Option value="NBiot">Nb设备</Option>
									<Option value="http">Http设备</Option>
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem label="工单名称">
							{getFieldDecorator('workordername', {
								initialValue: formVals.workordername || ''
							})(<Input placeholder="请输入工单名称" />)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="异常内容">
							{getFieldDecorator('content', {
								initialValue: formVals.content || ''
							})(<Input placeholder="请输入异常内容" />)}
						</FormItem>
					</Col>
					{/* <Col span={12}>
						<FormItem label="原因（？）">
							{getFieldDecorator('areacode', {
								initialValue: formVals.areacode || ''
							})(<Input placeholder="请输入原因" />)}
						</FormItem>
					</Col> */}
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem label="接收人">
							{getFieldDecorator('receiver')(
								<Select
									showSearch
									labelInValue
									filterOption={false}
									notFoundContent={opLoading ? <Spin size="small" /> : null}
									onSearch={this.handleQueryOperations}
									placeholder="请选择接收人"
								>
									{
										operations.list ? operations.list.map(item => (
											<Option value={item.id} key={item.id}>{item.name}</Option>
										)) : null
									}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="上传附件">
							<Upload {...this.uploadProps}>
								<Button>
									<Icon type="upload" /> 上传附件
								</Button>
							</Upload>
						</FormItem>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24}>
						<FormItem label="备注">
							{getFieldDecorator('remarks', {
								rules: [{ min: 5, message: '请输入最少5个字符' }],
								initialValue: formVals.remarks || ''
							})(
								<Input.TextArea rows={6} placeholder='请输入备注信息' />
							)}
						</FormItem>
					</Col>
				</Row>
				<div className={styles.btns}>
					<Button
						type='primary'
						htmlType='submit'
						style={{ height: 24 }}
					>
						确认
					</Button>
				</div>
			</Form>
		)
	}
	render() {
		const { visible, onCancel } = this.props;

		const FormRender = this.formRender;

		return (
			<Modal
				className={styles.modal}
				title={"手动创建工单"}
				width="1174px"
				centered
				visible={visible}
				destroyOnClose
				footer={null}
				onCancel={onCancel}
			>
				<FormRender />
			</Modal>
		)
	}
}

export default Form.create()(WdCreate);