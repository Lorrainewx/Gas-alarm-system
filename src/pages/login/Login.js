import React, { Component } from 'react';
import { Row, Col, Typography, Form,  Button, Input, Checkbox } from 'antd';
import { connect } from 'dva';
const { Title } = Typography;
const FormItem = Form.Item;

import styles from './styles.less'
import leftGraph from '@/assets/login02.png'

@Form.create()
@connect(({ login, loading })=>({
	login,
	loading: loading.models.login
}))
class UserLoginModule extends Component {
	handleRemChange = (e) => {
		// e.preventDefault();
		const { dispatch } = this.props;
		dispatch({
			type: 'login/rememberUser',
			payload: { rememberUser: e.target.checked }
		})
	}
	handleSubmit = (e)=>{
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
		  if (!err) {
			const { dispatch } = this.props;
			dispatch({
				type: 'login/token',
				payload: {
					...values
				}
			});
		  }
		});
	}
	render() {
		const { login: { rememberUser, userInfo },form: { getFieldDecorator }, loading } = this.props;
		return (
			<div className={styles.userWrapper}>
				<Row gutter={24}>
					<Col span={12} style={{ height: '464px' }}>
						<div className={styles.img}>
							<img src={ leftGraph } />	
						</div>						
					</Col>
					<Col span={12} style={{ height: '464px' }}>
						<div className={styles.login}>
							<Title level={2}> 智慧燃气监管平台 </Title>
							<Form onSubmit={this.handleSubmit}>
						  		<FormItem>
					  				{getFieldDecorator('username', {
										rules: [{ required: true, message: '请输入账号！' }],
										initialValue: userInfo.username || ''
					  				})(<Input placeholder="请输入账号" size="large" />)}
						  		</FormItem>
						  		<FormItem>
					  				{getFieldDecorator('password', {
										rules: [{ required: true, message: '请输入密码！' }],
										initialValue: userInfo.password || ''
									})(<Input.Password placeholder="请输入密码" size="large" />)}
					  				<div className={styles.infoWrapper}>				  					
					  					<Checkbox onChange={this.handleRemChange} checked={rememberUser}>记住密码</Checkbox>
					  					<a href="javascript:;" style={{float: 'right'}}>忘记密码?</a>
					  				</div>
						  		</FormItem>
						  		<Button loading={loading} className={styles.loginBtn} htmlType='submit'>登录</Button>
							</Form>
						</div>
					</Col>
				</Row>
			</div>
		)
	}
}

export default UserLoginModule;