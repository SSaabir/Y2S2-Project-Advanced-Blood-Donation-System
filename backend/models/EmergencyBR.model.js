import mongoose from 'mongoose';

const emergencyBRSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: (value) => /^\d{10}$/.test(value),
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
    proofOfIdentificationNumber: { type: String, required: true },
    proofDocument: { type: String, required: false, default: null },
    patientBlood: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    units: { type: Number, required: true, min: 1 },
    criticalLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true,
    },
    withinDate: { type: String, required: true }, // Removed default
    activeStatus: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Inactive",
    },
    hospitalName: { type: String, required: true },
    address: { type: String, required: true },
    acceptStatus: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending",
    },
    declineReason: { type: String, required: false, default: null },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        refPath: 'acceptedByType',
        default: null,
    },
    acceptedByType: {
        type: String,
        required: false,
        enum: ['Hospital', 'Donor'],
        default: null,
    },
}, { timestamps: true });

emergencyBRSchema.statics.cancelExpiredRequests = async function () {
    const currentDate = new Date();
    const requests = await this.find({
        withinDate: { $lt: currentDate }
    });

    for (const request of requests) {
        request.acceptStatus = 'Declined';
        request.activeStatus = 'Inactive';
        await request.save();
    }
}

const EmergencyBR = mongoose.model('EmergencyBR', emergencyBRSchema);

export default EmergencyBR;