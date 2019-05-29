import request from '@/utils/request'

// 获取设备推送配置
export async function queryRule (params) {
	return request('/clientServer/alarm/alarmController/findRulesAndMansByDev',{
		method: 'POST',
		params
	})
}

// 配置某级别某类型人员
export async function setRule (params) {
	return request('/clientServer/alarm/alarmController/setting',{
		method: 'POST',
		params: {...params, pushmans: JSON.stringify(params.pushmans)}
	})
}

// 删除某级别某类型人员
export async function deleteRule ({ deviceId, deviceType, warnType, pushType }) {
	return request(`/clientServer/alarm/alarmController/delRule/${deviceId}/${deviceType}/${warnType}/${pushType}`,{
		method: 'DELETE'
	})
}