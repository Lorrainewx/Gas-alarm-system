import { query, queryDetail, deleteCpy, updateCpy, addCpy } from '@/services/Gas/company'
import { message } from 'antd';

export default {
	namespace: 'company',

	state: {
		data: {}
	},

	effects: {
		*query({ payload }, { call, put }) {
            const response = yield call(query, payload)
			yield put ({
                type: 'save',
                payload: response.code === '0' ? response.data : {}
            })
		},
		*queryDetail({ payload }, { call, put }) {
            const response = yield call(queryDetail, payload)
			yield put ({
                type: 'save',
                payload: response.code === '0' ? response.data : {}
            })
		},
		*delete({ payload }, { call, put }) {
			const response = yield call(deleteCpy, payload)
			if(response.code === '66099') {
				yield put ({
					type: 'queryDetail',
					payload: {
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 10
					}
				})
				message.success('删除成功！')
			}else {
				message.error('删除失败！')
			}			
		},
		*update({ payload },{ call, put }) {
			const response = yield call(payload.unid ? updateCpy : addCpy, payload)
			if((payload.unid && response.code === '66009') || (!payload.unid && response.code === '66007')) {
				yield put ({
					type: 'queryDetail',
					payload: {
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 10
					}
				})
				message.success('更新成功！')
			}else {
				message.error('更新失败，请重试！')
			}			
		},		
	},

	reducers: {
		save(state, action) {
	 		return {
	 			...state,
	 			data: action.payload
	 		}
	 	}
	}
}