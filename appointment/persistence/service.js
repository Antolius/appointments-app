const mongoose = require('mongoose');
const { Mongo } = require('../../config');
const Appointment = require('./model');

mongoose.connect(Mongo.connectionUrl);
const db = mongoose.connection;

const publicApi = {};

publicApi.findAll = (accountKey) => {
    return Appointment.find({ accountKey }).exec();
};

publicApi.findOne = (accountKey, id) => {
    return Appointment.findOne(
        { _id: id, accountKey }
    ).exec();
};

publicApi.create = (accountKey, appointmentRequest) => {
    const newAppointment = new Appointment({
        accountKey,
        scheduledFor: appointmentRequest.scheduledFor,
        clientName: appointmentRequest.clientName,
        clientPhone: appointmentRequest.clientPhone,
        note: appointmentRequest.note
    });
    return newAppointment.save();
};

publicApi.reschedule = (accountKey, id, newScheduledFor) => {
    return Appointment.findOneAndUpdate(
        { _id: id, accountKey },
        { $set: { scheduledFor: newScheduledFor } },
        { new: true }
    ).exec();
};

publicApi.delete = (accountKey, id) => {
    return Appointment.findOneAndRemove(
        { _id: id, accountKey }
    ).exec();
};

module.exports = publicApi;