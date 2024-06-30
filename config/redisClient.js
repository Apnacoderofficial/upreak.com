var config = rootRequire('config/config');
const redis = require("redis");
const redisClient = redis.createClient(config.redisDb);

redisClient.on("error", function (error) {
    console.error('Error in redis client connection, error ' + error);
});

module.exports = redisClient;