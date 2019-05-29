import { queryFile } from '@/services/Gas/file'

export default {
	namespace: 'file',

	state: {
		data: []
	},

	effects: {
		*query({ payload }, { call, put }) {
			const response = yield call(queryFile, payload)
			yield put ({
				type: 'save',
				payload: response && response.code === '0' ? response.data : []
			})
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