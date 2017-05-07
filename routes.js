const express = require('express');
const router = express.Router();

const api = require('./appointment');
const login = require('./account');

login.middlewares.forEach((middleware) => {
    router.use('/api', middleware);
});
router.use('/api', api.routes);

router.use('/login', login.routes);

module.exports = router;