import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table, Tabs, Dropdown, Menu, Button, Icon, DatePicker, Spin } from 'antd';
import moment from 'moment';
import Link from 'umi/link';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Line from '@/components/Gas/Charts/Line';
import Pie from '@/components/Gas/Charts/Pie';
import Bar from '@/components/Gas/Charts/Bar';
import { getMonth } from '@/utils/utils';
import { omit } from 'lodash';

import styles from './projectLeader.less';
import icon1 from '../../assets/01.png';
import icon2 from '../../assets/02.png';
import icon3 from '../../assets/03.png';
import icon4 from '../../assets/icon_normal.png';
import icon5 from '../../assets/05.png';
import icon6 from '../../assets/06.png';
import icon7 from '../../assets/07.png';
import icon8 from '../../assets/08.png';
import icon9 from '../../assets/icon_using.png';

const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const tabBar = {
    tabBarGutter: 6,
    tabBarStyle: {
        color: '#fff',
        backgroundColor: '#293146',
        margin: 0,
        paddingBottom: '19px'
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

const CardHeader = ({ title='-', children, highlight=false }) => (
    <div className={styles.cardHeader}>
        <span style={highlight?{color: '#60D795'}:{}}>{title}</span>
        {children}
    </div>
)

@connect(({ dashboard, project, loading }) => ({
    dashboard,
    project,
    sendDataLoading: loading.effects['dashboard/sendsData'],
}))
class projectLeaderHome extends PureComponent{
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

            warnCauseData: [],  // 预警处理原因
            warnReasonData: [], // 离线处理原因
            dropCauseData: [],  // 预警处理方式
            dropReasonData: [], // 离线处理方式
            warnWorkOrderData: [],  // 报警工单数量
            dropWorkOrderData: [],  // 离线工单数量
            warnstaticsloading: true,
            warnstaticshandleloading: true,
            warnorderloading: true,
            dropstaticsloading: true,
            dropstaticshandleloading: true,
            droporderloading: true,

        };
    }
    componentDidMount(){
        
        const { serverTabKey } = this.state
        
        this.querySendChartData()
        this.handleServerTabChange(serverTabKey)
        this.queryDashboard()

        this.queryStatics('warn')
        this.queryStatics('dropped')
        this.queryStaticsHandle('warn')
        this.queryStaticsHandle('dropped')
        this.queryOrderStatic('warn')
        this.queryOrderStatic('dropped')

        this.handleControlPanel()
        
    }
    handleControlPanel = () => {
        const { dispatch } = this.props
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
    // 原因统计
    queryStatics = (workordertype, params={}) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'project/statics',
            payload: {
                workordertype,
                ...params,
            },
            callback: () => {
                const { staticsData } = this.props.project
                workordertype==='warn'?
                    this.setState({warnCauseData: staticsData, warnstaticsloading: false}):
                    this.setState({dropCauseData: staticsData, dropstaticsloading: false})
            }
        })
    }
    // 处理统计
    queryStaticsHandle = (workordertype, params={}) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'project/handle',
            payload: {
                workordertype,
                ...params,
            },
            callback:() => {
                const { staticsHandleData } = this.props.project
                workordertype==='warn'?
                this.setState({warnReasonData: staticsHandleData,warnstaticshandleloading: false}):
                this.setState({dropReasonData: staticsHandleData, dropstaticshandleloading: false})
            }
        })        
    }
    // 工单数量统计
    queryOrderStatic = (workordertype, params={}) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'project/queryOrderData',
            payload: {
                workordertype,
                ...params,
            },
            callback: () => {
                const { workOrderData } = this.props.project
                workordertype==='warn'?
                this.setState({warnWorkOrderData: workOrderData, warnorderloading: false}):
                this.setState({dropWorkOrderData: workOrderData, droporderloading: false})
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

    queryDashboard = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'project/dashboard'
        })
    }

    handleDateOnChange = (dates, dateStrings, warn, type) => {
        const params = {startTime: dateStrings[0], endTime: dateStrings[1]}
        if(type === 'work') {
            // 工单请求
            this.queryOrderStatic(warn,{...params})
        }else if(type === 'cause') {
            // 原因统计
            this.queryStatics(warn,{...params})
        }else if(type === 'handle') {
            // 处理统计
            this.queryStaticsHandle(warn, { ...params })
        }
    }
    
    render(){
        const { 
            sendTabKey, 
            serverTabKey, 
            monthCurrent, 
            warnCauseData, 
            dropCauseData, 
            dropReasonData, 
            warnReasonData,
            warnWorkOrderData,
            dropWorkOrderData, 
            warnstaticsloading,
            warnstaticshandleloading,
            warnorderloading,
            dropstaticsloading,
            dropstaticshandleloading,
            droporderloading,
        } = this.state;

        const { 
            dashboard, 
            sendDataLoading, 
            project, 
        } = this.props; 

        const {
            data: mainInfoData,
            staticsHandleData,
            staticsData,
        } = project;

        const { sendsChart, serviceData } = dashboard; 
        
        const cardStyle = {
            bordered: false,
            style: {
                backgroundColor: '#202737',
                minHeight: 271,
                marginTop: 16
            },
            bodyStyle: {
                padding: '0'
            }
        };

        const dateFormat = 'YYYY-MM-DD HH:mm:ss';

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
     
        const layoutSquareCard = {
            xl: 2,
            xs: 12
        }
        
        // 泄漏报警类别统计
        let warningCauseType = {}
        warnCauseData.map(item => warningCauseType[item.desc] = Number(item.value))
        // 报警处理方式统计
        let warningReasonType = {}
        warnReasonData.map(item => warningReasonType[item.desc] = Number(item.value))

        // 离线原因统计
        let dropCauseType = {}
        dropCauseData.map(item => dropCauseType[item.desc] = Number(item.value))
        // 离线处理方式
        let dropReasonType = {}
        dropReasonData.map(item => dropReasonType[item.desc] = Number(item.value))

        // 预警工单数量统计
        let warnworkType = {}
        warnWorkOrderData.map(item => warnworkType[item.desc] = Number(item.value))
        
        // 离线工单数量统计
        let dropworkType = {}
        dropWorkOrderData.map(item => dropworkType[item.desc] = Number(item.value))
       

        return (
            <GridContent offset={false}>            
                <div className={styles.body}>                    
                    <Row gutter={20}>
                        <Col xl={14} xs={24} >
                            <div className={styles.baseInfo}>
                                <h3>项目简介</h3>
                                <p>无锡市燃气泄漏报警平台是非常重要的燃气安全管理平台，
                                通过气体传感器探测周围环境中的低浓度可燃气体，通过采样电路，
                                在传感器表面产生化学反应或电化学反应，造成传感器的点物理特性的改变触发报警，以便及时处理。</p>
                            </div>
                        </Col>
                        <Col {...layoutSquareCard} >
                            <SquareCard name='设备总数' icon={icon1} data={mainInfoData.machineSize} />
                        </Col>
                        <Col {...layoutSquareCard} >
                            <SquareCard name='离线状态' icon={icon2} data={mainInfoData.machineOffLineSize} />
                        </Col>
                        <Col {...layoutSquareCard} >
                            <SquareCard name='报警状态' icon={icon3} data={mainInfoData.machineWarnSize} />
                        </Col>
                        <Col {...layoutSquareCard} >
                            <SquareCard name='正常状态' icon={icon4} data={mainInfoData.noWarnSize} />
                        </Col>
                        <Col {...layoutSquareCard} >
                            <SquareCard name='使用中总数' icon={icon9} data={mainInfoData.usedSize} />
                        </Col>                                                  
                    </Row>
                    <Row gutter={20}>
                        <Col xl={12} md={12}>   
                            <Card {...cardStyle}>
                                <CardHeader title='泄漏报警异常工单数量统计' highlight={true}>  
                                    <div className={styles.rangeItem}>
                                        <label>选择时间 :</label>                                  
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
                                            onChange={(date, dateStrings) => this.handleDateOnChange(date, dateStrings, 'warn', 'work')}
                                        />
                                    </div>                                    
                                </CardHeader>
                                <Spin spinning={warnorderloading}> <Bar data={omit(warnworkType, ['总量'])} /> </Spin>
                            </Card>  
                        </Col>
                        <Col xl={6} md={12}>
                            <Card {...cardStyle}>
                                <CardHeader title='泄漏报警类别统计'>
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
                                            onChange={(date, dateStrings) => this.handleDateOnChange(date, dateStrings, 'warn', 'cause')}
                                        />
                                </CardHeader>
                                <Spin spinning={warnstaticsloading}> <Pie data={warningCauseType}/> </Spin>
                            </Card>
                        </Col>
                        <Col xl={6} md={12}>
                            <Card {...cardStyle}>
                                <CardHeader title='报警处理方式统计'>                                
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
                                        onChange={(date, dateStrings) => this.handleDateOnChange(date, dateStrings, 'warn', 'handle')}
                                    />
                                </CardHeader>
                                <Spin spinning={warnstaticshandleloading}> <Pie data={warningReasonType}/> </Spin>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col xl={12} md={12}>
                            <Card {...cardStyle}>
                                <CardHeader title='报修统计' highlight={true}>
                                    <div className={styles.rangeItem}>
                                        <label>选择时间 :</label>                                  
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
                                            onChange={(date, dateStrings) => this.handleDateOnChange(date, dateStrings, 'dropped', 'work')}
                                        />
                                    </div>       
                                </CardHeader>
                                <Spin spinning={droporderloading}> <Bar data={omit(dropworkType, ['总量'])} /> </Spin>
                            </Card> 
                        </Col>
                        <Col xl={6} md={12}>
                            <Card {...cardStyle}>
                                <CardHeader title='离线原因统计'>
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
                                        onChange={(date, dateStrings) => this.handleDateOnChange(date, dateStrings, 'dropped', 'cause')}
                                    />
                                </CardHeader>
                                <Spin spinning={dropstaticsloading}> <Pie data={dropCauseType}/> </Spin>
                            </Card>
                        </Col>
                        <Col xl={6} md={12}>
                            <Card {...cardStyle}>
                                <CardHeader title='离线处理方式'>
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
                                        onChange={(date, dateStrings) => this.handleDateOnChange(date, dateStrings, 'dropped', 'handle')}
                                    />
                                </CardHeader>                                
                                <Spin spinning={dropstaticshandleloading}> <Pie data={dropReasonType}/> </Spin>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={20}>                  
                        <Col lg={24} sm={24}>
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
                    </Row>
                </div>
            </GridContent>
        )
    }
}

export default projectLeaderHome;