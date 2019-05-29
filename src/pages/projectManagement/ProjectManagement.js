import React, {PureComponent} from 'react';
import { Table, Row, Col, Form, Input, Select, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UpdateForm from './UpdateForm';
import {isEmpty} from '@/utils/utils';
import styles from './styles.less';

const FormItem = Form.Item;
const {Option} = Select;

@Form.create()
@connect(({ project, loading }) => ({
    project,
    loading: loading.models.project
}))

class projectManagement extends PureComponent {
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
        const { pageSize, pageNumber } = this.state;
        const { dispatch } = this.props;
        dispatch({
			type: 'project/fetch',
			payload: {
				pageNumber,
				pageSize,
				...params
			}
		})      
    }
    render() {
        const { project: { data }, loading } = this.props
        const { formVals, visible } = this.state

        return (
            <GridContent>
                <div className={styles.searchForm}>
                    {this.renderSearchForm()}
                </div>
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
                    rowKey='proid'/>

                    <UpdateForm 
                        visible={visible}
                        formVals={formVals}
                        handleOk={this.handleUpdateOk}
                        handleCancel={this.handleVisible}
                    />
            </GridContent>
        )
    }
    handleUpdateOk = (formVals) => {
        const { dispatch, project: { data } } = this.props;
        dispatch({
			type: 'project/update',
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
            form: {
                getFieldDecorator
            }
        } = this.props;

        const layoutCol = {
            xl: 4,
            lg: 6,
            md: 12,
            sm: 24
        }
        const layoutColExtra = {
            xl: 6,
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
            <Form
                className={styles.searchForm}
                onSubmit={this.handleSearch}
                layout="inline">
                <Row>
                    <Col {...layoutCol}>
                        <FormItem label="所属项目">
                            {getFieldDecorator('proname')(<Input size="small"/>)}
                        </FormItem>
                    </Col>
                    <Col {...layoutCol}>
                        <FormItem label="项目负责人">
                            {getFieldDecorator('proleader')(<Input size="small"/>)}
                        </FormItem>
                    </Col>
                    <Col {...layoutColExtra}>
                        <FormItem label="项目负责人电话">
                            {getFieldDecorator('protel')(<Input size="small"/>)}
                        </FormItem>
                    </Col>
                    <div
                        style={{
                            margin: '16px 0 24px'
                        }}
                    >
                        <Button className={styles.successfulBtn} htmlType="submit" size="small" type="primary" style={{ ...boxStyle }}> 查询 </Button>
                        <Button className={styles.primaryBtn} onClick={() => this.handleVisible(true)} size="small"> 添加项目 </Button>
                    </div>
                </Row>
            </Form>
        )  
    }

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ params: { ...values } })
                this.query({...values});

                this.props.form.resetFields();
            }
        });
    }

    handlePageChange = (pageNumber, pageSize) => {
        console.log(pageNumber, pageSize);
    }

    handleVisible = (visible=false, formVals={}) => {
        this.setState({visible, formVals});
    }

    handleDelete = (proid, leaccount) => {
        const { dispatch, project: { data } } = this.props;        
        dispatch({
            type: 'project/delete',
			payload: {
                proid,
                leaccount,
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
            render: (_, __, i) => i + 1
        }, {
            title: '项目名称',
            dataIndex: 'proname',
            width: '10%',
            render: (text) => isEmpty(text)
        }, {
            title: '负责人姓名',
            dataIndex: 'proleader',
            width: '10%',
            render: (text) => isEmpty(text)
        }, {
            title: '电话',
            dataIndex: 'protel',
            width: '10%',
            render: (text) => isEmpty(text)
        }, {
            title: '创建时间',
            dataIndex: 'createdate',
            width: '10%',
            render: (text) => isEmpty(text)
        }, {
            title: '项目负责人账号',
            dataIndex: 'username',
            render: (text) => isEmpty(text)
        }, {
            title: '操作',
            key: 'action',
            render: (_, record) => (
				<div>
					<Button size="small" className={styles.primaryBtn} onClick={() => this.handleVisible(true, record)} style={{ marginRight: '10px' }}>编辑</Button>
					<Popconfirm title="确定删除该记录吗？" onConfirm={() => this.handleDelete(record.proid, record.leaccount)} okText="是" cancelText="否">
						<Button size="small">删除</Button>
					</Popconfirm>
				</div>
			)
        }
    ]
}

export default projectManagement;
