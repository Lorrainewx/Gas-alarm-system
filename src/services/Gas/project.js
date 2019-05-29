import request from '@/utils/request';

// 获取项目列表
export async function queryPro(params) {
    return request('/clientServer/project/projectBaseInfo/selectProInfolist', {
      params
    });
}

// 新增项目列表
export async function addPro(params) {
    return request('/clientServer/project/projectBaseInfo/addProInfo', {
        method: 'POST',
        params
    });
}

// 更改项目列表
export async function editPro(params) {
    return request('/clientServer/project/projectBaseInfo/editProInfo', {
        method: 'POST',
        params
    });
}

// 删除项目列表
export async function deletePro(params) {
    return request('/clientServer/project/projectBaseInfo/delProInfo', {
        method: 'POST',
        params
    });
}

// 项目管理人员首页dashboard
export async function queryMainInfoWithProLeader(params) {
    return request('/clientServer/machine/machineBaseInfo/mainInfoWithProLeader', {
        method: 'POST',
        params
    });
}

// 类别统计
export async function alarmData(params) {
    return request('/clientServer/alarm/alarmWorkorderController/chart_a1', {
        params
    });
}

// 处理方式统计 
export async function alarmHandleData(params) {
    return request('/clientServer/alarm/alarmWorkorderController/chart_b14Project', {
        params
    });
}

// 工单数量统计
export async function workOrderData(params) {
    return request('/clientServer/alarm/alarmWorkorderController/chart_c14Project', {
        params
    });
}


