import { Crypto } from "cryptojs";
import createError from "http-errors";
import jwt from "jsonwebtoken";


export function createOtpEncryption(payload, action, otp){
    let verification = {
        payload,
        action,
        otp,
    }
    
    let otpToken = jwt.sign(verification, process.env.JWT_SECRET_KEY, {expiresIn: process.env.OTP_VALID_TIME*60}); //This Helps in getting Expiry Time
    let encryptedOTPToken = Crypto.AES.encrypt(otpToken, process.env.OTP_ENCRYPTION_KEY).toString();
    return encryptedOTPToken;
}

export function verifyOtpToken(encryptedOTPToken, action, otp){
    let otpToken = Crypto.AES.decrypt(encryptedOTPToken, process.env.OTP_ENCRYPTION_KEY).toString();
    let otpTokenDecrypted = {};
    try{
        otpTokenDecrypted = jwt.verify(otpToken, process.env.JWT_SECRET_KEY)
    }
    catch(err){
        throw new createError.BadRequest(err.message)
    }
    if(otp != otpTokenDecrypted.otp)
        throw new createError.BadRequest("Otp doesn't match")
    delete otpTokenDecrypted.otp;
    if(action != otpTokenDecrypted.action)
        throw new createError.BadRequest("OTP was not generated for " + otpTokenDecrypted.action)
    delete otpTokenDecrypted.action
    
    return otpTokenDecrypted;
}