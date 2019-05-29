import React,{ PureComponent } from 'react'
import { Table, Row, Col, Form, Input, Select, Button, Rate } from 'antd'
import { connect } from 'dva'
import GridContent from '@/components/PageHeaderWrapper/GridContent'
import TableContent from '@/components/Gas/TableContent/index'
import SearchFormAlarm from './searchForm/SearchFormAlarm'
import SearchFormRepair from './searchForm/SearchFormRepair'
import { isEmpty } from '@/utils/utils'
import styles from './operaman.less'
const FormItem = Form.Item
const { Option } = Select
const { Column, ColumnGroup } = Table


@connect(({ operaman, loading }) => ({
    operaman,    
    workloading: loading.effects['operaman/fetch'],
    repairloading: loading.effects['operaman/fetchRepair'],   
}))
class operamanHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            work: {
                pageNumber: 1,
                pageSize: 10,
                params: {},
            },
            repair: {
                pageNumber: 1,
                pageSize: 10,
                params: {},
            }
        }
    }
    componentDidMount() {
        this.query();
        this.queryRepair();
    }

    query = (params={}) => {
        const { dispatch } = this.props
        const { work:{ pageNumber, pageSize } } = this.state
        dispatch({
            type: 'operaman/fetch',
            payload: {
                pageNumber,
                pageSize,
                ...params,
            }
        })
    }

    queryRepair = (params={}) => {
        const { dispatch } = this.props
        const { repair:{ pageNumber, pageSize } } = this.state
        dispatch({
            type: 'operaman/fetchRepair',
            payload: {
                pageNumber,
                pageSize,
                ...params,
            }
        })
    }

    // 条件模糊搜索报修
    handleSearch = (params={}) => {
        let data = Object.assign({}, this.state.repair, { params: params })
        this.setState({
            repair: data
        })

        this.queryRepair(params);
    }

    // 条件模糊搜索工单
    handleSearchWork = (params={}) => {
        let data = Object.assign({}, this.state.work, { params: params })
        this.setState({
            work: data
        })

        this.query(params);
    }    

    render() {
        const { operaman: { data, dataRepair }, workloading, repairloading } = this.props

        return (
            <GridContent>     
                <TableContent title="泄漏异常报警工单">  
                    <div className={styles.searchForm}> <SearchFormAlarm handleSearch={this.handleSearchWork} /> </div>
                    <div className={styles.tableWrapper}>
                        <Table
                            loading={workloading}
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
                            rowKey='workorderid'
                        >
                            <Column
                                title="工单编号"
                                dataIndex="workorderid"
                                align="center"
                            />
                            <Column
                                title="工单名称"
                                dataIndex="workordername"
                                render={
                                    (text) =>  (
                                        isEmpty(text)
                                    )
                                }
                                align="center"
                            />
                            <Column
                                title="工单状态"                            
                                dataIndex="status"
                                render={
                                    (text) =>  (
                                        isEmpty(text)
                                    )
                                }
                                align="center"
                            />     
                            <Column
                                title="创建开始时间"                            
                                dataIndex="startTime"
                                render={
                                    (text) =>  (
                                        isEmpty(text)
                                    )
                                }
                                align="center"
                            />  
                            <Column
                                title="创建人"                            
                                dataIndex="creatername"
                                render={
                                    (text) =>  (
                                        isEmpty(text)
                                    )
                                }
                                align="center"
                            />  
                            <Column
                                title="接收人"                            
                                dataIndex="receivername"
                                render={
                                    (text) =>  (
                                        isEmpty(text)
                                    )
                                }
                                align="center"
                            />  
                            <ColumnGroup title="内容">
                                <Column
                                    title="设备编号"
                                    dataIndex="mn"
                                    align="center"
                                />
                                <Column
                                    title="归属单位"
                                    dataIndex="unitname"
                                    render={
                                        (text) =>  (
                                            isEmpty(text)
                                        )
                                    }
                                    align="center"
                                />
                                <Column
                                    title="工单内容"                                
                                    dataIndex="content"
                                    render={
                                        (text) =>  (
                                            isEmpty(text)
                                        )
                                    }
                                    align="center"
                                />
                                <Column
                                    title="原因"
                                    dataIndex="reason"
                                    render={
                                        (text) =>  (
                                            isEmpty(text)
                                        )
                                    }
                                    align="center"
                                />
                                <Column
                                    title="处理结果"
                                    dataIndex="result"
                                    render={
                                        (text) =>  (
                                            isEmpty(text)
                                        )
                                    }
                                    align="center"
                                />
                            </ColumnGroup>
                            <Column
                                title="处理时长"                            
                                dataIndex="duration"
                                align="center"
                            />  
                            <Column
                                title="备注"                            
                                dataIndex="remarks"
                                render={
                                    (text) =>  (
                                        isEmpty(text)
                                    )
                                }
                                align="center"
                            />   
                            <Column
                                title="评价"                                                        
                                dataIndex="evaluate"
                                render={
                                    (text) =>  (
                                        <Rate disabled  defaultValue={Number(text)} />
                                    )
                                }
                                align="center"
                            />     
                        </Table>
                    </div>
                </TableContent>                  
                <TableContent title="报修管理">
                    <div className={styles.searchForm}> <SearchFormRepair handleSearch={this.handleSearch} /> </div>
                    <div className={styles.tableWrapper}>
                        <Table
                            loading={repairloading}
                            columns={this.columns} 
                            dataSource={dataRepair.rows}
                            scroll={{ x: true }}
                            pagination={{ 
                                size: 'small',
                                pageSize: Number(dataRepair.pageSize),
                                total: Number(dataRepair.total),
                                current: Number(dataRepair.pageNum),
                                showSizeChanger: true,
                                showQuickJumper: true,
                                pageSizeOptions: ['10', '15', '30'],
                                onChange: this.handlePageChangeRepair,
                                onShowSizeChange: this.handlePageChangeRepair
                            }}
                            rowKey='id'
                        />
                    </div>
                </TableContent>
            </GridContent>
        )
    }

    handlePageChange = (pageNumber, pageSize) => {
        const { work:{ params }} = this.state
        this.query({ ...params, pageNumber, pageSize });
    }

    handlePageChangeRepair = (pageNumber, pageSize) => {
        const { repair:{ params }} = this.state
        this.queryRepair({ ...params, pageNumber, pageSize });
    }

    columns = [
        {
            title: '序号',
            key: 'index',
            width: '5%',
            render: (_,__,i) =>  i+1
        },
        {
            title: '设备编号',
            dataIndex: 'mn',
            width: '10%',
        },
        {
            title: '上报人',
            dataIndex: 'rpName',
            width: '10%',
            render:(text) => isEmpty(text)
        }, 
        {
            title: '上报时间',
            dataIndex: 'rpTime',
            width: '10%',
            render:(text) => isEmpty(text)
        },       
        {
            title: '报修内容',
            dataIndex: 'content',
            width: '10%',
            render:(text) => isEmpty(text)
        }, 
        {
            title: '上传附件',
            dataIndex: 'files',
            width: '10%',
            render:(text) => <img src={text} />
        },
        {
            title: '处理状态',
            dataIndex: 'rpStatus',
            width: '10%',
            render:(text) => isEmpty(text)
        },
        {
            title: '处理人',
            dataIndex: 'handleName',
            width: '10%',
            render:(text) => isEmpty(text)
        },
        {
            title: '处理时间',
            dataIndex: 'modifeTime',
            render:(text) => isEmpty(text)
        },   
    ]
}

export default operamanHome;