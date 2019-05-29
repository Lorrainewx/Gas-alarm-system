import { queryHisList } from '@/services/Gas/historicallog'

export default {
	namespace: 'historicallog',

	state: {
		data: {}    
	},

	effects: {
		*query({ payload }, { call, put }) {
			const response = yield call(queryHisList, payload)
			yield put ({
				type: 'save',
				payload: response && response.code === '0' ? response.data : {}
			})
		},
		*clear(_, { put }){
			yield put ({
				type: 'save',
				payload: {}
			})
		}
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