import createError from "http-errors";
import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userServices = {
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

        //Implement pet Carer Logic Here//

        return resBody
    }
}

export default userServices;