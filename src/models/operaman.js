import { query, queryRepair } from '@/services/Gas/operaman'

export default {
	namespace: 'operaman',

	state: {
        data: {},
        dataRepair: {},
    },

    effects: {
        *fetch({ payload },{ call, put }) {
            const response = yield call(query, payload)
			yield put ({
                type: 'save',
                payload: response.code === '0' ? response.data : {}
            })
        },
        *fetchRepair({ payload },{ call, put }) {
            const response = yield call(queryRepair, payload)
            yield put({
                type: 'saveRepair',
                payload: response
            })
        }
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                data: action.payload,
            }
        },
        saveRepair(state, action) {
            return {
                ...state,
                dataRepair: action.payload,
            }
        }
    }
    
}