import { message } from 'antd';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { getToken, getUserInfo } from '@/services/Gas/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
    namespace: 'login',

    state: {
        rememberUser: true,
        token: '',
        userInfo: JSON.parse(window.localStorage.getItem('userInfo')) || {}
    },

    effects: {
        *rememberUser({ payload }, { put }) {
            yield put({
                type: 'save',
                payload: { rememberUser: payload.rememberUser }
            })
        },
        *token({ payload }, { call, put }) {
            const response = yield call(getToken, payload);
            if (response && response.code === '0') {
                let { access_token, token_type } = response.data;
                let token = token_type + ' ' + access_token;
                yield put({
                    type: 'save',
                    payload: { token }
                })
                yield put({
                    type: 'getUInfo',
                    payload: { token }
                })
                window.localStorage.setItem('token', token);
            } else {
                message.error('用户名或密码错误！');
            }
        },
        *getUInfo({ payload }, { call, put, select }) {
            const response = yield call(getUserInfo, payload);
            const rememberUser = yield select(state => state.login.rememberUser);
            if (response && response.code === '0') {
                // 获取用户信息成功 代表登录成功
                yield put({
                    type: 'save',
                    payload: { userInfo: response.data }
                })
                reloadAuthorized();
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params;
                const rolename = response.data.roleName; // 用户角色

                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.match(/^\/.*#/)) {
                            redirect = redirect.substr(redirect.indexOf('#') + 1);
                        }
                    } else {
                        redirect = null;
                    }
                } else {
                    redirect = null;
                }

                if (window.localStorage.getItem('systemSelect') === 'true') {
                    redirect = '/detail/system';
                    window.localStorage.removeItem('systemSelect');
                }

                if (rememberUser) {
                    window.localStorage.setItem('userInfo', JSON.stringify(response.data));
                } else {
                    window.localStorage.removeItem('userInfo');
                }

                yield put(routerRedux.push(redirect || '/detail/system'));

            } else {
                message.error('获取用户信息失败！');
            }
        },
        *logout({ payload }, { put }) {
            if(payload && payload.systemSelect) {
                window.localStorage.setItem('systemSelect', 'true');
            }
            yield put({
                type: 'save',
                payload: { token: '', userInfo: { roleName: 'guest' } }
            })

            reloadAuthorized();
            // redirect
            if (window.location.pathname !== '/user/login') {
                yield put(
                    routerRedux.replace({
                        pathname: '/user/login',
                        search: stringify({
                            redirect: window.location.href,
                        }),
                    })
                );
            }
        }
    },

    reducers: {
        save(state, { payload }) {
            setAuthority(payload.userInfo ? payload.userInfo.roleName : 'guest');
            return {
                ...state,
                ...payload
            }
        },
    }
}