const variables = {
    INFOBIP_BASE_URL: 'INFOBIP_BASE_URL'
}

const config = {
    baseUrl: process.env[variables.INFOBIP_BASE_URL] || 'api3.infobip.com',
    baseHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

module.exports = config;