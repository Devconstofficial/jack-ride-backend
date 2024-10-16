import userServices from "../services/user.services.js";
import { dataResponse } from "../utils/responses.js";

const userController = {

    async signInAccount(req, res, next){
        let {email, password} = req.body;

        let resBody = await userServices.signInAccount(email, password);

        return res.status(201).send(dataResponse("You have successfully logged in", resBody))
    },

    async getMyProfile(req, res, next){
        let userId = req.user;

        let resBody = await userServices.getMyProfile(userId);

        return res.status(200).send(dataResponse("Profile has been retrieved successfully", resBody))
    },

    async signupAccount(req, res, next){

    },

    async signupWithGoogle(req, res, next){
        
    }
}

export default userController;