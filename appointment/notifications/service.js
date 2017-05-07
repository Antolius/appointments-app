const { Infobip } = require('../../config');
const { makeRequest } = require('../../util');

const baseOptions = (token) => {
    return {
        hostname: Infobip.baseUrl,
        headers: Object.assign(
            {},
            Infobip.baseHeaders,
            { Authorization: `IBSSO ${token}` }
        )
    };
};

const toInfobipFormat = (date) => {
    return date.toISOString().replace('Z', '+00:00');
}

const publicApi = {};

publicApi.scheduleSms = (token, notification) => {
    const reqBody = {
        bulkId: notification.appointmentId,
        messages: [{
            destinations: [{ to: notification.phone }],
            text: notification.message,
            sendAt: toInfobipFormat(notification.sendAt)
        }]
    };

    const options = Object.assign(
        {},
        baseOptions(token),
        {
            path: '/sms/1/text/advanced',
            method: 'POST'
        });

    return makeRequest(options, reqBody)
        .then((sendingResult) => {
            const sendingStatus = sendingResult.messages[0].status;
            const groupStatusId = sendingStatus.groupId;
            switch (groupStatusId) {
                case 1:
                case 3:
                    return;
                default:
                    throw new Error(`Scheduling sms failed with groupStatusId ${groupStatusId}`);
            }
        });
};

publicApi.rescheduleSms = (token, appointmentId, newSendAt) => {
    const reqBody = {
        sendAt: toInfobipFormat(newSendAt)
    };

    const options = Object.assign(
        {},
        baseOptions(token),
        {
            path: `/sms/1/bulks?bulkId=${appointmentId}`,
            method: 'PUT'
        });

    return makeRequest(options, reqBody);
};

publicApi.cancelSms = (token, appointmentId) => {
    const reqBody = {
        status: 'CANCELED'
    };

    const options = Object.assign(
        {},
        baseOptions(token),
        {
            path: `/sms/1/bulks/status?bulkId=${appointmentId}`,
            method: 'PUT'
        });

    return makeRequest(options, reqBody);
};

module.exports = publicApi;