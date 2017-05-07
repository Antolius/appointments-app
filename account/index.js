const { authenticate, authorize } = require('./middlewares');

const routes = require('./routes');

module.exports = {
    middlewares: [
        authenticate,
        authorize
    ],
    routes
}