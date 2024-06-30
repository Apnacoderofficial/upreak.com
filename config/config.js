var path = require('path'),
    rootPath = path.normalize(__dirname + '../..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        baseUrl: 'http://localhost:3000',
        root: rootPath,
        env: env,
        sessionLife: 15 * 60 * 1000,
        secureCookies: false,
        cookieDomain: 'localhost',
        app: {
            name: 'Upreak'
        },
        port: process.env.PORT || 3000,
        db: {
            username: "upreak",
            password: "upreak",
            database: "upreak_demo",
            host: "143.110.249.17",
            port: "5432",
            dialect: "postgres",
        },
        smtp: { // Yes. SMTP!
            host: 'smtp.office365.com',
            secureConnection: true, // use SSL
            port: 587,
            auth: {
                user: 'noreply@upreak.com',
                pass: '@#PmUpNO2024',
            },
            debug: true
        },
        whatsAppKey : {
            apiUrl : 'https://backend.aisensy.com/campaign/t1/api/v2',
            apiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGYxY2YwZTY0OWY5MGMxMWE1MGIzNCIsIm5hbWUiOiJVcHJlYWsgNTQyNSIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NjRmMWNlZmU2NDlmOTBjMTFhNTBiMjkiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcxNjQ2MDc4NH0.PcEcQihSBxBHKNafYfXyYMU-w0xV_nWYk5PrrOUZRnQ'
        },
        smsOtp : {
            apiKey : 'fcda2Gn4FEa58udXkwA2Ng',
            senderID : 'UPREAK'
        },
        redisDb: {
            host: '127.0.0.1', // Redis server host
            port: 6379, // Redis server port
            password: 'Upreak@2024', // Redis server password (if required)
            retryStrategy: times => {
                //         // reconnect after
                return Math.min(times * 50, 2000);
            }
        },
    },
    production:  {
        baseUrl: 'https://upreak.com',
        root: rootPath,
        env: env,
        sessionLife: 15 * 60 * 1000,
        secureCookies: true,
        cookieDomain: '143.110.249.17',
        app: {
            name: 'Upreak'
        },
        port: process.env.PORT || 3000,
        db: {
            username: "upreak",
            password: "upreak",
            database: "upreak",
            host: "143.110.249.17",
            port: "5432",
            dialect: "postgres",
        },
        smtp: { // Yes. SMTP!
            host: 'smtp.office365.com',
            secureConnection: true, // use SSL
            port: 587,
            auth: {
                user: 'noreply@upreak.com',
                pass: '@#PmUpNO2024',
            },
            debug: true
        },
        whatsAppKey : {
            apiUrl : 'https://backend.aisensy.com/campaign/t1/api/v2',
            apiKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGYxY2YwZTY0OWY5MGMxMWE1MGIzNCIsIm5hbWUiOiJVcHJlYWsgNTQyNSIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NjRmMWNlZmU2NDlmOTBjMTFhNTBiMjkiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcxNjQ2MDc4NH0.PcEcQihSBxBHKNafYfXyYMU-w0xV_nWYk5PrrOUZRnQ'
        },
        smsOtp : {
            apiKey : 'fcda2Gn4FEa58udXkwA2Ng',
            senderID : 'UPREAK'
        },
        redisDb: {
            host: '143.110.249.17', // Redis server host
            port: 6379, // Redis server port
            password: 'Upreak@2024', // Redis server password (if required)
            retryStrategy: times => {
                return Math.min(times * 50, 2000);
            },
        },
    }
};
module.exports = config[env];