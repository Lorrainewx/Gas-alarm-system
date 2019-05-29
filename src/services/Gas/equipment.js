import request from '@/utils/request'

// 查询设备
export async function queryEqList(params) {
	return request('/clientServer/machine/machineBaseInfo/selectInfoList',{
		params
	})
}

// 根据设备id查询设备浓度曲线
export async function queryCurve(params) {
	return request('/clientServer/machine/machineBaseInfo/selectMachineHis',{
		method: 'POST',
		params
	})
}

// 删除设备
export async function deleteEq(params) {
	return request('/clientServer/machine/machineBaseInfo/delMacInfo',{
		method: 'POST',
		params
	})
}

// 注册设备
export async function registerEq(params) {
  return request('/clientServer/machine/machineBaseInfo/signupMac', {
    method: 'POST',
    params,
  });
}

// 修改设备
export async function updateEq(params) {
	return request('/clientServer/machine/machineBaseInfo/changeMacInfo', {
    method: 'POST',
    params,
  })
}