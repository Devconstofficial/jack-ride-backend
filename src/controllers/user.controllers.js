import petOwnerServices from "../services/petOwner.services.js";
import userServices from "../services/user.services.js";
import { dataResponse } from "../utils/responses.js";

const userController = {
    async sendSignupOtpToEmail(req, res, next){
        let {email} = req.body;

        let resBody = await userServices.sendSignupOtpToEmail(email);

        return res.status(200).send(dataResponse("Sign up Otp has been sent to email", resBody))
    },

    async verifySignUpEmail(req, res, next){
        let {encryptedOtpToken, otp} = req.body;

        let resBody = await userServices.verifySignUpEmail(encryptedOtpToken, otp);

        return res.status(200).send(dataResponse("Email has been verified successfully", resBody))
    },

    async sendSignupOtpToPhone(req, res, next){
        let {phone} = req.body;
        
        let resBody = await userServices.sendSignupOtpToPhone(phone);

        return res.status(200).send(dataResponse("Sign up Otp has been sent to Phone", resBody))
    },

    async verifySignUpPhone(req, res, next){
        let {encryptedOtpToken, otp} = req.body;

        let resBody = await userServices.verifySignUpPhone(encryptedOtpToken, otp);

        return res.status(200).send(dataResponse("Phone Number has been verified successfully", resBody))
    },

    async registerAccount(req, res, next){
        let {emailCredentialsToken, phoneCredentialsToken, firstName,
            lastName, address, location
        } = req.body;

        let resBody = await userServices.registerAccount(emailCredentialsToken, phoneCredentialsToken, firstName,
            lastName, address, location);

        return res.status(201).send(dataResponse("Account has been created", resBody));
    },

    async createPassword(req, res, next){
        let {createPasswordToken, password} = req.body;

        let resBody = await userServices.createPassword(createPasswordToken, password)

        return res.status(201).send(dataResponse("New password has been created", resBody));
    },

    async sendForgotPasswordOtpToEmail(req, res, next){
        let {email} = req.body;

        let resBody = await userServices.sendForgotPasswordOtpToEmail(email);

        return res.status(200).send(dataResponse("Otp has been successfully sent to your email", resBody));
    },

    async verifyForgotPasswordEmail(req, res, next){
        let {encryptedOtpToken, otp} = req.body;

        let resBody = await userServices.verifyForgotPasswordEmail(encryptedOtpToken, otp)

        return res.status(200).send(dataResponse("Email has been verified successfully for Reset Password", resBody))
    },

    async signInAccount(req, res, next){
        let {email, password} = req.body;

        let resBody = await userServices.signInAccount(email, password);

        return res.status(201).send(dataResponse("You have successfully logged in", resBody))
    },

    async registerPetOwnerAccount(req, res, next){
        let {emailCredentialsToken, phoneCredentialsToken, firstName,
            lastName, address, location
        } = req.body;

        let resBody = await userServices.registerPetOwnerAccount(emailCredentialsToken, phoneCredentialsToken, firstName,
            lastName, address, location);

        return res.status(201).send(dataResponse("Account has been created", resBody));
    },

    async getMyProfile(req, res, next){
        let userId = req.user;

        let resBody = await userServices.getMyProfile(userId);

        return res.status(200).send(dataResponse("Profile has been retrieved successfully", resBody))
    }
}

export default userController;