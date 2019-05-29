import request from '@/utils/request'

// 查询运维人员
export async function queryOpList(params) {
	return request('/clientServer/alarm/operationManController/infoList', {
		method: 'POST',
		params
	})
}

// 删除运维人员
export async function deleteOp(params) {
  	return request(`/clientServer/alarm/operationManController/delInfo/${params.id}`, {
	    method: 'Delete'
  	});
}

// 新增运维人员
export async function addOp(params) {
  	return request('/clientServer/alarm/operationManController/addInfo', {
    	method: 'POST',
    	params,
  	});
}


// 编辑运维人员
export async function updateOp(params) {
  	return request('/clientServer/alarm/operationManController/editInfo',{
    	method: 'POST',
    	params,
  	});
}