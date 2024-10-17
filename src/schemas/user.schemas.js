import Joi from 'joi';

export const ownCarSchema = Joi.object({
    isCar: Joi.boolean().required()
})

export const personalDetailsSchema = Joi.object({
    name: Joi.string().required(),
    contact: Joi.string().required(),
    birthDate: Joi.date().required(),
    gender: Joi.string().required()
});

export const driverDetailsSchema = Joi.object({
    name: Joi.string().required(),
    bio: Joi.string().required(),
    contact: Joi.string().required(),
    birthDate: Joi.date().required(),
    gender: Joi.string().required()
});

export const licenseDetailsSchema = Joi.object({
    issuingState: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    issuingDate: Joi.date().required()
});

export const vinSchema = Joi.object({
    vin: Joi.string().required()
})

export const licensePlateSchema = Joi.object({
    licensePlateNumber: Joi.string().required(),
    issuedState: Joi.string().required()
})

export const insuranceDetailsSchema = Joi.object({
    individualName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.string().required(),
    insuranceCompany: Joi.string().required(),
    phone: Joi.string().required(),
    agentContactNumber: Joi.string().required(),
    policyStartDate: Joi.date().required(),
    policyEndDate: Joi.date().required(),
    isFullConverd: Joi.boolean().required(),
    isLiabilityForDamage: Joi.boolean().required(),
    converageForRental: Joi.boolean().required(),
    policyNumber: Joi.number().required(),
    expirationDate: Joi.date().required()
})

export const aboutCarSchema = Joi.object({
    modelYear: Joi.number().required(),
    carMake: Joi.string().required(),
    model: Joi.string().required()
})