import request from '@/utils/request';

export async function wxUserList (params) {
  return request('/clientServer/alarm/weiXin/list', {
    params
  });
}