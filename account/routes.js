const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('./middlewares');

const { setCookies, clearCookies } = require('./cookies');
const sessionService = require('./service');

router.post('/', (req, res, next) => {
    const { username, password } = req.body;
    sessionService.startSession(username, password)
        .then((token) => {
            setCookies(token, username, res);
            res.sendStatus(201);
        }).catch((err) => {
            console.error(err);
            clearCookies(res);
            res.sendStatus(401);
        });
});

router.delete('/', authenticate, authorize, (req, res, next) => {
    const { token } = req.account;
    sessionService.endSession(token)
        .then(() => {
            clearCookies(res);
            res.status(204);
            res.end();
        }).catch((err) => {
            console.error(err);
            clearCookies(res);
            res.sendStatus(401);
        })
});

module.exports = router;