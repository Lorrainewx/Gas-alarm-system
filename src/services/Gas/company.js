import request from '@/utils/request';

// 获取单位列表
export async function query(params) {
  return request('/clientServer/company/companyBaseInfo/selectCompanyInfolist', {
    params,
  });
}

//  获取单位列表（包含子表）
export async function queryDetail(params) { 
  return request('/clientServer/company/companyBaseInfo/selectCompanyInfolistByType', {
    params,
  });
}

//  更新单位
export async function updateCpy(params) { 
  return request('/clientServer/company/companyBaseInfo/editCompanyInfoByUtype', {
    method: 'POST',
    params,
  });
}

// 添加单位
export async function addCpy(params) { 
  return request('/clientServer/company/companyBaseInfo/addCompanyInfoByUtype', {
    method: 'POST',
    params,
  });
}

// 删除单位
export async function deleteCpy(params) { 
  return request('/clientServer/company/companyBaseInfo/delCompanyInfo', {
    method: 'POST',
    params,
  });
}

