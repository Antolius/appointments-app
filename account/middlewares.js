const sessionService = require('./service');
const { keys, clearCookies } = require('./cookies');

const publicApi = {};

publicApi.authenticate = (req, res, next) => {
    const token = req.cookies[keys.ACC_TOKEN];
    const key = req.cookies[keys.ACC_KEY];

    if (!!token && !!key) {
        req.account = { token, key };
    }

    next();
};

publicApi.authorize = (req, res, next) => {
    const account = req.account;

    if (!account) {
        clearCookies(res);
        res.sendStatus(401);
    } else {
        sessionService.checkSession(account.token)
            .then(() => next())
            .catch((err) => {
                console.error(err);
                clearCookies(res);
                res.sendStatus(401);
            });
    }
}

module.exports = publicApi;