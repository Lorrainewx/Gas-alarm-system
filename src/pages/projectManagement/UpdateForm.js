import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, Modal  } from 'antd';
const FormItem = Form.Item;

import styles from './styles.less';

class UpdateForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editStatus: false,  
        }
    }

    componentWillReceiveProps(nextProps){
		const { formVals } = nextProps;
		this.setState({
			editStatus: !!(formVals && Object.keys(formVals).length)
		})
    }
    
    renderContent = () => {
        const { form, formVals={} } = this.props

        const { getFieldDecorator } = form 
        const { editStatus } = this.state
        return (
            <Form layout="inline" align="middle">
				<Row gutter={24}>			    	
                    <Col span={24}>
				      	<FormItem label="项目名称">
				        	{getFieldDecorator('proname',{
                                initialValue: formVals.proname || '',
                                rules: [{ required: true, message: '请输入项目名称' }]
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={24}>
				      	<FormItem label="项目负责人姓名">
				        	{getFieldDecorator('proleader',{
                                initialValue: formVals.proleader || '',
                                rules: [{ required: true, message: '请输入项目负责人姓名' }]
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={24}>
				      	<FormItem label="项目负责人电话">
				        	{getFieldDecorator('protel',{
                                initialValue: formVals.protel || ''
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
    okHandle = () => {
        const { form, handleOk, formVals } = this.props
		form.validateFields((err, values) => {
			if (!err) {
				handleOk({ ...values, proid: formVals.proid });
			}
		})
    }

    render() {
        const { visible, handleCancel } = this.props
        const { editStatus } = this.state
        return (
            <Modal             
                className={styles.modal}
                title={editStatus?'编辑项目':'新增项目'}
                visible = { visible }   
                bodyStyle={{
					padding: '20px 0'
				}}            
                onCancel = { () => handleCancel(false) }
            >
                { this.renderContent() }
            </Modal>
        )
    }
}

export default Form.create()(UpdateForm)