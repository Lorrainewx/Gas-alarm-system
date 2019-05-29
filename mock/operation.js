export default {
	'GET /api/operations/list': {
	  	"code": "0",
	  	"data": {
		    "pageNum": "1",
		    "pageSize": "10",
		    "size": "1",
		    "orderBy": "",
		    "startRow": "1",
		    "endRow": "1",
		    "total": "1",
		    "pages": "1",
		    "list": [{
		        "id": "1",
		        "name": "张三", //运维人员名称
		        "tel": "13787878786", //电话
		        "post": "post001", //职务code_myid
		        "groupid": "groupid001", //分组code_myid
		        "postname": "系统管理", //职务名称
		        "groupname": "参数管理", //分组名称
		        "modifytime": "2019-12-12 10:10:10" ,
		        "userid": "c114528a193b41c3952c382b1d218efb",//系统用户账号id,为空为未创建
		        "username": "xxx@xxx" //系统用户账号登录名称
	      	}],
		    "firstPage": "1",
		    "prePage": "0",
		    "nextPage": "0",
		    "lastPage": "1",
		    "isFirstPage": true,
		    "isLastPage": true,
		    "hasPreviousPage": false,
		    "hasNextPage": false,
		    "navigatePages": "8",
		    "navigatepageNums": ["1"]
	  	},
	  	"desc": "成功"
	}

}