import { queryRule, setRule, deleteRule } from '@/services/Gas/rule';
import defaultRule from '@/utils/defaultRule';

export default {
    namespace: 'rule',

    state: {
        deviceId: '',
        deviceType: '',
        config: {}
    },

    effects: {

        *getRule({ payload }, { call, put }) {
            // 获取value
            const response = yield call(queryRule, payload);
            yield put({
                type: 'save',
                payload: {
                    config: response && response.code === '0' && typeof response.data === 'object' ? response.data : defaultRule,
                    ...payload
                },
            });
        },

        *setType({ payload }, { call, put, select }) {
            // 设置某级别的类型是否勾选
            let response;
            if (!payload.checked) {
                // 请求删除接口
                const deviceInfo = yield select(state => ({
                    deviceId: state.rule.deviceId,
                    deviceType: state.rule.deviceType,
                }))
                response = yield call(deleteRule, { ...payload, ...deviceInfo });
            }
            // clear 是否删除成功？
            yield put({
                type: 'changeType',
                payload: { ...payload, clear: response && response.code === '60003' }
            });

        },

        *setConfig({ payload }, { put }) {
            // 修改某一个级别某一类型的人员的状态
            yield put({
                type: 'addPerson',
                payload
            });
        },

        *editConfig({ payload }, { put }) {
            // 修改某一个级别某一类型的人员的状态
            yield put({
                type: 'editPerson',
                payload
            });
        },

        *update({ payload }, { call, put, select }) {
            // 将某级别某类型的人员配置提交至后端
            const deviceInfo = yield select(state => ({
                deviceId: state.rule.deviceId,
                deviceType: state.rule.deviceType,
            }))

            payload.pushmans = payload.pushmans.filter(item => item.checked)

            const response = yield call(setRule, { ...payload, ...deviceInfo });

            yield put({
                type: 'updateConfig',
                payload: {
                    rule: response.code === '0' ? { ...response.data, checked: true } : { checked: true },
                    ...payload
                }
            });
        }
    },

    reducers: {
        save(state, action) {
            // 为什么要写这个遍历过程，因为需要checked字段来显示配置人员的checkedbox的状态, 所以列表内的所有人员要设置默认为true
            for (let types in action.payload.config) {
                if (/warn/g.test(types) || types === 'dropped') {
                    for (let t in action.payload.config[types]) {
                        if (t === 'optionTypes' || t === 'defaultTypes') {
                            for (let i in action.payload.config[types][t]) {
                                if (Array.isArray(action.payload.config[types][t][i].alarmPushmanList)) {
                                    action.payload.config[types][t][i].alarmPushmanList.map(i => i.checked = true)
                                }
                            }
                        }
                    }
                }
            }

            return {
                ...state,
                ...action.payload,
            };
        },
        changeType(state, { payload }) {
            const { config } = state;
            const { checked, warnType, pushType, clear } = payload;

            if (typeof config[warnType].optionTypes[pushType] === 'object') {
                config[warnType].optionTypes[pushType].checked = checked;
            } else {
                config[warnType].optionTypes[pushType] = { checked };
            }

            // 如果前端点击删除按钮， 并且后端传递是成功则清理 该预警配置人员数组；否则操作失败
            if (clear === !checked) {
                config[warnType].optionTypes[pushType] = { 
                    checked, 
                    focus: false, 
                    alarmPushmanList: []
                };
            }

            return {
                ...state,
                config
            }
        },

        addPerson(state, { payload }) {
            const { config } = state;
            const { warnType, pushType, person, isDefault } = payload;
            let group = isDefault ? 'defaultTypes' : 'optionTypes';

            if (config[warnType][group][pushType] && Array.isArray(config[warnType][group][pushType].alarmPushmanList)) {
                config[warnType][group][pushType].alarmPushmanList = person;
                config[warnType][group][pushType].focus = true;
            } else {
                config[warnType][group][pushType] = {
                    alarmPushmanList: [...person],
                    checked: true,
                    focus: true
                };
            }

            return {
                ...state,
                config
            }
        },

        editPerson(state, { payload }) {
            const { config } = state;
            const { warnType, pushType, person, isDefault, index } = payload;

            let group = isDefault ? 'defaultTypes' : 'optionTypes';
            config[warnType][group][pushType].alarmPushmanList.splice(index, 1, person);
            config[warnType][group][pushType].focus = true;

            return {
                ...state,
                config
            }
        },

        updateConfig(state, { payload }) {
            const { config } = state;
            const { warntype: warnType, ptype: pushType, isDefault, rule = {} } = payload;

            let group = isDefault ? 'defaultTypes' : 'optionTypes';
            config[warnType][group][pushType].focus = false;

            rule.addList.map(item => {
                item.checked = true;
            });

            rule.alarmPushmanList = rule.addList;

            config[warnType][group][pushType] = rule;

            return {
                ...state,
                config
            }
        }

    },
};