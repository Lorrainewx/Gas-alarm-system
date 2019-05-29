import request from '@/utils/request'

// 查询文件
export async function queryFile(params) {
    return request('/clientServer/uploadFIlesServer/editorFile/fileUpload/getFileListByMainid', {
        method: 'POST',
        params
    })
}
