import createError from "http-errors";
import User from "../models/user.model.js"
import otpGenerator from "otp-generator";
import { getForgotPasswordTemplate, getSignupOtpTemplate } from "../email-templates/authentication.templates.js";
import emailsServices from "./emails.services.js";
import {createOtpEncryption, verifyOtpToken } from "../utils/otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import util from "util";
import PetOwner from "../models/petOwner.model.js";
const userServices = {
    async sendSignupOtpToEmail(email){
        let user = await User.findOne({email});
        
        if(user)
            throw new createError.Conflict("A user with given email already exists")

        let otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

        let subject = "OTP for Signing Up to " + process.env.APP_NAME
        let body = getSignupOtpTemplate(otp);

        await emailsServices.sendEmail(email, subject, body);

        let encryptedOtpToken = createOtpEncryption({email}, "sign_up", otp);

        return {
            encryptedOtpToken
        }
    },

    async verifySignUpEmail(encryptedOtpToken, otp){
        let decryptedOtpToken = verifyOtpToken(encryptedOtpToken, "sign_up", otp);

        let email = decryptedOtpToken.payload.email;

        let payload = {
            email
        };

        let credentialsToken = jwt.sign(payload, process.env.JWT_SIGNUP_SECRET, {expiresIn: process.env.CREDENTIALS_VALID_TIME*60})

        return {credentialsToken};
    },

    async sendSignupOtpToPhone(phone){
        let user = await User.findOne({phone});
        
        if(user)
            throw new createError.Conflict("A user with given phone number already exists")

        let otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

        let message = "Otp for Signing up is " + otp;

        //await emailsServices.sendEmail(email, subject, body); send To Phone Api

        let encryptedOtpToken = createOtpEncryption({phone}, "sign_up", otp);

        return {
            message,
            encryptedOtpToken
        }
    },

    async verifySignUpPhone(encryptedOtpToken, otp){
        let decryptedOtpToken = verifyOtpToken(encryptedOtpToken, "sign_up", otp);

        let phone = decryptedOtpToken.payload.phone;

        let payload = {
            phone
        };

        let credentialsToken = jwt.sign(payload, process.env.JWT_SIGNUP_SECRET, {expiresIn: process.env.CREDENTIALS_VALID_TIME*60})

        return {credentialsToken};
    },

    async registerAccount(emailCredentialsToken, phoneCredentialsToken, firstName,
    lastName, address, location){
        let email = null;
        let phone = null;
        try{
            let emailPayload = jwt.verify(emailCredentialsToken, process.env.JWT_SIGNUP_SECRET)
            let phonePayload = jwt.verify(phoneCredentialsToken, process.env.JWT_SIGNUP_SECRET)
            email = emailPayload.email;
            phone = phonePayload.phone;
        }
        catch(err){
            throw new createError.BadRequest(err.message)
        }
        
        let user = new User({
            email: email,
            phone,
            firstName,
            lastName,
            address,
            location,

        })

        await user.save();

        let createPasswordToken = jwt.sign({userId: user._id}, process.env.JWT_CREATE_PASSWORD_SECRET, {expiresIn: process.env.CREDENTIALS_VALID_TIME*60})

        return {createPasswordToken, user}
    },

    async createPassword(createPasswordToken, password){
        let userId = null;

        try{
            let createPasswordPayload = jwt.verify(createPasswordToken, process.env.JWT_CREATE_PASSWORD_SECRET);
            userId = createPasswordPayload.userId;
            console.log(createPasswordPayload);
        }
        catch(e){
            throw new createError.BadRequest(err.message)
        }

        let user = await User.findById(userId);

        if(!user)
            throw new createError.NotFound("User not found with given Id");

        let salt = await bcrypt.genSalt(10);

        let hashPassword = util.promisify(bcrypt.hash);

        let encryptedPassword = await hashPassword(password, salt);

        user.password = encryptedPassword;
        
        await user.save();

        return {user}
    },

    async sendForgotPasswordOtpToEmail(email){
        let user = await User.findOne({email});
        
        if(!user)
            throw new createError.NotFound("User doesn't exist with given email")

        let otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

        let subject = "OTP for Forgeting Password to " + process.env.APP_NAME
        let body = getForgotPasswordTemplate(user.firstName, otp);

        await emailsServices.sendEmail(email, subject, body);

        let encryptedOtpToken = createOtpEncryption({userId: user._id}, "forgot_password", otp);

        return {
            encryptedOtpToken
        }
    },

    async verifyForgotPasswordEmail(encryptedOtpToken, otp){
        let decryptedOtpToken = verifyOtpToken(encryptedOtpToken, "forgot_password", otp);
        console.log(decryptedOtpToken);
        let userId = decryptedOtpToken.payload.userId;
        
        let payload = {
            userId
        };

        let createPasswordToken = jwt.sign(payload, process.env.JWT_CREATE_PASSWORD_SECRET, {expiresIn: process.env.CREDENTIALS_VALID_TIME*60})

        return {createPasswordToken};
    },

    async registerPetOwnerAccount(emailCredentialsToken, phoneCredentialsToken, firstName,
        lastName, address, location){
        let email = null;
        let phone = null;
        try{
            let emailPayload = jwt.verify(emailCredentialsToken, process.env.JWT_SIGNUP_SECRET)
            let phonePayload = jwt.verify(phoneCredentialsToken, process.env.JWT_SIGNUP_SECRET)
            email = emailPayload.email;
            phone = phonePayload.phone;
        }
        catch(err){
            throw new createError.BadRequest(err.message)
        }
        
        let user = new User({
            email: email,
            phone,
            firstName,
            lastName,
            roles: ["petOwner"]
        });

        await user.save();

        let petOwner = new PetOwner({
            user: user._id,
            address,
            location,
        });

        await petOwner.save();

        let createPasswordToken = jwt.sign({userId: user._id}, process.env.JWT_CREATE_PASSWORD_SECRET, {expiresIn: process.env.CREDENTIALS_VALID_TIME*60})

        return {createPasswordToken, user, petOwner}
    },

    async registerPetCarerAccount(){
        //Not Implemented//
    },

    async getUserProfile(userId){
        let user = await User.findById(userId);

        if(!user)
            throw new createError.NotFound("User with given information doesn't exist");

        let resBody = {
            user
        }

        if(user.roles.findIndex((val)=>val=="petOwner")>-1){
            let petOwner = await PetOwner.findOne({user: user._id});
            resBody.petOwner = petOwner;
        }

        if(user.roles.findIndex((val)=>val=="petCarer")>-1){
            //Not Implemented Yet
        }

        return resBody
    },

    async signInAccount(email, password){
        let user = await User.findOne({email});

        if(!user)
            throw new createError.NotFound("User with given information doesn't exist");

        if(!user.password)
            throw new createError.BadRequest("User's password is not set, please create one first");

        let passwordMatched = await bcrypt.compare(password, user.password).catch((err)=>{
            throw new createError.BadRequest(err.message);
        })

        if(!passwordMatched)
            throw new createError.Unauthorized("Password doesn't match");

        let payload = {
            user: user._id,
            roles: ["user"]
        }

        let resBody = {
            user
        }

        if(user.roles.findIndex((val)=>val=="petOwner")>-1){
            let petOwner = await PetOwner.findOne({user: user._id});
            resBody.petOwner = petOwner;
            payload.petOwner = petOwner._id;
            payload.roles.push("petOwner")
        }

        if(user.roles.findIndex((val)=>val=="petCarer")>-1){
            //Not Implemented Yet
        }

        let authToken = jwt.sign(payload, process.env.JWT_AUTHENTICATION_SECRET);
        resBody.authToken = authToken;

        return resBody
    },

    async getMyProfile(userId){
        let user = await User.findById(userId);

        if(!user)
            throw new createError.NotFound("User doesn't exist found");

        let resBody = {
            user
        }

        if(user.roles.includes("petOwner")){
            let petOwner = await PetOwner.findOne({user: userId});
            resBody.petOwner = petOwner;
        }

        //Implement pet Carer Logic Here//

        return resBody
    }
}

export default userServices;