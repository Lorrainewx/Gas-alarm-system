export default {
  // 预警平台后端接口服务
  "/clientServer": {
    "target": "https://xlbj.wxxinquranqi.online",
    "changeOrigin": true,
  },
  // 文件服务
  "/file": {
    "target": "https://xlbj.wxxinquranqi.online:1243",
    "changeOrigin": true,
    "pathRewrite": {
      "^/file": ""
    }
  },
  // 数据接收服务
  "/gasReceiveServer": {
    "target": "https://xlbj.wxxinquranqi.online",
    "changeOrigin": true,
  },
  // 数据预警服务
  "/gasParsedServer": {
    "target": "https://xlbj.wxxinquranqi.online",
    "changeOrigin": true,
  },
  // 数据处理服务
  "/gasSmsServer": {
    "target": "https://xlbj.wxxinquranqi.online",
    "changeOrigin": true,
  }
}