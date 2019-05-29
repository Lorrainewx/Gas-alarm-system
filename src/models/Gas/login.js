import { getToken, getUserInfo } from '@/services/Gas/login';
import router from 'umi/router';
import { message } from 'antd';

export default {
  namespace: 'login2',

  state: {
    rememberUser: true,
    token: '',
    userInfo: JSON.parse(window.localStorage.getItem('userInfo')) || {}
  },

  effects: {
    *rememberUser({ payload }, { put }){
      yield put({
        type: 'save',
        payload: { rememberUser: payload.rememberUser }
      })
    },
    *token({ payload }, { call, put }){
      const response = yield call(getToken, payload);
      if(response && response.code === '0'){
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
    *getUInfo({ payload }, { call, put, select }){
      const response = yield call(getUserInfo, payload);
      const rememberUser = yield select(state => state.login.rememberUser);
      if(response && response.code === '0'){
        yield put({
          type: 'save',
          payload: { userInfo: response.data }
        })
        router.push('/detail/system');
        if(rememberUser) {
          window.localStorage.setItem('userInfo', JSON.stringify(response.data));
        } else {
          window.localStorage.removeItem('userInfo');
        }
      } else {
        message.error('获取用户信息失败！');
      }
    },
    *logout(_, { put }){
      yield put({
        type: 'save',
        payload: { token: '' }
      })
      router.push('/user');
    }
  },

  reducers: {
    save(state, action){
      return {
        ...state,
        ...action.payload
      }
    },
  }
}