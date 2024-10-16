import mongoose from "mongoose"

const Schema = mongoose.Schema;

export const Location = new Schema({
    address: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    }
})

export const License = new Schema({
    issuingState: {
        type:String,
        required: true
    },
    licenseNumber: {
        type:String,
        required: true
    },
    issuingDate: {
        type:String,
        required: true
    },
    drivingLicenseFrontUrl: {
        type: String,
        required: true
    },
    drivingLicenseBackUrl: {
        type: String,
        required: true
    },
    selfieUrl: {
        type: String,
        requireD: true
    }
})

export const LicensePlate = new Schema({
    issuingState: {
        type:String,
        required: true
    },
    licensePlateNumber: {
        type:String,
        required: true
    }
})

export const Insurance = new Schema({
    individualName: {
        type:String,
        required: true
    },
    address: {
        type:String,
        required: true
    },
    city: {
        type:String,
        required: true
    },
    state: {
        type:String,
        required: true
    },
    zip: {
        type:String,
        required: true
    },
    insuranceCompany: {
        type:String,
        required: true
    },
    phone: {
        type:String,
        required: true
    },
    agentContactNumber: {
        type:String,
        required: true
    },
    policyStartDate: {
        type:Date,
        required: true
    },
    policyEndDate:{
        type:Date,
        required: true
    },
    isFullConverd: {
        type:Boolean,
        required: true
    },
    isLiabilityForDamage:  {
        type:Boolean,
        required: true
    },
    converageForRental:  {
        type:Boolean,
        required: true
    },
    policyNumber:  {
        type: Number,
        required: true
    },
    expirationDate:  {
        type: Date,
        required: true
    }
})


export const Car = new Schema({
    modelYear: {
        type: Number,
        required: true
    },
    carMake: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    carImges: {
        type: [String],
        default: []
    }
})
