const crypto = require('crypto');
const { Server } = require('../config');

const hash = crypto.createHash('sha256');

const keys = {
    ACC_TOKEN: 'ACC_TOKEN',
    ACC_KEY: 'ACC_KEY'
}

const toKey = (plaintext) => {
    return hash.update(plaintext + Server.secret).digest('hex');
}

const publicApi = { keys };

publicApi.setCookies = (token, username, res) => {
    res.cookie(keys.ACC_TOKEN, token);
    res.cookie(keys.ACC_KEY, toKey(username));
}

publicApi.clearCookies = (res) => {
    Object.getOwnPropertyNames(keys)
        .forEach((key) => res.clearCookie(key));
}

module.exports = publicApi;