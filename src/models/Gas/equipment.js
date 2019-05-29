import { queryEqList, deleteEq, registerEq, updateEq, queryCurve } from '@/services/Gas/equipment'
import { message } from 'antd';

export default {
	namespace: 'equipment',

	state: {
		submited: false,
		data: {},
		curveData: []
	},

	effects: {
		*query({ payload, callback }, { call, put }) {
			const response = yield call(queryEqList, payload)
			yield put({
				type: 'save',
				payload: response && response.code === '0' ? response.data : {}
			})
			if (callback) callback();
		},
		*delete({ payload }, { call, put }) {
			const response = yield call(deleteEq, payload);
			if (response.code === '66003') {
				yield put({
					type: 'query',
					payload: {
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 10
					}
				})
				message.success('删除成功！');
			} else {
				message.error('删除失败！');
			}
		},
		*update({ payload, editStatus, callback }, { call, put }) {
			const response = yield call(editStatus ? updateEq : registerEq, payload);

			if (response.code === '66005') {
				yield put({
					type: 'query',
					payload: {
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 10
					}
				})
				message.success('更新成功！');
				if (callback) callback();
			} else if (response.code === '66001') {
				yield put({
					type: 'query',
					payload: {
						pageNumber: payload.pageNumber || 1,
						pageSize: payload.pageSize || 10
					}
				})
				yield put({
					type: 'submit',
					payload: {
						submited: true
					}
				})
				message.success('注册成功！');
			} else if (response.code === '66006') {
				message.error('更新失败！');
			} else if (response.code === '66001') {
				message.error('注册失败！');
			}
		},
		*resetSubmited(_, { put }) {
			yield put({
				type: 'submit',
				payload: { submited: false }
			})
		},
		*clear(_, { put }) {
			yield put({
				type: 'save',
				payload: {}
			})
		},
		*getCurve({ payload }, { call, put }) {
			const response = yield call(queryCurve, payload)
			yield put({
				type: 'fetchCurve',
				payload: response && response.code === '0' ? response.data : []
			})
		}
	},

	reducers: {
		save(state, action) {
			return {
				...state,
				data: action.payload
			}
		},
		fetchCurve(state, action) {
			return {
				...state,
				curveData: action.payload
			}
		},
		submit(state, action) {
			return {
				...state,
				submited: action.payload.submited
			}
		},
	}
}