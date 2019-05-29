import react, { Component } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ServiceBox from '../dashboard/ServiceBox';
import Styles from './ServiceDetail.less';
import JSONTree from 'react-json-tree';
import Websocket  from 'react-websocket';

@connect(({ dashboard, servicedetail })=>({
    dashboard,
    servicedetail
}))
class ServiceDetail extends Component {   
    state = {
        msgList: [],
        metricsList: [],
        metricsDetailList: [],
        jsontreeloading: true,
        metricsinfoloading: true,
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps !== this.props || (nextState !== this.state)) {
            return true;
        }else return false;
    }
    componentDidMount(){
        this.queryService();    // 服务数据
        this.getMetrics();      // 节点数据
        this.getjvmData();      // jvm数据  
    }
    queryService = () => {
        const { dispatch, location: { query } } = this.props;
        dispatch({
            type: 'dashboard/service',
            payload: {
                service: query.type
            }
        })
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
    pushEqdata(msg) {  
        const { msgList } = this.state;
        msgList.push(msg);      
        this.setState({
            msgList
        })
    }    
    getMetrics = () => {    // 获取系列节点
        const { dispatch } = this.props;
        dispatch({
            type: 'servicedetail/service',
            callback: () => {
                const { servicedetail: { metricsData } } = this.props;
                const { names: metricsList } = metricsData;
                if(metricsList) {
                    this.setState({
                        metricsList
                    })
                    metricsList.map((item, i) => {
                        this.getMetricItem(item);
                    })
                }  
            }
        });      
    }
    getMetricItem = (name) => { // 获取该节点详细信息
        const { dispatch } = this.props;
        dispatch({
            type: 'servicedetail/fetchItemInfo',
            payload: {
                metricName: name
            },
            callback: () => {
                const { servicedetail: { metricItem } } = this.props;
                this.pushMeData(metricItem);
                this.setState({
                    metricsinfoloading: false
                })
            }
        });
    }
    getjvmData = () => {    // 获取jvm数据
        const { dispatch } = this.props;
        dispatch({
            type: 'servicedetail/fetchjvm',
            callback: () => {
                this.setState({
                    jsontreeloading: false
                })
            }
        });
    }
    pushMeData = (item) => {
        const { metricsDetailList, metricsList } = this.state; 
        metricsDetailList.push(item);            
    }   

    render () {
        const { servicedetail ,dashboard, location: { query } } = this.props;
        const {
            serviceData,
        } = dashboard;

        const sdDetails = serviceData ? serviceData.details : {};
        const service = query.type;
        
        const boxStyle = {
            margin: '16px 0'
        };

        const { metricsDetailList, msgList } = this.state; 
        console.log(msgList);
       
       const DOM = document.getElementById('websocketContainer') || null;
       if(DOM) {
            console.log(DOM.childNodes.item(0).scrollHeight,DOM.childNodes.item(0).scrollHeight-50)
            DOM.scrollTop =  DOM.childNodes.item(0).scrollHeight;
            console.log(DOM.scrollTop, DOM.scrollHeight);            
       }
       
        const { jvmData } = servicedetail;        

        const settings = {
            dots: false,
            arrows: true,
            autoplay: true,
            infinite: false,
            autoplaySpeed: 1000,
            slidesToShow: 5,
            slidesToScroll: 1,
            vertical: true,
        }

        return (
            <GridContent>
                <div style={boxStyle}>
                    <Row gutter={32}>
                        <Col sm={24} lg={13}>
                            <Card bordered={false} style={{height:'221px', marginBottom: '30px'}}>
                                <ServiceBox data={this.toArray(sdDetails)}/>
                            </Card>
                            <Card bordered={false} style={{height: '221px', overflowY: 'auto'}}>
                                <Spin spinning={this.state.metricsinfoloading}>
                                    {
                                        metricsDetailList.map((item, i) => (<div className={Styles.infoItem} key={i}>{item.name} <span className={Styles.value}>{item.measurements[0].value}</span> {item.baseUnit}</div>))
                                    }
                                </Spin>
                            </Card>
                            
                        </Col>
                        <Col sm={24} lg={11}>                 
                            <div className={Styles.jvmContainer}>
                                <Spin spinning={this.state.jsontreeloading}>
                                    <JSONTree
                                        data={jvmData}                                   
                                        shouldExpandNode={() => {
                                            return true;
                                        }}
                                    />
                                </Spin>  
                            </div>
                        </Col>
                    </Row> 
                </div>
                <div style={boxStyle}>
                    {/*<Card bordered={false} bodyStyle={{ padding: 0 }}>
                         <iframe 
                            src={`https://xlbj.wxxinquranqi.online/${service}/log.html`}
                            frameBorder='0'
                            width='100%'
                            height='500px'
                            scrolling='auto'
                        ></iframe> 
                    </Card>*/}
                </div>

                {/* <SockJsClient //https://xlbj.wxxinquranqi.online/gasSmsServer
					url='ws://192.168.1.242:1248/websocket' topics={['/pullLogger']}
		            onMessage={ (msg) => this.pushEqdata(msg) }
				 	ref={ (client) => { this.clientRef = client }} 
				/> */}

                <Websocket url='ws://192.168.1.242:1248/websocket/pullLogger'
                    onMessage={ this.pushEqdata.bind(this) }/>

                {
                    <div className={Styles.websocketContainer} id="websocketContainer"><div> {this.state.msgList.map((item,i) => (<div key={i}>{item}</div>))}  </div></div>
                }  
            </GridContent>
        )
    }
}

export default ServiceDetail;