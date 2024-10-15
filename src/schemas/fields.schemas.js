import Joi from "joi";

//Authentication//
export const emailSchema = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
export const encryptedOtpTokenSchema = Joi.string().min(1)
export const otpSchema = Joi.string().pattern(/^\d+$/).min(4).max(6) //As Most of Otps are between 4-6 Digits
export const countryCodeSchema = Joi.string().pattern(/^\+\d{1,4}$/).messages({'string.pattern.base': 'Country code must start with a "+" and be followed by 1-4 digits.'})
export const phoneNumberSchema = Joi.string().pattern(/^\d+$/).min(8)
export const phoneSchema = Joi.object({
    countryCode: countryCodeSchema.required(),
    number: phoneNumberSchema.required()
});
export const passwordSchema = Joi.string()
    .min(8) // Minimum 8 characters
    .max(30) // Maximum 30 characters
    // .pattern(/[a-z]/) // Must contain at least one lowercase letter
    // .pattern(/[A-Z]/) // Must contain at least one uppercase letter
    // .pattern(/\d/) // Must contain at least one digit
    // .pattern(/[!@#$%^&*(),.?":{}|<>]/) // Must contain at least one special character
    .messages({
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password must not exceed 30 characters.',
        //'string.pattern.base': 'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.',
    });

//Profile//
export const locationSchema = Joi.object({
    lat: Joi.number().greater(-90).less(90).required(),
    lng: Joi.number().greater(-180).less(180).required()
})