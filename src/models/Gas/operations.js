import { queryOpList, deleteOp, addOp, updateOp } from '@/services/Gas/operations'
import { message } from 'antd';

export default {
	namespace: 'operations',

	state: {
		data: {},
	},

	effects: {
		*query({ payload }, { call, put }) {
			const response = yield call(queryOpList, payload)
			yield put ({
				type: 'save',
				payload: response && response.code === '0' ? response.data : {}
			})
		},
		*delete({ payload }, { call, put }){
			const response = yield call(deleteOp, payload);
			if(response.code === '60003') {
				yield put ({
					type: 'query',
					payload: { 
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 4
					}
				})
				message.error('删除成功！');
			} else {
				message.error('删除失败！');
			}
		},
		*update({ payload }, { call, put }){
			const response = yield call(payload.id ? updateOp : addOp, payload);
			if(
				(!payload.id && response.code === '60001') || 
				(payload.id && response.code === '60005')
			) {
				yield put ({
					type: 'query',
					payload: { 
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 4
					}
				})
				message.success('更新成功！');
			} else {
				message.error('更新失败！请重试');
			}
		}
	},

	reducers: {
		save(state, action) {
	 		return {
	 			...state,
				data: action.payload,
	 		}
	 	},
	}
}
