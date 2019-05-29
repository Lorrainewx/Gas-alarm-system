import { getMetrics, getMetricItem, getjvmInfo } from '@/services/Gas/serviceDetail';

export default {
    namespace: 'servicedetail',
    state: {
        metricsData:{},
        metricItem: {},
        jvmData: {},
    },
    effects: {
        *service({ payload, callback }, { call, put }){
            const response = yield call(getMetrics);
			yield put ({
                type: 'save',
                payload: {
                    metricsData: response
                }
            })            
            if (callback) callback();
        },
        *fetchItemInfo({ payload, callback },{ call, put }) {
            const response = yield call(getMetricItem, payload);
            yield put ({
                type: 'save',
                payload: {
                    metricItem: response
                }
            })
            if (callback) callback();
        },
        *fetchjvm({ payload, callback } ,{ call, put }) {            
            const response = yield call(getjvmInfo);
            yield put ({
                type: 'save',
                payload: {
                    jvmData: response
                }
            })
            if (callback) callback();
        }
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
