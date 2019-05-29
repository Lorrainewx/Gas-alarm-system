import { primaryColor } from '../src/defaultSettings.js';

const lightColor = '#f9f9f9';

export default {
    /** 可能影响到全局的配置 **/
    'primary-color': primaryColor, // 主色
    'body-background': '#171723', // body背景色
    'component-background': '#1f2638', // 组件背景色
    'text-color': lightColor, // 主文本色
    'text-color-secondary': '#ccc', // 次文本色
    'border-radius-base': 0, // 圆角
    'layout-header-background': '#1d202f',
    'layout-body-background': '#171723',
    'layout-footer-background': '#171723',
    // 'shadow-color': '#ccc',
    'heading-color': lightColor,
    'icon-color-hover': '#ffffff',
    
    /** Menu相关组件的配置 **/
    'item-active-bg': primaryColor,
    'item-hover-bg': primaryColor,
    'menu-item-color': lightColor,

    /** Table相关组件的配置 **/
    'table-header-bg': '#1f2638',
    'table-row-hover-bg':'#1f2638',
    'table-selected-row-bg': '#1f2638',
    'table-border-radius-base': '4px',
    // 'border-width-base': '0px',

    /** Input相关组件的配置 **/
    'input-placeholder-color': '#848484',
    'input-bg': '#222d43',
    'input-border-color': '#3f5177',

    /** Select相关组件的配置 **/
    'select-border-color': '#3f5177',

    /** Button相关组件的配置 **/
    'btn-border-radius-base': '4px',
    'btn-default-color': primaryColor,
    'btn-default-bg': '#293146',
    'btn-default-border': primaryColor,
    'background-color-light': '#3F5177',
    'input-hover-border-color': '#3F5177',
    'btn-danger-bg': '#293146',
    'btn-danger-border': '#f5222d',

    'card-head-background': '#293146',
    /** 禁用配置 **/
    'disabled-color': '#ffffff',
    /** 时间选择器配置 **/
    'time-picker-selected-bg': primaryColor,
    /** PopConfirm 配置 **/
    'popover-bg': '#293449',

    'modal-header-bg': '#303b51',

};