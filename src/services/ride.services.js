import createError from 'http-errors';  // Importing http-errors package
import Ride from "../models/ride.model.js";  // Assuming you have this model for rides
import RideRequest from "../models/rideRequest.model.js";  // For ride requests
import { rejectOverLappingRequests } from '../repositories/rideRequests.repository.js';
import { isRiderAvailable } from '../repositories/rider.repository.js';
import createHttpError from 'http-errors';



const rideServices = {
  
    // Create a ride request
    async createRideRequest(ownerId, riderId, leavingFrom, goingTo, hours, dateForBooking) {
        let endTime = dateForBooking + (hours*3600);

        if(!(await isRiderAvailable(riderId, dateForBooking, endTime)))
            throw new createHttpError.BadRequest("Rider is not available for booking");
        const rideRequest = new RideRequest({
            owner: ownerId,
            rider: riderId,
            leavingFrom,
            goingTo,
            hours,
            dateForBooking,
            status: 'pending' // Default status
        });

        await rideRequest.save();
        return rideRequest;
    },

    // Fetch rides by owner, filtered by status
    async getRidesByOwner(ownerId, status) {
        const query = { owner: ownerId };
        if (status) query.status = status;
        
        const rides = await Ride.find(query);

        return rides;
    },

    // Fetch rides by rider, filtered by status
    async getRidesByRider(riderId, status) {
        const query = { rider: riderId };
        if (status) query.status = status;
        
        const rides = await Ride.find(query);

        return rides;
    },

    // Review a ride by the owner
    async reviewRideByOwner(ownerId, rideId, rating, feedback) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            throw createError(404, "Ride not found");
        }
        if (ride.owner.toString() !== ownerId) {
            throw createError(403, "You are not authorized to review this ride");
        }
        if (ride.ownerReview){
            throw createError(400, "Ride already have a review by owner");
        }

        ride.ownerReview = { rating, feedback };
        await ride.save();
        return ride.ownerReview;
    },

    // Review a ride by the rider
    async reviewRideByRider(riderId, rideId, rating, feedback) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            throw createError(404, "Ride not found");
        }
        if (ride.rider.toString() !== riderId) {
            throw createError(403, "You are not authorized to review this ride");
        }
        if (ride.riderReview){
            throw createError(400, "Ride already have a review by rider");
        }

        ride.riderReview = { rating, feedback };
        await ride.save();
        return ride.riderReview;
    },

    // Remove a ride by owner
    async removeRideByOwner(ownerId, rideId) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            throw createError(404, "Ride not found");
        }
        if (ride.owner.toString() !== ownerId) {
            throw createError(403, "You are not authorized to remove this ride");
        }

        await Ride.findByIdAndDelete(rideId);
    },

    // Remove a ride by rider
    async removeRideByRider(riderId, rideId) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            throw createError(404, "Ride not found");
        }
        if (ride.rider.toString() !== riderId) {
            throw createError(403, "You are not authorized to remove this ride");
        }

        await Ride.findByIdAndDelete(rideId);
    },

    // Cancel a ride by owner
    async cancelRideByOwner(ownerId, rideId) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            throw createError(404, "Ride not found");
        }
        if (ride.owner.toString() !== ownerId) {
            throw createError(403, "You are not authorized to cancel this ride");
        }
        if(ride.status != "active"){
            throw createError(400, "Only active Rides can be cancelled");
        }

        ride.status = "cancelled"; // Update status
        await ride.save();
    },

    // Cancel a ride by rider
    async cancelRideByRider(riderId, rideId) {
        const ride = await Ride.findById(rideId);
        if (!ride) {
            throw createError(404, "Ride not found");
        }
        if (ride.rider.toString() !== riderId) {
            throw createError(403, "You are not authorized to cancel this ride");
        }
        if(ride.status != "active"){
            throw createError(400, "Only active Rides can be cancelled");
        }

        ride.status = "cancelled"; // Update status
        await ride.save();
    },

    // Get ride requests for the rider
    async getRideRequests(riderId) {
        const rideRequests = await RideRequest.find({ rider: riderId, status: 'pending' , dateForBooking: {$gte: new Date()}});

        
        return rideRequests;
    },

    // Accept a ride request
    async acceptRideRequest(riderId, requestId) {
        const rideRequest = await RideRequest.findById(requestId);
        if (!rideRequest) {
            throw createError(404, "Ride request not found");
        }
        if (rideRequest.rider.toString() !== riderId) {
            throw createError(403, "You are not authorized to accept this ride request");
        }
        // if(rideRequest.status != "pending"){
        //     throw createError(400, "Ride request status is not pending");
        // }
        if(rideRequest.dateForBooking < new Date()){
            throw createError(400, "Date for booking has already exceeded current date");
        }

        await rejectOverLappingRequests(rideRequest.rider, rideRequest._id, rideRequest.dateForBooking, rideRequest.hours);
        
        rideRequest.status = "accepted"; // Update status

        let ride = new Ride(
            {
                owner: rideRequest.owner,
                rider: rideRequest.rider,
                leavingFrom: rideRequest.leavingFrom,
                goingTo: rideRequest.goingTo,
                hours:rideRequest.hours,
                dateForBooking: rideRequest.dateForBooking,
                acceptedAt: rideRequest.acceptedAt,
                status: "pending"
            }
        )

        await ride.save();

        await rideRequest.save();
    },

    // Reject a ride request
    async rejectRideRequest(riderId, requestId) {
        const rideRequest = await RideRequest.findById(requestId);
        if (!rideRequest) {
            throw createError(404, "Ride request not found");
        }
        if (rideRequest.rider.toString() !== riderId) {
            throw createError(403, "You are not authorized to reject this ride request");
        }
        if(rideRequest.status != "pending"){
            throw createError(400, "Ride request status is not pending");
        }

        rideRequest.status = "rejected"; // Update status
        await rideRequest.save();
    },

    async completeRide(riderId, rideId){
        const ride = await Ride.findById(rideId);
        if (!ride) {
            throw createError(404, "Ride not found");
        }
        if (ride.rider.toString() !== riderId) {
            throw createError(403, "You are not authorized to cancel this ride");
        }
        if(ride.status != "active"){
            throw createError(400, "Only active Rides can be marked completed");
        }

        ride.status = "completed"; // Update status
        await ride.save();
    }
};

export default rideServices;
