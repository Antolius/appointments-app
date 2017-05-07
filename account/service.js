const { Infobip } = require('../config');
const { makeRequest } = require('../util');

const publicApi = {};

const baseOptions = {
    hostname: Infobip.baseUrl,
    headers: Infobip.baseHeaders
}

publicApi.startSession = (username, password) => {
    const options = Object.assign(
        {},
        baseOptions,
        {
            path: '/auth/1/session',
            method: 'POST'
        });

    const reqBody = { username, password };

    return makeRequest(options, reqBody)
        .then((session) => session.token);
}

publicApi.endSession = (token) => {
    const options = Object.assign(
        {},
        baseOptions,
        {
            path: '/auth/1/session',
            method: 'DELETE'
        });
    options.headers.Authorization = `IBSSO ${token}`;

    return makeRequest(options);
}

publicApi.checkSession = (token) => {
    const options = Object.assign(
        {},
        baseOptions,
        {
            path: '/account/1/balance',
            method: 'GET'
        });
    options.headers.Authorization = `IBSSO ${token}`;

    return makeRequest(options);
}

module.exports = publicApi;