import { queryWd, queryWdRecord, wdDetail, deleteWd, addWd, updateWd } from '@/services/Gas/workorder';
import { message } from 'antd';
import router from 'umi/router';

export default {
    namespace: 'workorder',

    state: {
        data: {},
        detail: {},
        timeLineData: {}
    },

    effects: {
        *query({ payload }, { call, put }) {
            const response = yield call(queryWd, payload);
            yield put({
                type: 'save',
                payload: {
                    data: response && response.code === '0' ? response.data : {}
                }
            })
        },
        *detail({ payload }, { call, put }) {
            const response = yield call(wdDetail, payload);
            yield put({
                type: 'save',
                payload: {
                    detail: response && response.code === '0' ? response.data : {}
                }
            })
        },
        *record({ payload }, { call, put }) {
            const response = yield call(queryWdRecord, payload);
            yield put({
                type: 'save',
                payload: {
                    timeLineData: response && response.code === '0' ? response.data : {}
                }
            })
        },
        *add({ payload, callback }, { call, put }) {
            const response = yield call(addWd, payload);
            if (response.code === '60001') {
                message.success('创建成功！');
                if (typeof callback === 'function') callback();

                yield put({
                    type: 'query'
                })

            } else {
                message.error('创建失败！');
            }
        },
        *update({ payload }, { call, put }) {
            const response = yield call(updateWd, payload);
            if (response.code === '60005') {
                message.success(`操作成功！`);
                yield put({
                    type: 'query',
                    payload
                })
                yield put({
                    type: 'record',
                    payload
                })
            } else {
                message.error(`操作失败！`);
            }
        },
        *delete({ payload }, { call }) {
            const response = yield call(deleteWd, payload);
            if (response.code === '60003') {
                message.success('删除成功！', 1.5);
                setTimeout(() => router.push('/workorderManage'), 1500);
            } else {
                message.error('删除失败！');
            }
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