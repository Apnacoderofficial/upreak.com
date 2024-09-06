const axios = require('axios');
const db = require("../config/dbconfig");

const getToken = async () =>  {
    try {
            const tokenData = (await db.tokendata.findOne({ raw: true })).token;
            return tokenData;
        } catch (error) {
            console.error('Error fetching token data:', error);
            throw error;
        }
    };
// {
//     const tenantId = 'c8230646-977d-418c-b850-2becb408151f';
//     const clientId = '547243f1-c1cd-48a6-bafc-522d3ddd4410';
//     const clientSecret = 'OyH8Q~NmPRj_An5beCD57PrhiWfdfJbKgRDjMclm';
//     const grantType = 'client_credentials';
//     const authorizationCode = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImU3MnkyRFVoY3k5MGdkeUw3bzlvSWM1Znd6OUJXRjNsX1dLTmRHS3FkcHMiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSIsImtpZCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jODIzMDY0Ni05NzdkLTQxOGMtYjg1MC0yYmVjYjQwODE1MWYvIiwiaWF0IjoxNzA2MTExOTI2LCJuYmYiOjE3MDYxMTE5MjYsImV4cCI6MTcwNjExNTgyNiwiYWlvIjoiRTJWZ1lOak5lVHg4MDl3WWRqdVc2ZDd6bCs4MUJRQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJVcHJlYWsgTWVldGluZyIsImFwcGlkIjoiNTQ3MjQzZjEtYzFjZC00OGE2LWJhZmMtNTIyZDNkZGQ0NDEwIiwiYXBwaWRhY3IiOiIxIiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYzgyMzA2NDYtOTc3ZC00MThjLWI4NTAtMmJlY2I0MDgxNTFmLyIsImlkdHlwIjoiYXBwIiwib2lkIjoiNzM1ZjU3Y2YtMDllOS00NzUxLTkxYzktM2E4YjllOTNhY2IwIiwicmgiOiIwLkFVb0FSZ1lqeUgyWGpFRzRVQ3ZzdEFnVkh3TUFBQUFBQUFBQXdBQUFBQUFBQUFDSkFBQS4iLCJyb2xlcyI6WyJPbmxpbmVNZWV0aW5ncy5SZWFkV3JpdGUuQWxsIiwiVXNlci5SZWFkV3JpdGUuQWxsIiwiQ2FsZW5kYXJzLlJlYWQiLCJVc2VyLkVuYWJsZURpc2FibGVBY2NvdW50LkFsbCIsIlVzZXIuSW52aXRlLkFsbCIsIlVzZXIuUmVhZC5BbGwiLCJDYWxlbmRhcnMuUmVhZEJhc2ljLkFsbCIsIlVzZXIuRXhwb3J0LkFsbCIsIkNhbGVuZGFycy5SZWFkV3JpdGUiLCJVc2VyLk1hbmFnZUlkZW50aXRpZXMuQWxsIl0sInN1YiI6IjczNWY1N2NmLTA5ZTktNDc1MS05MWM5LTNhOGI5ZTkzYWNiMCIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImM4MjMwNjQ2LTk3N2QtNDE4Yy1iODUwLTJiZWNiNDA4MTUxZiIsInV0aSI6IlEzanZpSThxNFVPbVBqWjgzbUhoQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjA5OTdhMWQwLTBkMWQtNGFjYi1iNDA4LWQ1Y2E3MzEyMWU5MCJdLCJ4bXNfdGNkdCI6MTY4OTYxNDQwMX0.zPK2xMtDohoktueD8_zCa-fzqsVfIaKG8SUyIuhw0eGz-V78_ckeWKJY4Z_bB5sgXj7NByWwylOv-tBSMSaegsF33RLyooNrcx7HcHPxpuIqBE9lnJIKpT2tCzZfbNXPAKZXOvTeTMKBka1zthKbZ-EzSaCteDlxDhmlmnIOsaimYDoX8CQYIcvfOq8E5G8CkUe-CSuDVyk_fncABYcF6FHLOJ1AGfeLXMj_fpbAbY0hxBbAFf_X_Mf7nOjKkuG8wT6GFV3gVnfIggc-GjDCnj2F0MIHCPcX4z5I6h7Hsa80Gjk0hvHdnX2Wm2Q_ZMtKqtzt_pavrhkV3kM0i62clA';

//     const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
//     const data = {
//         grant_type: grantType,
//         client_id: clientId,
//         client_secret: clientSecret,
//         code: authorizationCode,
//         scope: 'https://graph.microsoft.com/.default',
//     };

//     try {
//         const response = await axios.post(url, new URLSearchParams(data));
//         const accessToken = response.data.access_token;
//         return accessToken;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

module.exports = {
    getToken,
};
