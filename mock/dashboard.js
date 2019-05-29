export default {
    "GET /api/actuator/health": {
        "status": "DOWN",//系统启动状态
        "details": {//用到的组件状态信息
            "rabbit": {
                "status": "UP",
                "details": {
                    "version": "3.7.9"
                }
            },
            "diskSpace": {
                "status": "UP",
                "details": {
                    "total": "100931731456",
                    "free": "46172717056",
                    "threshold": "10485760"
                }
            },
            "db": {
                "status": "UP",
                "details": {
                    "database": "Oracle",
                    "hello": "Hello"
                }
            },
            "redis": {
                "status": "DOWN",
                "details": {
                    "error": "org.springframework.data.redis.RedisConnectionFailureException: Unable to connect to Redis; nested exception is io.lettuce.core.RedisConnectionException: Unable to connect to 127.0.0.1:6379"
                }
            }
        }
    }
}