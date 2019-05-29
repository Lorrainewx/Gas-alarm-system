import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row,  Col, Table, Form, Input, Button, Popconfirm, Modal, message } from 'antd';

import styles from './OperationManage.less';
const FormItem = Form.Item;

class UpdateForm extends PureComponent {
	state = {
		editStatus: false
	}
	componentWillReceiveProps(nextProps){
		// const { formVals } = nextProps;
		// this.setState({
		// 	editStatus: !!(formVals && Object.keys(formVals).length)
		// })
	}
	componentWillUpdate(nextProps) {
		const { formVals } = nextProps;
		this.setState({
			editStatus: !!(formVals && Object.keys(formVals).length)
		})
	}
	okHandle = () => {
		const { form, handleOk, formVals } = this.props;
		form.validateFields((err, values) => {
			if (!err) {
				handleOk({ ...values, pmantype: 1, id: formVals.id });
			}
		})
	}
	renderContent = () => {
		const { form, formVals={} } = this.props;
		const { getFieldDecorator } = form;

		return (
			<Form layout="inline" align="middle">
				<Row gutter={24}>
			    	<Col span={24}>
				      	<FormItem label="运维人员名称">
				        	{getFieldDecorator('name',{
					        	initialValue: formVals.name || '',
				        		rules: [{ required: true, message: '请输入运维人员名称' }]
				        	})(<Input  size="small"/>)}
				      	</FormItem>
			    	</Col>
			    	<Col span={24}>
				      	<FormItem label="联系方式">
				        	{getFieldDecorator('tel',{
								initialValue: formVals.tel || '',
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
			    	<Col span={24}>
				      	<FormItem label="职务">
				        	{getFieldDecorator('post',{
				        		initialValue: formVals.post || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
			    	<Col span={24}>
				      	<FormItem label="所属分组">
				        	{getFieldDecorator('groupid',{
				        		initialValue: formVals.groupid || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
			    	<Col span={24}>
				      	<Button size="small" onClick={this.okHandle} type="primary" className={styles.successfulBtn} style={{ marginTop: 20 }}>确定</Button>
			    	</Col>
				</Row>
			</Form>
		)
	}
	render(){
		const { visible, handleCancel } = this.props;
		const { editStatus } = this.state;

		return (
			<Modal
				className={styles.modal}
				title={editStatus?'编辑人员':'新增人员'}
				visible={ visible }
				bodyStyle={{
					padding: '20px 0'
				}}
				onCancel={() => handleCancel(false)}  
			>
				{ this.renderContent() }
			</Modal>
		)
	}
}

export default Form.create()(UpdateForm);