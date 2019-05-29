import { 
    equipmentStatistics,
    receiveTotal,
    transferTotal,
    focusTotal,
    optionalTotal,
    sendsChart,
    pieChart,
    gasReceiveServer,
    gasParsedServer,
    gasSmsServer,
    workOrderList,
    controlPanelList,
} from '@/services/Gas/dashboard';

export default {
    namespace: 'dashboard',
  
    state: {
        emStatistics: {
            total: 246,
            outline: 43,
            warming: 67,
            unuse: 120
        },
        receiveTotal: 152461,
        transferTotal: 999,
        focusTotal: 142350,
        optionalTotal: 999,
        sendsChart: {},
        serviceData: {},
        workOrderList: [],
        controlPanelData: {},
        workOrderData: [],
    },
  
    effects: {
        *sendsData({ payload }, { call, put }){
            const response = yield call(sendsChart, payload);
			yield put ({
                type: 'save',
                payload: {
                    sendsChart: response
                }
            })
        },
        *service({ payload }, { call, put }){
            const servicePost = {
                gasReceiveServer,
                gasParsedServer,
                gasSmsServer,
            }
            const response = yield call(servicePost[payload.service]);
			yield put ({
                type: 'save',
                payload: {
                    serviceData: response
                }
            })
        },
        *orderData({ callback,payload }, { call, put }){
            const response = yield call(pieChart, payload);
			yield put ({
                type: 'save',
                payload: {
                    workOrderData: response.code === '0' ? response.data : []
                }
			})	
			if(callback) callback();
        },
        *controlPanelList({ payload }, { call, put }) {
            const response = yield call(controlPanelList, payload);            
            yield put ({
                type: 'save',
                payload: {
                    controlPanelData: response && response.code === '0' ? response.data : {}
                }
            })
        },
    },

    reducers: {
        save(state, action){
            return {
                ...state,
                ...action.payload
            }
        }
    }
}