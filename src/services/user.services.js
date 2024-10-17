import createError from "http-errors";
import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Owner from "../models/owner.model.js";
import Rider from "../models/rider.model.js";

async function getAuthToken({user, owner, rider}){
    let payload = {
        "user": user._id
    }
    if(owner){
        payload.owner = owner._id;
        payload.ownerVerified = (owner.accountStatus == "verified");
    }
    if(rider){
        payload.rider = rider._id;
        payload.riderVerified = (rider.accountStatus == "verified")
    }
    //Signing it
    let authToken = jwt.sign(payload, process.env.JWT_AUTHENTICATION_SECRET);

    return authToken;
}

const userServices = {
    async registerAccount(email, password, accountType){
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);
        
        let user = new User({
            email: email,
            password: hashedPassword,
            roles: [accountType]
        });

        await user.save();
        let resBody = {
            user
        }
        if(accountType == "owner"){
            let owner = new Owner({
                user: user._id
            });

            await owner.save();

            resBody.owner = owner;
        }
        else if(accountType == "rider"){
            let rider = new Rider({
                user: user._id
            });

            await rider.save();

            resBody.rider = rider;
        }

        resBody.authToken = await getAuthToken({user, owner: resBody.owner, rider: resBody.rider});
        
        return resBody
    },

    async getUserProfile(userId){
        let user = await User.findById(userId);

        if(!user)
            throw new createError.NotFound("User with given information doesn't exist");

        let resBody = {
            user
        }

        if(user.roles.findIndex((val)=>val=="owner")>-1){
            let owner = await Owner.findOne({user: user._id});
            resBody.owner = owner;
        }

        if(user.roles.findIndex((val)=>val=="rider")>-1){
            let rider = await Rider.findOne({user: user._id});
            resBody.rider = rider;
        }

        return resBody
    },

    async signInAccount(email, password){
        let user = await User.findOne({email});

        if(!user)
            throw new createError.NotFound("User with given information doesn't exist");

        if(!user.password)
            throw new createError.BadRequest("User's password is not set, try 3rd party signin");

        let passwordMatched = await bcrypt.compare(password, user.password).catch((err)=>{
            throw new createError.BadRequest(err.message);
        })

        if(!passwordMatched)
            throw new createError.Unauthorized("Password doesn't match");

        let resBody = {
            user
        }
        if(user.roles.findIndex((val)=>val=="owner")>-1){
            let owner = await Owner.findOne({user: user._id})

            resBody.owner = owner;
        }
        else if(user.roles.findIndex((val)=>val=="rider")>-1){
            let rider = await Rider.findOne({user: user._id})

            await rider.save();

            resBody.rider = rider;
        }

        resBody.authToken = await getAuthToken({user, owner: resBody.owner, rider: resBody.rider});
        
        return resBody
    }
}

export default userServices;