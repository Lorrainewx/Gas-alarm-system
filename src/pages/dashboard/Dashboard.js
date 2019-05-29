import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table, Tabs, Dropdown, Menu, Button, Icon, DatePicker, Spin } from 'antd';
import moment from 'moment';
import Link from 'umi/link';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Line from '@/components/Gas/Charts/Line';
import Pie from '@/components/Gas/Charts/Pie';
import ServiceBox from './ServiceBox';
import { getMonth } from '@/utils/utils';
import Authorized from '@/utils/Authorized';
import { getAuthority } from '@/utils/authority';

import styles from './Dashboard.less';
import icon1 from '../../assets/01.png';
import icon2 from '../../assets/02.png';
import icon3 from '../../assets/03.png';
import icon4 from '../../assets/04.png';
import icon5 from '../../assets/05.png';
import icon6 from '../../assets/06.png';
import icon7 from '../../assets/07.png';
import icon8 from '../../assets/08.png';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const tabBar = {
    tabBarGutter: 6,
    tabBarStyle: {
        color: '#fff',
        backgroundColor: '#293146',
    }
}

const months = [
    {title: '一月', time: '01'}, {title: '二月', time: '02'}, 
    {title: '三月', time: '03'}, {title: '四月', time: '04'},
    {title: '五月', time: '05'}, {title: '六月', time: '06'}, 
    {title: '七月', time: '07'}, {title: '八月', time: '08'}, 
    {title: '九月', time: '09'}, {title: '十月', time: '10'}, 
    {title: '十一月', time: '11'}, {title: '十二月', time: '12'}
];

const SquareCard = ({ name, icon, data, type }) => (
    <div className={ `${styles.squareBox} ${type === 'rect'?styles.rect: ''}` }>
        <div className={ styles.content }>
            <img className={ styles.boxIcon } src={icon} alt={name}/>
            <div>{ type === 'rect' ? name : data }</div>
        </div>
        <div className={ styles.footer }>{ type === 'rect' ? data : name }</div>
    </div>
);

const CardHeader = ({ title='-', children }) => (
    <div className={styles.cardHeader}>
        <span>{title}</span>
        {children}
    </div>
)

const tableColumns1 = [{
    title: '序号',
    key: 'index',
    render: (_, __, i)=> i+1,
    width: '10%',
},{
    title: '工单编号',
    dataIndex: 'id',
    width: '20%',
},{
    title: '运维人员',
    dataIndex: 'name',
    width: '20%',
},{
    title: '事件类型',
    dataIndex: 'type',
    width: '20%',
},{
    title: '提交时间',
    dataIndex: 'time',
}];

const tableData = [{
    id: '12344511',
    name: '骆颖',
    service: '数据接收服务',
    type: '换气',
    time: '2019-04-10 14:45:23',
    state: false,
    progress: 68
}, {
    id: '12344512',
    name: '刘驰',
    service: '数据接收服务',
    type: '换气',
    time: '2019-04-10 09:14:53',
    state: true,
    progress: 30
}, {
    id: '12344513',
    name: '吴杰',
    service: '数据接收服务',
    type: '换气',
    time: '2019-04-10 13:15:48',
    state: false,
    progress: 50
}, {
    id: '12344514',
    name: '孙梦金',
    service: '数据接收服务',
    type: '换气',
    time: '2019-04-10 08:11:25',
    state: false,
    progress: 50
}];

