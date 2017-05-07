const variables = {
    MONGO_DB_URL: 'MONGO_DB_URL',
    MONGO_DB_USER: 'MONGO_DB_USER',
    MONGO_DB_PASSWORD: 'MONGO_DB_PASSWORD',
}

Object.getOwnPropertyNames(variables).forEach(variable => {
    if (!process.env[variable]) {
        throw new Error(`Missing mandatory environment variable ${variable}.`);
    }
})

function composeUrl(env) {
    return env[variables.MONGO_DB_URL]
        .replace('<dbuser>', env[variables.MONGO_DB_USER])
        .replace('<dbpassword>', env[variables.MONGO_DB_PASSWORD]);
}

const config = {
    connectionUrl: composeUrl(process.env)
};

module.exports = config;