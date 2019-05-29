export default [{
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './login/Login' },
      // { path: '/user/register', name: 'register', component: './User/Login' },
      // { path: '/user/register-result', name: 'register.result', component: './User/Login', }
    ],
  },
  {
    path: '/detail',
    routes: [
      { path: '/detail/system', name: 'system', component: './login/SystemRouter' },
    ],
    authority: ['administrator','projectLeader','operaman'],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',      
    Routes: ['src/pages/Authorized'],
    routes: [
      { 
        path: '/', 
        redirect: '/dashboard' 
      },
      {
        path: '/operamanHome',
        name: 'operamanHome',
        icon: 'icon-home',
        component: './operaman/Operaman', 
        authority: ['operaman'],
      },
      {
        path: '/projectLeaderHome',
        name: 'projectLeaderHome',
        icon: 'icon-home',
        component: './projectLeader/ProjectLeader', 
        authority: ['projectLeader'],
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'icon-home',
        component: './dashboard/Dashboard', 
        authority: ['administrator'],
      },
      {
        path: '/equipManage',
        name: 'equipManage',
        icon: 'icon-config',
        component: './equipmentManage/EquipmentManage',
        authority: ['administrator','projectLeader','operaman'],
      },
      {
        path: '/wxUsers',
        name: 'wxUsers',
        icon: 'icon-wechat',
        component: './wxUsers/WxUsers',
        authority: ['administrator'],
      },
      {
        path: '/optionalPerson',
        name: 'optionalPersonManage',
        icon: 'icon-person',
        component: './operationManage/OperationManage',
        authority: ['administrator'],
      },
      {
        path: '/equipmentRules',
        name: 'equipmentRules',
        icon: 'icon-rule',
        component: './equipmentRules/EquipmentRules',
        authority: ['administrator','projectLeader','operaman'],
      },
      {
        path: '/historicalLog',
        name: 'historicalLog',
        icon: 'icon-log',
        component: './historicalLog/HistoricalLog',
        authority: ['administrator'],
      },
      {
        path: '/equipmentSearcher',
        name: 'equipmentSearcher',
        icon: 'icon-setting',
        component: './equipmentSearcher/EquipmentSearcher',
        authority: ['administrator','projectLeader','operaman'],
      },
      {
        path: '/operationPlatform',
        name: 'operationPlatform',
        icon: 'cluster',
        component: './operationPlatform/OperationPlatform',
        authority: ['administrator','projectLeader','operaman'],
      },
      {
        path: '/companyManagement',
        name: 'companyManagement',
        icon: 'icon-company',
        component: './companyManagement/CompanyManagement',
        authority: ['administrator','projectLeader'],
      },
      {
        path: '/projectManagement',
        name: 'projectManagement',
        icon: 'icon-qiye',
        component: './projectManagement/ProjectManagement',
        authority: ['administrator'],
      },
       {
        path: '/workorderManage',
        name: 'workorderManage',
        icon: 'icon-job',
        component: './workorderManage/WorkorderManage',
        authority: ['administrator','projectLeader','operaman'],
      },
       {
        path: '/workorderDetail',
        name: 'workorderDetail',
        icon: 'icon-job',
        component: './workorderDetail/WorkorderDetail',
        authority: ['administrator','projectLeader','operaman'],
        hideInMenu:true
      },
      // {
      //   path: '/arcgisDemo',
      //   name: 'arcgisDemo',
      //   icon: 'icon-worker',
      //   component: './arcgisDemo/ArcgisDemo',
      // },
      // {
      //   path: '/esriLoaderMap',
      //   name: 'esriLoaderMap',
      //   icon: 'icon-worker',
      //   component: './arcgisDemo/EsriLoaderMap',
      // },
      { 
        path: '/service',
        component: './serviceDetail/ServiceDetail'
      }
    ],
  },
]
