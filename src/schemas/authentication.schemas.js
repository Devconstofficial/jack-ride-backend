import Joi from "joi";
import { emailSchema, encryptedOtpTokenSchema, locationSchema, otpSchema, passwordSchema, phoneSchema } from "./fields.schemas.js";

export const  sendEmailOTPSchema = Joi.object({
    email: emailSchema.required()
})

export const sendPhoneOTPSchema = Joi.object({
    phone: phoneSchema
})

export const verifyOtpSchema = Joi.object({
    encryptedOtpToken: encryptedOtpTokenSchema.required(),
    otp: otpSchema.required()
})

export const registerPetOwnerAccountSchema = Joi.object({
    emailCredentialsToken: Joi.string().min(1).required(),
    phoneCredentialsToken: Joi.string().min(1).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    address: Joi.string().min(1).required(),
    location: locationSchema.required()
})

export const createPasswordSchema = Joi.object({
    createPasswordToken: Joi.string().min(1).required(),
    password: passwordSchema.required()
})

export const loginSchema = Joi.object({
    email: emailSchema.required(),
    password: passwordSchema.required()
})