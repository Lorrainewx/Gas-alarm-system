import { wxUserList } from '@/services/Gas/wxusers';

export default {
    namespace: 'wxusers',
  
    state: {
        data: {}
    },
  
    effects: {
        *query({ payload }, { call, put }) {
			const response = yield call(wxUserList, payload)
			yield put ({
				type: 'save',
				payload: response && response.total ? response : {}
			})
		},
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