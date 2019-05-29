import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Button, Modal, Radio, Upload, Icon } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;

import styles from './styles.less';
const utypes = [
	{type:'restaurant',name:'餐饮单位'},
	{type:'resident',name:'居民'},
	{type:'business',name:'商业'},
	{type:'industry',name:'工业'},
]
class UpdateForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
			editStatus: false,  
			// 图片相关
			previewVisible: false,
			previewImage: '',
			fileList: [],
			licensesFileList: [],	      // 营业执照图片列表
			sfckAgreementsFileList: [],	  // 安全检查协议图片列表
			supplyAgreementsFileList: [], // 供气协议图品列表
			sfInformingsFileList: [],	  // 安全告知单图片列表
			signsFileList: [],            // 门头协议图片列表
			kitchensFileList: [],         // 厨房情况图片列表
        }
	}
	handleCancel = () => this.setState({ previewVisible: false });
	handlePreview = async file => {
		if (!file.url && !file.preview) {
		  file.preview = await getBase64(file.originFileObj);
		}
	
		this.setState({
		  previewImage: file.url || file.preview,
		  previewVisible: true,
		});
	};	
	handleChange = ({ fileList }) => this.setState({ fileList });
	getBase64 = (file) => {
		return new Promise((resolve, reject) => {
		  	const reader = new FileReader();
		  	reader.readAsDataURL(file);
		  	reader.onload = () => resolve(reader.result);
		  	reader.onerror = error => reject(error);
		});
	}

    componentDidMount() {
       
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

		// 图片数组
		const prefix = 'https://xlbj.wxxinquranqi.online:1243';
		let licensesFileList = [];
		let sfckAgreementsFileList = [];
		let supplyAgreementsFileList = [];
		let sfInformingsFileList = [];
		let signsFileList = [];
		let kitchensFileList = [];
		if(editStatus) {
			formVals.licenses.map(item => {licensesFileList.push({uid: item.id,name: item.basename,url: prefix+item.fileurl,thumbUrl: prefix+item.fileurl,status:'done'})})
			formVals.sfckAgreements.map(item => {sfckAgreementsFileList.push({uid: item.id,name: item.basename,url: prefix+item.fileurl,thumbUrl: prefix+item.fileurl,status:'done'})})
			formVals.supplyAgreements.map(item => {supplyAgreementsFileList.push({uid: item.id,name: item.basename,url: prefix+item.fileurl,thumbUrl: prefix+item.fileurl,status:'done'})})
			formVals.sfInformings.map(item => {sfInformingsFileList.push({uid: item.id,name: item.basename,url: prefix+item.fileurl,thumbUrl: prefix+item.fileurl,status:'done'})})
			formVals.signs.map(item => {signsFileList.push({uid: item.id,name: item.basename,url: prefix+item.fileurl,thumbUrl: prefix+item.fileurl,status:'done'})})
			formVals.kitchens.map(item => {kitchensFileList.push({uid: item.id,name: item.basename,url: prefix+item.fileurl,thumbUrl: prefix+item.fileurl,status:'done'})})		
		}
		
		
		const { previewVisible, previewImage } = this.state;
    	const uploadButton = (
			<Button>
        		<Icon type="upload" /> 上传照片
      		</Button>
		);
		const PicturesWall = (fileList) => (
			<div className="clearfix">
				<Upload
					action="/file/uploadFIlesServer/editorFile/fileUpload/getFileListByMainid"
					listType='picture'
					fileList={fileList}
					className='upload-list-inline'
					onPreview={this.handlePreview}
					onChange={this.handleChange}
				>
          		{ uploadButton }
        		</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
      		</div>
		)
        return (
            <Form layout="inline" align="middle">
				<Row gutter={24}>			    	
                    <Col span={12}>
				      	<FormItem label="单位名称">
				        	{getFieldDecorator('uname',{
                                initialValue: formVals.uname || '',
                                rules: [{ required: true, message: '请输入单位名称' }]
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={12}>
				      	<FormItem label="负责人名称">
				        	{getFieldDecorator('lname',{
                                initialValue: formVals.lname || '',
                                rules: [{ required: true, message: '请输入负责人名称' }]
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={12}>
				      	<FormItem label="负责人电话">
				        	{getFieldDecorator('ltel',{
                                initialValue: formVals.ltel || '',
                                rules: [{ required: true, message: '请输入负责人电话' }]
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={12}>
				      	<FormItem label="经度">
				        	{getFieldDecorator('lng',{
                                initialValue: formVals.lng || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={12}>
				      	<FormItem label="纬度">
				        	{getFieldDecorator('lat',{
                                initialValue: formVals.lat || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={12}>
				      	<FormItem label="区域编码">
				        	{getFieldDecorator('areacode',{
                                initialValue: formVals.areacode || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={12}>
				      	<FormItem label="地址">
				        	{getFieldDecorator('address',{
                                initialValue: formVals.address || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>
                    <Col span={12}>
				      	<FormItem label="单位类别">
				        	{getFieldDecorator('utype',{
                                initialValue: formVals.utypestr || '',
                                rules: [{ required: true, message: '请选择单位类别' }]
				        	})(
                                <Select style={{ width: '100%' }} allowClear size="small">
									{
										utypes.map(item => (
											<Option key={item.type} value={item.type}>{item.name}</Option>
										))
									}						
								</Select>
                            )}
				      	</FormItem>
			    	</Col>
                    <Col span={12}>
				      	<FormItem label="安全员">
				        	{getFieldDecorator('restaurantsafetyofficer',{
                                initialValue: formVals.restaurantsafetyofficer || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>       
                    <Col span={12}>
				      	<FormItem label="规模">
				        	{getFieldDecorator('restaurantsize',{
                                initialValue: formVals.restaurantsize || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>     
                    <Col span={12}>
				      	<FormItem label="经营类型">
				        	{getFieldDecorator('restauranttype',{
                                initialValue: formVals.restauranttype || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>  
                    <Col span={12}>
				      	<FormItem label="备注">
				        	{getFieldDecorator('remark',{
                                initialValue: formVals.remark || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>   
                    <Col span={12}>
				      	<FormItem label="身份信息码">
				        	{getFieldDecorator('restaurantinfoid',{
                                initialValue: formVals.restaurantinfoid || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>    
                    <Col span={12}>
				      	<FormItem label="门牌号">
				        	{getFieldDecorator('restaurantdoorid',{
                                initialValue: formVals.restaurantdoorid || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col> 
                    <Col span={12}>
				      	<FormItem label="第二联系人">
				        	{getFieldDecorator('restaurantpeopleSecond',{
                                initialValue: formVals.restaurantpeopleSecond || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>    
                    <Col span={12}>
				      	<FormItem label="第二联系人电话">
				        	{getFieldDecorator('restauranttelSecond',{
                                initialValue: formVals.restauranttelSecond || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>    
                    <Col span={12}>
				      	<FormItem label="是否使用燃气">
				        	{getFieldDecorator('isusegas',{
                                initialValue: formVals.isusegas || ''
				        	})(
                            <RadioGroup onChange={this.onChange}>
                                <Radio value={0}>未使用</Radio>
                                <Radio value={1}>使用</Radio>                               
                            </RadioGroup>
                            )}
				      	</FormItem>
			    	</Col> 
                    <Col span={12}>
				      	<FormItem label="居民身份信息">
				        	{getFieldDecorator('idnumber',{
                                initialValue: formVals.idnumber || ''
				        	})(<Input size="small"/>)}
				      	</FormItem>
			    	</Col>  
                    <Col span={12}>
				      	<FormItem label="居民头像照片">
				        	{getFieldDecorator('portrait',{
                                initialValue: formVals.portrait || ''
				        	})(PicturesWall(licensesFileList))}
				      	</FormItem>
			    	</Col> 
					<Col span={12}>
				      	<FormItem label="营业执照">
				        	{getFieldDecorator('licenses',{
                                initialValue: formVals.licenses || ''
				        	})(PicturesWall(licensesFileList))}
				      	</FormItem>
			    	</Col> 
					<Col span={12}>
				      	<FormItem label="安全检查协议">
				        	{getFieldDecorator('sfckAgreements',{
                                initialValue:  formVals.sfckAgreements || ''
				        	})(PicturesWall(sfckAgreementsFileList))}
				      	</FormItem>
			    	</Col>
					<Col span={12}>
				      	<FormItem label="供气协议">
				        	{getFieldDecorator('supplyAgreements',{
                                initialValue: JSON.stringify(formVals.supplyAgreements) || ''
				        	})(PicturesWall(supplyAgreementsFileList))}
				      	</FormItem>
			    	</Col>
					<Col span={12}>
				      	<FormItem label="安全告知单">
				        	{getFieldDecorator('sfInformings',{
                                initialValue: formVals.sfInformings  || ''
				        	})(PicturesWall(sfInformingsFileList))}
				      	</FormItem>
			    	</Col>
					<Col span={12}>
				      	<FormItem label="门头情况">
				        	{getFieldDecorator('signs',{
                                initialValue: formVals.signs || ''
				        	})(PicturesWall(signsFileList))}
				      	</FormItem>
			    	</Col>
					<Col span={12}>
				      	<FormItem label="厨房情况">
				        	{getFieldDecorator('kitchens',{
                                initialValue: formVals.kitchens || ''
				        	})(PicturesWall(kitchensFileList))}
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
				handleOk({ ...values, unid: formVals.unid });
			}
		})
    }
	
    render() {
        const { visible, handleCancel } = this.props
		const { editStatus } = this.state
		
        return (
            <Modal             
                className={styles.modal}
                width="1000px"
                title={editStatus?'编辑单位':'新增单位'}
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