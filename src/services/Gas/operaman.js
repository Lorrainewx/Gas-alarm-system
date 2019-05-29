import request from '@/utils/request'

// 查询工单列表
export async function query(params) {
	return request('/clientServer/alarm/alarmWorkorderController/infoList4Operaman', {
		method: 'POST',
		params
	})
}

// 查询报修工单
export async function queryRepair(params) {
	return request('/clientServer/alarm/repair/infoList', {
		params
	})
}

