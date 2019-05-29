import { queryPro, addPro, editPro, deletePro, queryMainInfoWithProLeader, alarmHandleData, alarmData, workOrderData } from '@/services/Gas/project'
import { message } from 'antd';

export default {
	namespace: 'project',

	state: {
		data: {},
		staticsData: [],
		staticsHandleData: [],
		workOrderData: [],
	},

	effects: {
		*fetch({ payload }, { call, put }) {
            const response = yield call(queryPro, payload)
			yield put ({
                type: 'save',
                payload: {
					data: response.code === '0' ? response.data : {}
				}
            })
		},
		*delete({ payload }, { call, put }) {
			const response = yield call(deletePro, payload)
			if(response.code === '66025') {
				yield put ({
					type: 'fetch',
					payload: {
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 10
					}
				})
				message.success('删除成功！')
			}else if(response.code === '66026') {
				message.error('项目删除失败,没有此项目!')
			}else {
				message.error('项目删除失败！')
			}
		},
		*update({ payload }, { call, put }) {
			const response = yield call(payload.proid?editPro:addPro, payload);
			if((payload.proid && response.code === '66022') || (!payload.proid && response.code === '66019')) {
				yield put ({
					type: 'fetch',
					payload: {
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 10
					}
				})
				message.success('更新成功！');
			}else {
				message.error('更新失败,请重试！');
			}
		},
		*dashboard({ payload }, { call, put }) {
			const response = yield call(queryMainInfoWithProLeader, payload);
			yield put ({
                type: 'save',
                payload: {
                    data: response.code === '0' ? response.data : {}
                }
            })			
		},
		*statics({ callback,payload }, { call, put }) {
			const response = yield call(alarmData, payload);
			yield put ({
                type: 'save',
                payload: {
                    staticsData: response.code === '0' ? response.data : []
                }
			})	
			if(callback) callback();
		},
		*handle({ callback, payload }, { call, put }) {
			const response = yield call(alarmHandleData, payload);
			yield put ({
                type: 'save',
                payload: {
                    staticsHandleData: response.code === '0' ? response.data : []
                }
			})	
			
			if(callback) callback();
		},	
		*queryOrderData({ callback, payload }, { call, put }) {
			const response = yield call(workOrderData, payload);
			yield put ({
                type: 'save',
                payload: {
                    workOrderData: response.code === '0' ? response.data : []
                }
			})	
			
			if(callback) callback();
		},	
	},

	reducers: {
		save(state, action) {
	 		return {
	 			...state,
	 			...action.payload
	 		}
		},		
	}
}