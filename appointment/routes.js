const express = require('express');
const router = express.Router();

const dbService = require('./persistence/service');
const smsService = require('./notifications/service');

const mapToFrontendModel = (appointment) => {
    return appointment != null ? {
        id: appointment._id.toString(),
        scheduledFor: appointment.scheduledFor,
        clientName: appointment.clientName,
        clientPhone: appointment.clientPhone,
        note: appointment.note
    } : null;
};

const mapToNotification = (appointment) => {
    return appointment != null ? {
        appointmentId: appointment._id.toString(),
        phone: appointment.clientPhone,
        message: appointment.notificationMessage,
        sendAt: appointment.notificationScheduledFor
    } : null;
}

router.get('/appointments', (req, res, next) => {
    const { key } = req.account;
    dbService.findAll(key)
        .then((records) => records.map(mapToFrontendModel))
        .then((appointments) => res.json(appointments))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

router.get('/appointments/:id', (req, res, next) => {
    const { key } = req.account;
    const id = req.params.id;
    dbService.findOne(key, id)
        .then(mapToFrontendModel)
        .then((appointment) => {
            if (appointment != null) {
                res.json(appointment)
            } else {
                res.sendStatus(404);
            }
        }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

router.post('/appointments', (req, res, next) => {
    const { key, token } = req.account;
    const appointmentRequest = req.body;
    dbService.create(key, appointmentRequest)
        .then((appointment) => {
            return smsService.scheduleSms(
                token,
                mapToNotification(appointment)
            ).then(() => appointment);
        }).then(mapToFrontendModel)
        .then((appointment) => res.json(201, appointment))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

router.put('/appointments/:id', (req, res, next) => {
    const { key, token } = req.account;
    const id = req.params.id;
    const newSchedule = req.body;
    dbService.reschedule(key, id, newSchedule.scheduledFor)
        .then((appointment) => {
            return smsService.rescheduleSms(
                token,
                appointment._id.toString(),
                appointment.notificationScheduledFor
            ).then(() => appointment);
        }).then(mapToFrontendModel)
        .then((appointment) => res.json(appointment))
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

router.delete('/appointments/:id', (req, res, next) => {
    const { key, token } = req.account;
    const id = req.params.id;
    dbService.delete(key, id)
        .then(() => smsService.cancelSms(token, id))
        .then(() => {
            res.status(204);
            res.end();
        }).catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

module.exports = router;