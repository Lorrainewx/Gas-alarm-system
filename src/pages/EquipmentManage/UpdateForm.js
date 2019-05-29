import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Button, Modal, Checkbox, Tabs, Radio, message } from 'antd';
import PushConfig from '@/components/Gas/PushConfig';

import styles from './EquipmentManage.less';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;

@connect(({ operations, company }) => ({
	operations,
	company
}))
class UpdateForm extends PureComponent {
	state = {
		tabKey: 'register',
		editStatus: false,
		autoMakeRule: true, // 默认选中规则

		deviceId: '',	// 注册设备的id
		deviceType: '',  // 注册设备的类型

		dataRadioList: [],// 存放选项的数组
		utitle: '', // 模态框的标题
		uvisible: false, // 模态框是否可见
		currentVal: '', // 单选框当前默认值
		currentField: '', //当前字段名称
		currentunid: '', // 当前所属单位的值
		currentopeid: '', //当前运维人员的值
	};

	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'operations/query'
		})
		dispatch({
			type: 'company/query'
		})
	}
	componentWillReceiveProps(nextProps) {
		const { formVals } = nextProps;
		this.setState({
			editStatus: !!(formVals && Object.keys(formVals).length)
		})
	}
	handleAutoChange = (e) => {
		this.setState({
			autoMakeRule: e.target.checked,
		})
	}
	tabsChange = (tabKey) => {
		const { submited } = this.props;
		if (!submited) {
			message.warning('请先注册设备！');
			return;
		}
		this.setState({ tabKey });
	}
	handleSubmit = (e) => {
		e.preventDefault();
		const { currentunid, currentopeid } = this.state;
		this.props.form.setFieldsValue({
			unid: currentunid || this.props.formVals.unid,
			opeid: currentopeid || this.props.formVals.opeid
		})
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { onSubmit, onCancel } = this.props;
				const { autoMakeRule } = this.state;
				if (typeof onSubmit === 'function') {
					onSubmit({
						...values,
						defultRule: autoMakeRule ? 1 : 0
					});

					if (autoMakeRule) {
						// 如果选择生成规则，就自动切换到配置人员，否则关闭窗口
						this.setState({
							tabKey: 'setting',
							deviceId: values.deviceid,
							deviceType: values.dtype
						})
					} else if (typeof onCancel === 'function') {
						onCancel();
					}
				}
			}
		});
	}
	handleChangeRadio = (title = '', dataList = [], currentField = '', currentVal = null, visible = false) => {
		if (Number(dataList) !== 0) {
			let data = dataList.map(item => ({ id: item.id || item.unid, name: item.name || item.uname }));
			this.setState({
				utitle: title,
				dataRadioList: data,
				currentField,
				currentVal,
				uvisible: visible,
			})
		} else {
			this.setState({
				uvisible: visible,
			})
		}
	}
	getRadioChoose = (e) => {
		const { currentField } = this.state;
		this.setState({
			currentVal: e.target.value,
		})
		if (currentField == 'unid') {
			this.setState({
				currentunid: e.target.value
			})
		} else if (currentField == 'opeid') {
			this.setState({
				currentopeid: e.target.value
			})
		}
	}
	getname = (field, fieldbeitai, datalist) => {
		const id = field || fieldbeitai;
		let data = datalist.map(item => ({ id: item.id || item.unid, name: item.name || item.uname }));
		const filterlist = data.filter(item => item.id === id);
		let currentname = '';
		if (Number(filterlist) !== 0) {
			currentname = filterlist[0].name || '';
		}
		return currentname;
	}
	formRender = () => {
		const {
			operations: { data: operman },
			company: { data: manufacturer },
			form: { getFieldDecorator },
			formVals
		} = this.props;

		const { editStatus, autoMakeRule } = this.state;

		const opermanList = operman && operman.list ? operman.list : [];
		const manufacturerList = manufacturer && manufacturer.list ? manufacturer.list : [];
		const { dataRadioList, uvisible, utitle, currentVal, currentopeid, currentunid } = this.state;

		const currentuname = this.getname(currentunid, formVals.unid, manufacturerList);

		const currentopname = this.getname(currentopeid, formVals.opeid, opermanList);

		return (
			<Form onSubmit={this.handleSubmit} layout="inline" className={styles.form} labelCol={{ span: 6 }}>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem label="设备ID">
							{getFieldDecorator('deviceid', {
								rules: [{ required: true, message: '请输入设备的ID' }],
								initialValue: formVals.deviceid || ''
							})(<Input placeholder="请输入设备的ID" disabled={editStatus} />)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="设备类型">
							{getFieldDecorator('dtype', {
								rules: [{ required: true, message: '请选择设备的类型' }],
								initialValue: formVals.dtype || ''
							})(
								<Select placeholder="请选择设备的类型" disabled={editStatus}>
									<Option value="NBiot">Nb设备</Option>
									<Option value="http">Http设备</Option>
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem label="设备名称">
							{getFieldDecorator('dname', {
								rules: [{ required: true, message: '请输入设备名称' }],
								initialValue: formVals.dname || ''
							})(<Input placeholder="请输入设备名称" />)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="所属区域">
							{getFieldDecorator('areacode', {
								initialValue: formVals.areacode || ''
							})(
								<Select placeholder="请选择所属区域">
									{/* <Option value="nb">NB</Option>
									<Option value="http">HTTP</Option> */}
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem label="所属单位">
							{getFieldDecorator('unid', {
								rules: [{ required: autoMakeRule, message: '请选择使用状态' }],
								initialValue: currentuname,
							})(
								<Input placeholder="请选择所属单位" onClick={(e) => this.handleChangeRadio('所属单位', manufacturerList, 'unid', formVals.unid, true)} />
							)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="厂家分类">
							{getFieldDecorator('ftytype', {
								rules: [{ required: true, message: '请选择厂家分类' }],
								initialValue: formVals.ftytype || ''
							})(
								<Select placeholder="请选择厂家分类">
									<Option value="1">分类1</Option>
									<Option value="0">分类0</Option>
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem label="运维人员">
							{getFieldDecorator('opeid', {
								rules: [{ required: autoMakeRule, message: '请选择使用状态' }],
								initialValue: currentopname,
							})(
								<Input placeholder="请选择运维人员" onClick={(e) => this.handleChangeRadio('运维人员', opermanList, 'opeid', formVals.opeid, true)} />
							)}
						</FormItem>
					</Col>
					<Col span={12}>
						<FormItem label="使用状态">
							{getFieldDecorator('isused', {
								rules: [{ required: true, message: '请选择使用状态' }],
								initialValue: formVals.isused || ''
							})(
								<Select placeholder="请选择使用状态">
									<Option value="1">使用中</Option>
									<Option value="0">暂未使用</Option>
								</Select>
							)}
						</FormItem>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<FormItem label="协议文档">
							{getFieldDecorator('agfile', {
								initialValue: formVals.agfile || ''
							})(
								<Select placeholder="请选择协议文档">
									{/* <Option value="nb">NB</Option>
									<Option value="http">HTTP</Option> */}
								</Select>
							)}
						</FormItem>
					</Col>
					{
						editStatus ? (
							<Col span={12}>
								<FormItem label="重新生成二维码">
									{getFieldDecorator('newEcode', {
										initialValue: formVals.newEcode || '0'
									})(
										<RadioGroup>
											<Radio value='1'>是</Radio>
											<Radio value='0'>否</Radio>
										</RadioGroup>
									)}
								</FormItem>
							</Col>
						) : null
					}
				</Row>
				<Row gutter={16}>
					<Col span={24}>
						<FormItem label="描述">
							{getFieldDecorator('description', {
								rules: [{ min: 5, message: '请输入最少5个字符' }],
								initialValue: formVals.description || ''
							})(
								<Input.TextArea rows={6} placeholder='请输入相关描述' />
							)}
						</FormItem>
					</Col>
				</Row>
				{/* 弹出框 */}
				<Modal
					visible={uvisible}
					title={utitle}
					width="800px"
					onCancel={() => this.handleChangeRadio()}
					footer={null}
				>
					<div className={styles.radioWrapper}>
						<RadioGroup onChange={(e) => this.getRadioChoose(e)} value={currentVal}>
							{
								dataRadioList.map(item => (
									<Radio value={item.id} key={item.id}>{item.name}</Radio>
								))
							}
						</RadioGroup>
					</div>
				</Modal>

				<div className={styles.btns}>
					<Checkbox
						checked={autoMakeRule}
						onChange={val => this.handleAutoChange(val)}
					>
						<span className={styles.text}>自动生成规则</span>
					</Checkbox>
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
		const { tabKey, editStatus, deviceId, deviceType } = this.state;
		const { visible, onCancel } = this.props;

		const FormRender = this.formRender;

		return (
			<Modal
				className={styles.modal}
				title={editStatus ? "编辑设备" : null}
				width="1174px"
				centered
				visible={visible}
				destroyOnClose
				footer={null}
				onCancel={onCancel}
			>
				{
					editStatus ? (
						<FormRender />
					) : (
							<Tabs type="card" activeKey={tabKey} onChange={this.tabsChange}>
								<TabPane tab="注册设备" key="register">
									<FormRender />
								</TabPane>
								<TabPane tab="规则设置" key="setting">
									{
										deviceId && deviceType && deviceId.length && deviceType.length ? (
											<PushConfig deviceId={deviceId} deviceType={deviceType} />
										) : null
									}
								</TabPane>
							</Tabs>
						)
				}
			</Modal>
		)
	}
}

export default Form.create()(UpdateForm);