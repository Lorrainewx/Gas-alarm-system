import request from '@/utils/request';

// 获取token权限
export async function getToken(params) {
  return request('/clientServer/Permission/auth/token', {
    method: 'POST',
    params,
  });
}

// 获取登录者信息
export async function getUserInfo(params) {
  return request.setToken(params.token)('/clientServer/system/user/getBasic');
}
