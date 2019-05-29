import request from '@/utils/request'

// 查询工单列表
export async function queryWd(params) {
	return request('/clientServer/alarm/alarmWorkorderController/infoList', {
		method: 'POST',
		params
	})
}

// 查询工单详情
export async function wdDetail(params) {
	return request(`/clientServer/alarm/alarmWorkorderController/queryDetail?workorderid=${params.workorderid}`)
}

// 查询工单流水
export async function queryWdRecord(params) {
	return request('/clientServer/alarm/alarmWorkorderController/timeline', {
		method: 'POST',
		params
	})
}

// 新增工单
export async function addWd(params) {
	return request('/clientServer/alarm/alarmWorkorderController/addInfo', {
		method: 'POST',
		params,
	});
}

// 编辑工单
export async function updateWd(params) {
	return request('/clientServer/alarm/alarmWorkorderController/editInfo', {
		method: 'POST',
		params,
	});
}

// 删除工单
export async function deleteWd(params) {
	return request(`/clientServer/alarm/alarmWorkorderController/delInfo/${params.workorderid?params.workorderid:''}`, {
		method: 'Delete'
	});
}

// 评价工单
export async function evaluateWd(params) {
	return request('/clientServer/alarm/alarmWorkorderController/evaluate', {
		method: 'POST',
		params,
	});
}