import request from '@/utils/request';
import { redirect } from '@/defaultSettings';

// 获取节点
export async function getMetrics() {
    return request(`${redirect}/gasReceiveServer/actuator/metrics`);
}

// 当前节点信息
export async function getMetricItem(params) {
    return request(`${redirect}/gasReceiveServer/actuator/metrics/${params.metricName}`);
}

// JVM数据
export async function getjvmInfo(params) {
    return request(`${redirect}/gasReceiveServer/jvm/status`);
}