const axios = require('axios');
const db = rootRequire('app/models')

const getToken = async () =>  {
    try {
        const tokenData = (await db.tokendata.findOne({ raw: true })).token;
        return tokenData;
    } catch (error) {
        console.error('Error fetching token data:', error);
        throw error;
    }
};

module.exports = { getToken };
