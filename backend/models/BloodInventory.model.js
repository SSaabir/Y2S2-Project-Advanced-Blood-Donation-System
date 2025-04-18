import mongoose from 'mongoose';

const bloodInventorySchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        required: true,
    },
    availableStocks: {
        type: Number,
        required: true,
        min: 0,
    },
    expirationDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value > new Date(),
            message: "Expiration date must be in the future",
        },
    },
    expiredStatus: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

bloodInventorySchema.statics.updateExpiredStatus = async function () {
    const currentDateTime = new Date();
    const expirationThreshold = new Date();
    expirationThreshold.setDate(currentDateTime.getDate() - 42);
    
    await this.updateMany(
        {
            createdAt: { $lt: expirationThreshold },
            expiredStatus: { $ne: true }
        },
        { 
            expiredStatus: true,
            updatedAt: currentDateTime
        }
    );
}

const BloodInventory = mongoose.model('BloodInventory', bloodInventorySchema);

export default BloodInventory;