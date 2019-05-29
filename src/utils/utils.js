import { parse } from 'qs';
import { Tooltip, message } from 'antd';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const role = {
    administrator: '管理员',
    operaman: '运维人员',
    projectLeader: '项目负责人'
};

export function isUrl(path) {
    return reg.test(path);
}

// 判断字段是否为空，并替换成指定节点
export function isEmpty(val, sign = '-') {
    return !val || val.replace(/\s+/g, '') === '' ? sign : val;
}

// 字符过长时，使用tooptip组件扩展显示
export function StringLimit(str, maxLength) {
    if (typeof str === 'string' && str.length > maxLength) {
        return <Tooltip title={str}>
            {
                str.substr(maxLength - 3) + '...'
            }
        </Tooltip>
    } else {
        return str;
    }
}

// 获取当年某月时间段
export function getMonth(month) {
    const time = new Date();
    const year = time.getFullYear();
    month = month ? month : toFixed2(time.getMonth() + 1);
    let days = new Date(year, month, 0).getDate();
    return [
        `${year}-${month}-01`,
        `${year}-${month}-${days}`
    ];
}

export function toFixed2(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export function getPageQuery() {
    return parse(window.location.href.split('?')[1]);
}

export function getImageUploadProps(callback, expend) {
    return {
        accept: "image/*",
        action: '/clientServer/editorFile/fileUpload/fileUpload',
        showUploadList: false,
        beforeUpload: (file) => {
            const isJPG = /image/g.test(file.type);
            if (!isJPG) message.error('请选择图片上传!');
            return isJPG;
        },
        onChange: (info) => {
            if (info.file.status === 'done') {
                console.log(info);
                if(typeof info.file.response === 'object') {
                    message.success(`${info.file.name} 上传成功！`);
                    if(typeof callback === 'function') callback(info);
                } else {
                    message.error(`${info.file.name} 上传失败！`);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败！`);
            }
        },
        ...expend
    }
}