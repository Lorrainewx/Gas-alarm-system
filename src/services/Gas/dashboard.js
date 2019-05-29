import request from '@/utils/request';

export async function equipmentStatistics() {
  //   return request('/api/users');
}

export async function receiveTotal() {
  //   return request('/api/currentUser');
}

export async function transferTotal() {
  //   return request('/api/notices');
}

export async function focusTotal() {
  //   return request('/api/notices');
}

export async function optionalTotal() {
  //   return request('/api/notices');
}

// 预警记录曲线图
export async function sendsChart(params) {
  return request('/clientServer/alarm/warningRecordController/echartDay',{
    params
  });
}

// 工单处理类型 管理员身份
export async function pieChart(params) {
  return request('/clientServer/alarm/alarmWorkorderController/chart_b1', {
    params
  })
}

export async function barChart() {
  
}

// 报警类别饼状图统计
export async function warningType() {
  
}

// 数据接收服务数据
export async function gasReceiveServer() {
  return request(`/gasReceiveServer/actuator/health`);
}

export async function gasParsedServer() {
  return request(`/gasParsedServer/actuator/health`);
}

export async function gasSmsServer() {
  return request(`/gasSmsServer/actuator/health`);
}

export async function workOrderList() {
  //return request('/api/notices');
}

// 控制面板 总数
export async function controlPanelList() {
  return request('/clientServer/company/companyBaseInfo/mainInfo',{
    method: 'POST'
  });
}


// 运维 控制面板
export async function controlPanelListOp() {
  return request('/clientServer/machine/machineBaseInfo/mainInfoWithProLeader',{
    method: 'POST'
  });
}

// 项目 控制面板
export async function controlPanelListPro() {
  return request('/clientServer/machine/machineBaseInfo/mainInfoWithProLeader',{
    method: 'POST'
  });
}



