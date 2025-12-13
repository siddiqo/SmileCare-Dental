import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patients'
    },
    dentistName: {
        type: String,
        required: true
    },
    dentistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentists'
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    notes: {
        type: String,
        default: ""
    },
    lat: {
        type: Number,
        default: null
    },
    lon: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const appointmentModel = mongoose.model("appointments", appointmentSchema);
export default appointmentModel;
