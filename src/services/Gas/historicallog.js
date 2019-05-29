import request from '@/utils/request'

// 预警记录
export async function queryHisList(params) {
	return request('/clientServer/alarm/warningRecordController/infoList', {
    method: 'POST',
    params
  })
}