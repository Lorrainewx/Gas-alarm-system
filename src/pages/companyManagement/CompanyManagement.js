import React,{ PureComponent } from 'react';
import { Table, Row, Col, Form, Input, Select, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UpdateForm from './UpdateForm';
import styles from './styles.less';
import {isEmpty} from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ company, loading }) => ({
    company,
    loading: loading.effects['company/queryDetail'],
    loadingList: loading.effects['company/query'],
}))
class companyManagement extends PureComponent {
    constructor(props) {
        super(props);
        this.state={
            params: {},
            pageNumber: 1,
            pageSize: 10,
            formVals: {},
        }
    }
    componentDidMount() {
        this.query();
    }

    query = (params = {}) => {
        const { pageNumber, pageSize } = this.state;
		const { dispatch } = this.props;
		dispatch({
			type: 'company/queryDetail',
			payload: {
				pageNumber,
				pageSize,
				...params
			}
		})
    }
    

    render() {
        const { loading, company: { data } } = this.props;   
        const { visible, formVals } = this.state;   
               
        return (
            <GridContent>
				<div className={styles.searchForm}> {this.renderSearchForm()} </div>
                <Table
                    loading = {loading}
                    columns={this.columns} 
                    dataSource={data.list}
                    scroll={{ x: true }}
                    pagination={{ 
                        size: 'small',
                        pageSize: Number(data.pageSize),
                        total: Number(data.total),
                        current: Number(data.pageNum),
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '15', '30'],
                        onChange: this.handlePageChange,
						onShowSizeChange: this.handlePageChange                       
                    }}
                    rowKey='unid'
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

    handleUpdateOk = (formVals) => { // 更新
        const { dispatch, company: { data } } = this.props;
        dispatch({
			type: 'company/update',
			payload: {
				...formVals,
				pageNumber: data.pageNum,
				pageSize: data.pageSize
			}
		}).then(()=>{
			this.handleVisible()
		})
    }

    renderSearchForm = () => {
        const {
            form: { getFieldDecorator },
            company: { data }
        } = this.props;

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

        let manufacturer = data && data.list ? data.list : [];

        return (
            <Form className={styles.searchForm} onSubmit={this.handleSearch} layout="inline">
                <Row>
                    <Col {...layoutCol}>
                        <FormItem label="单位名称" >
							{getFieldDecorator('uname')(
                                <Select style={{ width: '100%' }} allowClear size="small"> 
                                {
                                    manufacturer.map(item => (
                                        <Option value={item.uname} key={item.unid}>{item.uname}</Option>
                                    ))
                                }
                                </Select>   
                            )}
						</FormItem>
                    </Col>
                    <Col {...layoutCol}>
                        <FormItem label="负责人姓名" >
							{getFieldDecorator('lname')(                               
                                <Input size="small" />
                            )}
						</FormItem>
                    </Col>
                    <div style={{ margin: '16px 0 24px' }}>
						<Button className={styles.successfulBtn} htmlType="submit" size="small" type="primary"  style={{ ...boxStyle }}> 查询 </Button>
						<Button className={styles.primaryBtn} onClick={() => this.handleVisible(true)} size="small"> 添加单位 </Button>
					</div>
                </Row>                
            </Form>
        )
    }   

    handleSearch = (e) => {
        e.preventDefault();

		this.props.form.validateFields((err, values) => {
			if (!err) {
                this.setState({
                    params: { ...values }
                })
                this.query({...values});

                this.props.form.resetFields();
			}
		});
    }

    handlePageChange = (pageNumber, pageSize) => {
        const { params } = this.state;
        this.query({ ...params, pageNumber, pageSize });
    }

    handleVisible = (visible=false, formVals={}) => {
        this.setState({ 
            visible, 
            formVals 
        })
	}

    handleDelete = (unid) => {
        const { dispatch, company: { data } } = this.props;        
        dispatch({
            type: 'company/delete',
			payload: {
				unid,
                pageNumber: data.pageNum,
                pageSize: data.pageSize
			}            
        })        
    }

    columns = [
        {
            title: '序号',
            key: 'index',
            width: '5%',
            render: (_,__,i) =>  i+1
        },
        {
            title: '单位类别',
            dataIndex: 'utypestr',
            width: '10%',
            render: (text) => isEmpty(text)
        },
        {
            title: '详细地址',
            dataIndex: 'address',
            width: '10%',
            render: (text) => isEmpty(text)
        }, 
        {
            title: '所属区域',
            dataIndex: 'areaname',
            width: '10%',
            render: (text) => isEmpty(text)
        },
        {
            title: '名称',
            dataIndex: 'uname',
            width: '15%',
            render: (text) => isEmpty(text)
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
				<div>
					<Button size="small" className={styles.primaryBtn} onClick={() => this.handleVisible(true, record)} style={{ marginRight: '10px' }}>编辑</Button>
					<Popconfirm title="确定删除该记录吗？" onConfirm={() => this.handleDelete(record.unid)} okText="是" cancelText="否">
						<Button size="small">删除</Button>
					</Popconfirm>
				</div>
			)
        }
    ]
}

export default companyManagement;


