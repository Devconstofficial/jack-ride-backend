import riderServices from "../services/rider.services.js";
import rideServices from "../services/ride.services.js"; // Assuming this exists
import { dataResponse, messageResponse } from "../utils/responses.js";

const rideController = {
    async requestRide(req, res, next){
        let ownerId = req.owner;
        let {riderId, leavingFrom, goingTo, hours, dateForBooking} = req.body;

        let rideRequest = await rideServices.createRideRequest(ownerId, riderId, leavingFrom, goingTo, hours, dateForBooking);

        return res.status(200).send(dataResponse("Ride has been requested", {rideRequest}));
    },

    async showAvailableRiders(req, res, next){
        let {startTime, endTime} = req.query;

        let availableRiders = await riderServices.getAvailableRiders(startTime, endTime);

        return res.status(200).send(dataResponse("Available riders have been fetched", {availableRiders}));
    },

    async getRidesByOwner(req, res, next){
        let {status} = req.query;
        let ownerId = req.owner;

        let rides = await rideServices.getRidesByOwner(ownerId, status);

        return res.status(200).send(dataResponse("Rides have been fetched", {rides}));
    },

    async getRidesByRider(req, res, next){
        let {status} = req.query;
        let riderId = req.rider;

        let rides = await rideServices.getRidesByRider(riderId, status);

        return res.status(200).send(dataResponse("Rides have been fetched", {rides}));
    },

    async reviewRideByOwner(req, res, next){
        let ownerId = req.owner;
        let {rideId, rating, feedback} = req.body;

        let review = await rideServices.reviewRideByOwner(ownerId, rideId, rating, feedback);

        return res.status(200).send(dataResponse("Ride has been reviewed by the owner", {review}));
    },

    async reviewRideByRider(req, res, next){
        let riderId = req.rider;
        let {rideId, rating, feedback} = req.body;

        let review = await rideServices.reviewRideByRider(riderId, rideId, rating, feedback);

        return res.status(200).send(dataResponse("Ride has been reviewed by the rider", {review}));
    },

    async removeRideByOwner(req, res, next){
        let ownerId = req.owner;
        let {rideId} = req.body;

        await rideServices.removeRideByOwner(ownerId, rideId);

        return res.status(200).send(dataResponse("Ride has been removed by the owner"));
    },

    async removeRideByRider(req, res, next){
        let riderId = req.rider;
        let {rideId} = req.body;

        await rideServices.removeRideByRider(riderId, rideId);

        return res.status(200).send(dataResponse("Ride has been removed by the rider"));
    },

    async cancelRideByOwner(req, res, next){
        let ownerId = req.owner;
        let {rideId} = req.body;

        await rideServices.cancelRideByOwner(ownerId, rideId);

        return res.status(200).send(dataResponse("Ride has been canceled by the owner"));
    },

    async cancelRideByRider(req, res, next){
        let riderId = req.rider;
        let {rideId} = req.body;

        await rideServices.cancelRideByRider(riderId, rideId);

        return res.status(200).send(dataResponse("Ride has been canceled by the rider"));
    },

    async getRideRequests(req, res, next){
        let riderId = req.rider;

        let rideRequest = await rideServices.getRideRequests(riderId);

        return res.status(200).send(dataResponse("Ride request has been fetched", {rideRequest}));
    },

    async acceptRideRequest(req, res, next){
        let riderId = req.rider;
        let {requestId} = req.params;

        await rideServices.acceptRideRequest(riderId, requestId);

        return res.status(200).send(messageResponse("Ride request has been accepted"));
    },

    async rejectRideRequest(req, res, next){
        let riderId = req.rider;
        let {requestId} = req.params;

        await rideServices.acceptRideRequest(riderId, requestId);

        return res.status(200).send(messageResponse("Ride request has been rejected"));
    },

    async getAvailableRiders(req, res, next){
        let {startTime, endTime} = req.query;

        let availableRiders = await riderServices.getAvailableRiders(startTime, endTime);

        return res.status(200).send(dataResponse("Available drivers has been fetched", {availableRiders}));
    },

    async completeRide(req, res, next){
        let riderId = req.rider;
        let {rideId} = req.params;

        let ride = await rideServices.completeRide(riderId, rideId);

        return res.status(200).send(dataResponse("Ride has been marked completed", {ride}));
    }
}

export default rideController;