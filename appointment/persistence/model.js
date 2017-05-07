const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MILLIS_IN_HOUR = 3600000;

const AppointmentSchema = Schema({
    accountKey: { type: String, required: true },
    scheduledFor: { type: Date, required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    note: { type: String, required: false }
});

AppointmentSchema
    .virtual('notificationMessage')
    .get(function() {
        return `Hello ${this.clientName}, this is a reminder of your appointment scheduled for ${this.scheduledFor}.`;
    });

AppointmentSchema
    .virtual('notificationScheduledFor')
    .get(function() {
        return new Date(this.scheduledFor.valueOf() - 1 * MILLIS_IN_HOUR);
    });


module.exports = mongoose.model('Appointment', AppointmentSchema);