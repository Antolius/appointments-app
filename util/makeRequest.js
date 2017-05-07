const https = require('https');

const getResponseHandlerFor = (resolve, reject) => {
    return (res) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
            reject(new Error(`API responded with status code ${res.statusCode}`));
        }
        const responseChunks = [];
        res.on('data', (chunk) => responseChunks.push(chunk));
        res.on('end', () => { resolve(JSON.parse(responseChunks.join(''))) });
    };
};

const makeRequest = (options, reqBody) => {
    return new Promise((resolve, reject) => {
        const responseHandler = getResponseHandlerFor(resolve, reject);

        const req = https.request(options, responseHandler);
        req.on('error', (err) => reject(err));
        if (!!reqBody) {
            req.write(JSON.stringify(reqBody));
        }
        req.end();
    });
};

module.exports = makeRequest;