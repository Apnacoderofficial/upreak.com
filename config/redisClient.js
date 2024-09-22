// redisClient.js

const Redis = require('ioredis');

const redisClient = new Redis({
    host: '127.0.0.1', // Redis server host
    port: 6379, // Redis server port
    password: 'Upreak@2024', // Redis server password (if required)
    retryStrategy: times => {
        // reconnect after
        return Math.min(times * 50, 2000);
    }
});

redisClient.on('connect', () => {
    console.log('Connected to Redis...');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redisClient;