@connect(({ dashboard, loading }) => ({
    dashboard,
    
    sendDataLoading: loading.effects['dashboard/sendsData'],
    serviceLoading: loading.effects['dashboard/service'],
    workorderloading: loading.effects['dashboard/orderData'],
}))
class Dashboard extends PureComponent{
    constructor(props){
        super(props);

        this.state = {
            visible: false,

            sendTabKey: 'message',
            monthCurrent: months[new Date().getMonth()].title,
            sendStartTime: getMonth()[0],
            sendEndTime: getMonth()[1],

            serverTabKey: 'gasReceiveServer',

            sendChartsList: [],
            totalSendNum: 0,
        };
    }
    componentDidMount(){        
        const { serverTabKey } = this.state;        
        this.querySendChartData();
        this.handleServerTabChange(serverTabKey);
        this.queryWorkOrder('warn');   
        this.queryControlPanelList();            
    }
    queryControlPanelList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dashboard/controlPanelList'
        })
    }
    handleServerTabChange = (serverTabKey)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'dashboard/service',
            payload: {
                service: serverTabKey
            }
        })
        this.setState({
            serverTabKey
        })
    }
    handleSendTabChange = (sendTabKey)=>{
        this.setState({
            sendTabKey
        }, ()=>{
            this.querySendChartData()
        })
    }
    handleSendTimeChange = (val)=>{
        const month = months[val.key];
        this.setState({
            monthCurrent: month.title,
            sendStartTime: getMonth(month.time)[0],
            sendEndTime: getMonth(month.time)[1],
        }, ()=>{
            this.querySendChartData()
        })
    }
    querySendChartData = ()=>{
        const { dispatch } = this.props;
        const { sendTabKey, sendStartTime, sendEndTime } = this.state;
        dispatch({
            type: 'dashboard/sendsData',
            payload: {
                sendType: sendTabKey,
                startTime: sendStartTime,
                endTime: sendEndTime
            }
        })
    }
    dropDownOfMonths = ()=>{
        const { monthCurrent } = this.state;
        const menu = (
            <Menu onClick={this.handleSendTimeChange}>
                {
                    months.map((item, i)=>(
                        <Menu.Item key={i}>{item.title}</Menu.Item>
                    ))
                }
            </Menu>
        );
        return (
            <Dropdown overlay={menu}>
                <Button size='small' style={{ border: '1px solid #fff', borderRadius: 4, color: '#fff' }}>
                    { monthCurrent } <Icon type="down" />
                </Button>
            </Dropdown>
        )
    }
    toArray = (obj)=>{
        let arr = [];
        for(let i in obj){
            arr.push({
                ...obj[i],
                title: i
            })
        }
        return arr;
    }
    queryWorkOrder = (workordertype, params={}) => {
        // 工单处理统计
        const { dispatch } = this.props;
        dispatch({
            type: 'dashboard/orderData',
            payload: {
                workordertype,
                ...params,
            }
        })
    }
    handleDateOnChange = (dates, dateStrings, warn) => {
        const params = {startTime: dateStrings[0], endTime: dateStrings[1]}       
        // 工单请求
        this.queryWorkOrder(warn,{...params})
    }

    render(){
        const { sendTabKey, serverTabKey, monthCurrent } = this.state;
        const { dashboard, sendDataLoading, serviceLoading, workorderloading } = this.props;          

        const {
            emStatistics: {
                total,
                outline,
                warming,
                unuse
            },
            receiveTotal,
            transferTotal,
            focusTotal,
            optionalTotal,
            workOrderData,
            sendsChart,
            serviceData,
            workOrderList
        } = dashboard;    
        
        // 工单处理类别统计
        let workType = {}
        workOrderData.map(item => workType[item.desc] = Number(item.value))

        const cardStyle = {
            bordered: false,
            style: {
                backgroundColor: '#202737',
                minHeight: 267,
                marginTop: 16
            },
            bodyStyle: {
                padding: '0'
            }
        };

        const dateFormat = 'YYYY/MM/DD HH:mm:ss';

        const x = [
            '01','02','03','04','05','06','07',
            '08','09','10','11','12','13','14',
            '15','16','17','18','19','20','21',
            '22','23','24','25','26','27','28',
            '29','30','31'
        ];

        const lineChartsAttr = {
            xAxisText: '日期',
            yAxisText: '发送量',
            subTitle: '发送总量',
        }

        const sdDetails = serviceData ? serviceData.details : {};


        const { controlPanelData } = this.props.dashboard;

        const { machineOffLineSize, noUsedSize, machineSize, operationManSize, wechatSize } = controlPanelData;

        const { data } = Object.keys(sendsChart).length && sendsChart;
        const { arrs: sendChartsList, totalSendNum } = !!data && data;
        
        let x_New = [];
        let y_New = [];
        if(!!sendChartsList) {
            sendChartsList.map(item => {
                x_New.push(item[0]);
                y_New.push(item[1]===""?0:item[1]);
            })
        }

        const operamanStyleLRow = {
            float: 'left',
            paddingRight: '10px',
            width: '40%',
            marginRight: 0,
            marginLeft: 0
        }

        const operamanStyleRRow = {
            float: 'right',
            paddingLeft: '10px',
            width: '60%',
            marginRight: 0,
            marginLeft: 0
        }

        const notadminStyleRow = {
            marginLeft: '-20px',
            marginRight: '-20px'
        }
        

        return (
            <GridContent offset={false}>
                <div className={styles.body}>                    
                    <Row gutter={20}>
                        <Col xl={10} md={24} >
                            <Col sm={6} xs={12}>
                                <SquareCard name='设备总数' icon={icon1} data={machineSize} />
                            </Col>
                            <Col sm={6} xs={12}>
                                <SquareCard name='离线状态' icon={icon2} data={machineOffLineSize} />
                            </Col>
                            <Col sm={6} xs={12}>
                                <SquareCard name='报警状态' icon={icon3} data={machineOffLineSize} />
                            </Col>
                            <Col sm={6} xs={12}>
                                <SquareCard name='不使用状态' icon={icon4} data={noUsedSize} />
                            </Col>
                        </Col>
                        <Col xl={7} md={12} xs={24}>
                            <Row>
                                <SquareCard name='数据接收总量' icon={icon8} data={receiveTotal} type='rect' />
                            </Row>
                            <Row>
                                <SquareCard name='微信关注总量' icon={icon7} data={wechatSize} type='rect' />
                            </Row>
                        </Col>

                        <Col xl={7} md={12} xs={24}>
                            <Row>
                                <SquareCard name='数据中转总量' icon={icon5} data={focusTotal} type='rect' />
                            </Row>
                            <Row>
                                <SquareCard name='运维人员数量' icon={icon6} data={operationManSize} type='rect' />
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col xl={17} md={12}>
                            <Card
                                {...cardStyle}
                            >
                                <Spin spinning={sendDataLoading}>
                                    <Tabs
                                        {...tabBar}
                                        activeKey={sendTabKey}
                                        onChange={key => this.handleSendTabChange(key)}
                                        tabBarExtraContent={this.dropDownOfMonths()}
                                    >
                                        <TabPane tab="短信" key="message">
                                            <Line title={monthCurrent + '发送量趋势图'} x={x_New} y={y_New} {...lineChartsAttr}/>
                                        </TabPane>
                                        <TabPane tab="微信" key="wechat">
                                            <Line title={monthCurrent + '发送量趋势图'} x={x_New} y={y_New} {...lineChartsAttr}/>
                                        </TabPane>
                                        <TabPane tab="APP通知" key="gas-sms-jpush">
                                            <Line title={monthCurrent + '发送量趋势图'} x={x_New} y={y_New} {...lineChartsAttr}/>
                                        </TabPane>
                                        <TabPane tab="电话" key="telephone">
                                            <Line title={monthCurrent +'发送量趋势图'} x={x_New} y={y_New} {...lineChartsAttr}/>
                                        </TabPane>
                                    </Tabs>
                                </Spin>
                            </Card>
                        </Col>
                        <Col xl={7} md={12}>
                            <Card 
                                {...cardStyle}
                            >
                                <CardHeader title='工单处理类型'>
                                    <RangePicker
                                        className={ styles.picker }     
                                        style={{ width: '200px', display: 'inline-block' }}                                       
                                        format={dateFormat}
                                        size="small"     
                                        ranges={{
                                            Today: [
                                                moment(), moment()
                                            ],
                                            'this month': [
                                                moment().startOf('month'),
                                                moment().endOf('month')
                                            ]
                                        }}
                                        showTime                                            
                                        onChange={(date, dateStrings) => this.handleDateOnChange(date, dateStrings, 'warn')}
                                    />
                                </CardHeader>
                                <Spin spinning={workorderloading}> <Pie data={workType} height={310}/> </Spin>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={20}>                  
                        <Col lg={12} sm={24}>
                            <Card
                                {...cardStyle}
                            >
                                <Table columns={tableColumns1} dataSource={tableData} pagination={false} scroll={{ y: 217 }} rowKey='id' />
                            </Card>
                        </Col>
                        <Col lg={12} sm={24}>
                            <Card
                                {...cardStyle}
                            >
                                <Spin spinning={serviceLoading} >
                                    <Tabs
                                        {...tabBar}
                                        activeKey={serverTabKey}
                                        onChange={key => this.handleServerTabChange(key)}
                                        tabBarExtraContent={(
                                            <Link to={`/service?type=${serverTabKey}`} target="_blank">
                                                <Icon type="info-circle" />
                                            </Link>
                                        )}
                                    >
                                        <TabPane tab="数据接收服务" key="gasReceiveServer">
                                            <ServiceBox data={this.toArray(sdDetails)}/>
                                        </TabPane>
                                        <TabPane tab="数据预警服务" key="gasParsedServer">
                                            <ServiceBox data={this.toArray(sdDetails)}/>
                                        </TabPane>
                                        <TabPane tab="数据处理服务" key="gasSmsServer">
                                            <ServiceBox data={this.toArray(sdDetails)}/>
                                        </TabPane>
                                    </Tabs>
                                </Spin>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </GridContent>
        )
    }
}

export default Dashboard;