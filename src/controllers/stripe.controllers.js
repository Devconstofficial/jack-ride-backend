import createHttpError from "http-errors";
import Ride from "../models/ride.model.js";
import { dataResponse } from "../utils/responses.js";
const stripeController = {
    async test(req, res, next){
        // console.log(req.body);
        // console.log('body', req.body.data);
        // console.log('metadata', req.body.data.object.metadata)
        let rideId = req.body.data.object.metadata.rideId;
        
        let status = req.body.data.object.status;

        let ride = await Ride.findById(rideId).populate("riders");

        if(!ride){
            throw createHttpError.NotFound("Ride not found");
        }

        if(status != "succeeded" || (ride.hours*ride.rider.rate*100)-1 > req.body.data.object.amount){
            //Delete Ride//
            await Ride.findByIdAndDelete(rideId);
        }
        else{
            await Ride.findByIdAndUpdate(rideId, {status: "pending"})
        }

        return res.status(200).send(dataResponse("Ride updated successfully", {ride}))
    }
}

export default stripeController;