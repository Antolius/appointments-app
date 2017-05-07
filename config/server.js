const variables = {
    PORT: 'PORT',
    SECRET: 'SECRET'
}

if (!process.env[variables.SECRET]) {
    throw new Error('Missing mandatory environment variable SECERET.')
}

const config = {
    port: process.env[variables.PORT] || 3000,
    secret: process.env[variables.SECRET]
};

module.exports = config;