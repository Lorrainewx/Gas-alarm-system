export default {
  'GET /api/rule': {
    "code": "0",
    "data": [{
      id: '00000000000001',
      "warn1": { //一级预警
        "warnType": "warn1", //预警类型
        "defaultTypes": { //默认推送方式
          "wechat": { //微信
            "checked": false, //是否勾选
            "ruleId": "",
            "alarmPushmanList": ""
          }
        },
        "optionTypes": { //可选推送方式
          "telephone": { //电话
            "checked": true,
            "ruleId": "7a87c0791eb84cc39d1ab4012e9d03af", //规则id
            "alarmPushmanList": [//推送人员信息
              {
                "id": "d3a45945517d4547a78a13876383fbed", //推送人员信息id
                "rulesid": "7a87c0791eb84cc39d1ab4012e9d03af", //规则id
                "deviceid": "123456789", //设备id
                "pid": "15765758678575857", //推送人主表id
                "pkeyword": "openid", //推送官架子
                "pmanname": "二狗子", //推送人按名称
                "ptype": "telephone", //推送方式
                "warnlevel": "warn1", //预警类型
                "createdate": "2019-03-21 17:17:48",
                "isdefault": "0", //是否默认推送人 1:是  0:否
                "pmantype": "1", //推送人员类型 1:运维 2:单位 3:微信用户 4:系统用户
                "sort": "",
                "dtype": "NBiot" //设备类型
              }
            ]
          },
          "message": { //短信
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          },
          "jpush": { //jpush
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          }
        }
      },
      "alarmMachineB": { //设备信息
        "deviceid": "123456789",
        "dtype": "NBiot",
        "dtypenm": "",
        "id": "212121",
        "dname": "575464465356757",
        "unid": "",
        "uname": "",
        "lname": "",
        "ltel": "",
        "lng": "",
        "lat": "",
        "areacode": "",
        "areaname": "",
        "opeid": "",
        "name": "",
        "tel": "",
        "post": "",
        "isused": "1",
        "usedstr": "",
        "agfile": "",
        "ftytype": "",
        "ftytypenm": "",
        "status": "",
        "lastdistime": "",
        "getdatatime": "",
        "onlinestatus": "离线",
        "density": "",
        "waring1": "15",
        "waring2": "25",
        "waring3": "50",
        "warnstatus": "",
        "warnstatusstr": "",
        "enabled": "1",
        "signal": "",
        "createtime": "2019-03-15 14:19:20",
        "modifydate": "",
        "description": "",
        "datafrequency": "",
        "hasrule": "1",
        "hasrulestr": "",
        "ewmuuid": "",
        "ewmpath": "",
        "newEcode": "",
        "defultRule": ""
      },
      "warn2": { //二级预警
        "warnType": "warn2",
        "defaultTypes": {
          "wechat": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          },
          "message": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          }
        },
        "optionTypes": {
          "telephone": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          },
          "jpush": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          }
        }
      },
      "warn3": { //三级已经
        "warnType": "warn3",
        "defaultTypes": {
          "wechat": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          },
          "telephone": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          },
          "message": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          }
        },
        "optionTypes": {
          "jpush": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          }
        }
      },
      "dropped": { //离线
        "warnType": "dropped",
        "defaultTypes": {
          "wechat": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          }
        },
        "optionTypes": {
          "telephone": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          },
          "message": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          },
          "jpush": {
            "checked": false,
            "ruleId": "",
            "alarmPushmanList": ""
          }
        }
      }
    }],
    "desc": "成功"
  }
}
