import React, { Component } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import './echarts/bmap';
import './echarts/world';
import './echarts/china';
import SockJsClient from 'react-stomp';
import { isEmpty } from '@/utils/utils';
import Link from 'umi/link';
import { Row, Col, Card, Table, Badge } from 'antd';
import styles from './OperationPlatform.less';

import icon1 from '../../assets/05.png';
import icon2 from '../../assets/06.png';
import icon3 from '../../assets/07.png';
import icon4 from '../../assets/08.png';

let timer = null; 

const SquareCard = ({ name, icon, data, type }) => (
    <div className={ styles.squareBox }>
        <img className={ styles.boxIcon } src={icon} alt={name}/>
        <div className={ styles.name }>{ name }</div>
        <div className={ styles.footer }>{ data }</div>
    </div>
);

const warnstatus = {
	'nowarn': 'success',
	'dropped': 'error',
	'warn1': 'warning',
	'warn2': 'warning',
	'warn3': 'warning',
}

const warnstatusstr = {
	'nowarn': '正常',
	'dropped': '离线',
	'warn1': '一级预警',
	'warn2': '二级预警',
	'warn3': '三级预警',
}

const OperationInfo = {
	'nowarn': false,
	'dropped': false,
	'warn1': true,
	'warn2': true,
	'warn3': true
}


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

@connect(({ dashboard, equipment, loading }) => ({
    dashboard,
	equipment, 
	loading: loading.effects['equipment/query'],
}))

class OperationPlatForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			params: {},
			pageNumber: 1,
			pageSize: 10,
			eqpdataList: [],
			isInit: true,
		}			
	}
	render() {
		const layoutCol = {
			xl: 6,
			md: 12,
			xs: 24
		}
		const layoutCol2 = {
			xl: 14,
			md: 24,
			xs: 24
		}
		const { loading } = this.props;
		const { controlPanelData, receiveTotal, focusTotal } = this.props.dashboard;
		const { operationManSize, wechatSize } = controlPanelData;

		const { eqpdataList } = this.state;
		return (
			<GridContent contentStyle={{background: 'none'}}>
				<Row gutter={32}>
					<Col { ...layoutCol }>
				        <SquareCard name='微信关注总量' icon={icon3} data={wechatSize} />
					</Col>
					<Col { ...layoutCol }>
				        <SquareCard name='运维人员数量' icon={icon2} data={operationManSize} />					    
					</Col>

					<Col { ...layoutCol }>
						<SquareCard name='数据接收总量' icon={icon4} data={receiveTotal} />
					</Col>
					<Col { ...layoutCol }>				        
				        <SquareCard name='数据中转总量' icon={icon1} data={focusTotal} />
					</Col>
				</Row>
				
				<Row style={{margin: '16px 0'}}>
					<Col xl={15} md={24} xs={24} className={styles.leftPart}>
						<ReactEcharts 
							option={ this.mapOption() }
							lazyUpdate={true}
							style={{ width: '100%', height: '874px', marginBottom: '32px' }}
						/>
					</Col>
					<Col xl={9} md={24} xs={24}>
						<Row>
							<Col xl={24} md={12} sm={24} className={styles.rightPart}>
								<Card title="预警消息面板" bordered={false} className={styles.bodynopadding} >
								  	<Table
									  	loading={loading}
										className={styles.table}
								  		columns={ this.columns }
								  		dataSource={ eqpdataList }
								  		pagination={ false }
								  		scroll={{ y: true }}
								  		size='middle'
								  		rowKey='id'
								  		showHeader={ false }
								  	/>		
								</Card>
							</Col>
							<Col xl={24} md={12} sm={24}>
								<div className={styles.wrapper}>
									<Table
										className={styles.table}
										columns={this.columns2}
										dataSource={tableData}
										scroll={{ y: true }}
										pagination={ false }
										size='middle'
										rowKey='id'
									/>
								</div>								
							</Col>
						</Row>
					</Col>
				</Row>
				
				{/*<SockJsClient 
					url='https://xlbj.wxxinquranqi.online/gasSmsServer/websocket' topics={['/topic/pullMessage']}
		            onMessage={ (msg) => this.pushEqdata(msg) }
				 	ref={ (client) => { this.clientRef = client }} 
				 />*/}
			</GridContent>
		)
	}
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch({
		    type: 'dashboard/controlPanelList'
		})

		const { isInit } = this.state;
		if(isInit) {
			this.query()
		}else {
			this.setState({
				isInit: false
			})
		}
		timer = setInterval(() => {
			this.query()
		},5000);
	}
	componentWillUnmount() {
		clearInterval(timer)
	}
	query = (params={})=>{
		const { pageNumber, pageSize } = this.state;
		const { dispatch } = this.props;
		dispatch({
			type: 'equipment/query',
			payload: {
				pageNumber,
				pageSize,
				...params
			},
			callback: () => {
				const { equipment: { data } } = this.props;
				const { list: eqpdataList } = data;
				this.setState({
					eqpdataList
				})
			}
		});
	}
	columns=[
		{
			title: '序号',
			key: 'index',
			width: '15%',
			align: 'center',
			render: (_, __, i) => (i+1)
		},{
			title: '设备编号',
			dataIndex: 'deviceid',
			width: '15%',
			align: 'center',
			render: (val, record) => <Link to={`/equipmentSearcher?id=${val}&type=${record.dtype}`}>{val}</Link>
		},{
			title: '白点',
			key: 'dots',
			width: '5%',
			align: 'center',
			render: val => (<div style={{ position: 'relative' }} ><span className={styles.dots}></span><span className={styles.line}></span></div>)
		},{
			title: '预警等级',
			dataIndex: 'warnstatus',
			width: '20%',
			align: 'center',
			render: val => (<Badge status={warnstatus[val]} text={warnstatusstr[val]}  />)
		},{
			title: '实时浓度',
			dataIndex: 'density',
			width: '30%',
			align: 'center',
			render: val => '实时浓度:' + isEmpty(val)
		},{
			title: '操作',
			key: 'caozuo',
			align: 'center',
			render: (val, record) =>(<div>{ OperationInfo[record.warnstatus] ? '请及时处理' : '暂无处理'}</div>)
		}
	]

	columns2 = [
		{
			title: '序号',
			key: 'index',
			width: '20%',
			align: 'center',
			render: (_, __, index) => index+1 
		},{
			title: '工单编号',
			dataIndex: 'id',
			width: '10%',
			align: 'center',
			render: val => isEmpty(val)
		},{
			title: '运维人员',
			dataIndex: 'name',
			width: '20%',
			align: 'center',
			render: val => isEmpty(val)
		},{
			title: '事件类型',
			dataIndex: 'type',
			width: '15%',
			align: 'center',
			render: val => isEmpty(val)
		},{
			title: '提交时间',
			dataIndex: 'time',
			align: 'center',
			render: val => isEmpty(val)
		}
	]	
	sendMessage = (msg) => {
	   	this.clientRef.sendMessage('/topics/pullMessage', msg);
	}		
	mapOption = () => {
		const { eqpdataList } = this.state;
		// 推送数据
		const convertData = function (data) {
			let res = [];			
			if(data && (Number(data)!==0)) {				
				for (let i = 0; i < data.length; i++) {
					   res.push({
						   name: data[i].areaname,
						   value: [data[i].lng,data[i].lat,data[i].density],                   
						   jibie: data[i].warnstatus
					   });           	
				}
			}		    		    
		    return res;
		};		

		const option = {
		    title: {
		        text: '全国预警地图',
		        left: 'center',
		        textStyle: {
		            color: '#fff',
		            lineHeight: 50
		        }
		    },
		    tooltip : {
		        trigger: 'item'
		    },
		    legend: {
	            data: ['正常', '报警', '离线'],
	            y: '80%',
        		x: '80%',
        		textStyle: {
        			color: '#ffffff'
        		},
        		orient: 'vertical',
        		backgroundColor: '#354159',
        		padding: 20,
        		borderRadius: 10,
		    },
		    bmap: {
		        center: [108.29,35.59],
		        zoom: 5,
		        roam: true,
		        mapStyle: {
		            styleJson: [
	                    {
	                        "featureType": "water",
	                        "elementType": "all",
	                        "stylers": {
	                            "color": "#283043"
	                        }
	                    },
	                    {
	                        "featureType": "land",
	                        "elementType": "all",
	                        "stylers": {
	                            "color": "#354159"
	                        }
	                    },
	                    {
	                        "featureType": "boundary",
	                        "elementType": "geometry",
	                        "stylers": {
	                            "color": "#62E49C"
	                        }
	                    },
	                    {
	                        "featureType": "railway",
	                        "elementType": "all",
	                        "stylers": {
	                            "visibility": "off"
	                        }
	                    },
	                    {
	                        "featureType": "highway",
	                        "elementType": "geometry",
	                        "stylers": {
	                            "color": "#354159"
	                        }
	                    },
	                    {
	                        "featureType": "highway",
	                        "elementType": "geometry.fill",
	                        "stylers": {
	                            "color": "#354159",
	                            "lightness": 1
	                        }
	                    },
	                    {
	                        "featureType": "highway",
	                        "elementType": "labels",
	                        "stylers": {
	                            "visibility": "off"
	                        }
	                    },
	                    {
	                        "featureType": "arterial",
	                        "elementType": "geometry",
	                        "stylers": {
	                            "color": "#ffffff"
	                        }
	                    },
	                    {
	                        "featureType": "arterial",
	                        "elementType": "geometry.fill",
	                        "stylers": {
	                            "color": "#ffffff"
	                        }
	                    },
	                    {
	                        "featureType": "poi",
	                        "elementType": "all",
	                        "stylers": {
	                            "visibility": "off"
	                        }
	                    },
	                    {
	                        "featureType": "green",
	                        "elementType": "all",
	                        "stylers": {
	                            "color": "#ffffff",
	                            "visibility": "off"
	                        }
	                    },
	                    {
	                        "featureType": "subway",
	                        "elementType": "all",
	                        "stylers": {
	                            "visibility": "off"
	                        }
	                    },
	                    {
	                        "featureType": "manmade",
	                        "elementType": "all",
	                        "stylers": {
	                            "visibility": "off"
	                        }
	                    },
	                    {
	                        "featureType": "local",
	                        "elementType": "all",
	                        "stylers": {
	                            "visibility": "off"
	                        }
	                    },
	                    {
	                        "featureType": "boundary",
	                        "elementType": "geometry.fill",
	                        "stylers": {
	                            "color": "#57B789"
	                        }
	                    },
	                    {
	                        "featureType": "label",
	                        "elementType": "all",
	                        "stylers": {
	                            "visibility": "off"
	                        }
	                    }
		            ]
		        }
		    },
		    series : [		       
		        {
		            name: '报警',
		            type: 'effectScatter',
		            coordinateSystem: 'bmap',
		            data: convertData(eqpdataList).filter(item => item.jibie!=='nowarn'&&item.jibie!=='dropped'),
		            symbolSize: function (val) {
		                return 20;
		            },
		            showEffectOn: 'render',
		            rippleEffect: {
		                brushType: 'stroke'
		            },
		            hoverAnimation: true,
		            label: {
		                normal: {
		                    formatter: '{b}',
		                    position: 'right',
		                    show: true
		                }
		            },
		            itemStyle: {
		                normal: {
		                    color: '#FF0008',
		                    shadowBlur: 10,
		                    shadowColor: '#333'
		                }
		            },
		            zlevel: 1
		        },
		        {
		        	name: '正常',
		        	type: 'effectScatter',
		        	coordinateSystem: 'bmap',
		        	data: convertData(eqpdataList).filter(item => item.jibie==='nowarn'),
		        	symbolSize: function (val) {
		        	    return 15;
		        	},
		        	showEffectOn: 'render',
		        	rippleEffect: {
		        	    brushType: 'stroke'
		        	},
		        	hoverAnimation: true,
		        	label: {
		        	    normal: {
		        	        formatter: '{b}',
		        	        position: 'right',
		        	        show: true
		        	    }
		        	},
		        	itemStyle: {
		        	    normal: {
		        	        color: '#61E49C',
		        	        shadowBlur: 10,
		        	        shadowColor: '#333'
		        	    }
		        	},
		        	zlevel: 1
		        },
		        {
		            name: '离线',
		            type: 'effectScatter',
		            coordinateSystem: 'bmap',
		            data: convertData(eqpdataList).filter(item => item.jibie==='dropped'),
		            symbolSize: function (val) {
		                return 15;
		            },
		            showEffectOn: 'render',
		            rippleEffect: {
		                brushType: 'stroke'
		            },
		            hoverAnimation: true,
		            label: {
		                normal: {
		                    formatter: '{b}',
		                    position: 'right',
		                    show: true
		                }
		            },
		            itemStyle: {
		                normal: {
		                    color: '#ffffff',
		                    shadowBlur: 10,
		                    shadowColor: '#333'
		                }
		            },
		            zlevel: 1
		        }
		    ]
		};
		return option;
	}
}

export default OperationPlatForm

