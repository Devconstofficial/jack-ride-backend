import express from "express";
import http from "http";
import createHttpError from 'http-errors';
import { Server as socketIo } from 'socket.io';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import Rider from "../src/models/rider.model.js";
import rideServices from "../src/services/ride.services.js";
import riderServices from "../src/services/rider.services.js";
dotenv.config();

// Setup Express and HTTP server
const app = express();
const db = process.env.MONGODB_URI;
mongoose.connect(
  db
).then((result)=>{
  console.log("database successfully connected");
}).catch((err)=>{
  console.log(err)
  console.log("An error starting database occurred");
});
const server = http.createServer(app);
const io = new socketIo(server);
// Store user locations
let rideLocations = {};

io.use((socket, next) => {
  try{
    const token = socket.handshake.headers.access_token;
    if(!token)
        throw new Error("Authorization Token doesn't Exist")

    const jwtToken = token;

    console.log(jwtToken);
    const payload = jwt.verify(jwtToken, process.env.JWT_AUTHENTICATION_SECRET);

    socket.user = payload.user;
    socket.owner = payload.owner;
    socket.ownerVerified = payload.ownerVerified;
    socket.rider = payload.rider;
    socket.riderVerified = payload.riderVerified;
    //socket.admin = payload.admin

    next();
  }
  catch(err){
      let error = new createHttpError.Unauthorized(err.message)
      next(error)
  }
})

let onlineUsers = {}
let onlineRiders = {}
let onlineOwners = {}
let rideRequests = {}

//Services//



io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  if(socket.user){
    onlineUsers[socket.user] = socket.id; 
  }
  if(socket.rider){
    onlineRiders[socket.rider] = socket.id;
  }
  if(socket.owner){
    onlineOwners[socket.owner] = socket.id;
  }

  socket.on('requestRide', async ({leavingFrom, goingTo, dateForBooking, hours})=>{
      try{
        if(!socket.owner)
          throw createHttpError.Unauthorized("Only Owner can request ride");
        //Save Ride Request
        rideRequests[socket.owner] = {ownerId: socket.owner, leavingFrom, goingTo, dateForBooking, hours}
        //Get Available Riders
        let startTime = new Date(dateForBooking);
        let endTime = startTime + hours*3600;

        console.log(startTime, endTime);

        let availableRiders = await riderServices.getAvailableRiders(startTime, endTime)
        console.log(availableRiders);
        //Get Intersection of Online Riders and Available Riders
        let filteredRidersIds = Object.keys(onlineRiders).filter((riderId)=>{
          let index = availableRiders.findIndex((rider)=>rider._id == riderId)

          return index>-1
        });

        //Emit Ride request to riders
        filteredRidersIds.forEach((riderId)=>{
          socket.to(onlineRiders[riderId]).emit('rideRequested', rideRequests[socket.owner])
        })
      }
      catch(err){
        socket.emit("error", {error: err.message});
      }
  })

  socket.on('acceptRide', async ({ownerId})=>{
    try{
      if(!socket.rider)
        throw createHttpError.Unauthorized("Only Rider can accept ride");

      let riderId = socket.rider;

      if(!rideRequests[ownerId]){
        throw createHttpError.NotFound("Request not Found");
      }

      let rider = await Rider.findById(riderId);

      let payload = {
        riderId: rider._id,
        rating: rider.rating || 0,
        reviews: rider.reviews || 0,
        driverDetails: rider.driverDetails,
        rate: rider.rate,
        carDetails: rider.carDetails
      }

      socket.to(onlineOwners[ownerId]).emit('rideAccepted', payload)
    }
    catch(err){
      socket.emit("error", {error: err.message});
    }
     
  })

  socket.on('bookRide', async ({riderId})=>{
      try{
        //Only owner can book ride//
        if(!socket.owner)
          throw createHttpError.Unauthorized("Only Owner can request ride");

        //Only 
        if(!rideRequests[socket.owner]){
          throw createHttpError.BadRequest("There is no ride request associated with you");
        }

        let {
          leavingFrom, goingTo, hours, dateForBooking
        } = rideRequests[socket.owner];

        let ride = await rideServices.bookRide(socket.owner, riderId, leavingFrom, goingTo, hours, dateForBooking);

        //Get Intersection of Online Riders and Available Riders
        let filteredRidersIds = Object.keys(onlineRiders).filter((id) => id!=riderId);
        //Emit Ride request to riders
        filteredRidersIds.forEach((id)=>{
          socket.to(onlineRiders[id]).emit('removeRideRequest', rideRequests[socket.owner])
        })
        //Emit Ride Booked Event to him
        socket.to(onlineRiders[riderId]).emit('rideBooked', ride)
        socket.emit('rideBooked', ride)
        delete rideRequests[socket.owner];
      }
      catch(err){
        socket.emit("error", {error: err.message});
      }

  })
  // Join a room based on user ID
  socket.on('joinRide', ({ rideId }) => {
    socket.join(rideId);  // Join the specified room
    console.log(`User with ID ${socket.id} joined ride: ${rideId}`);
  });

  // Listen for location updates from clients
  socket.on('updateLocation', ({ rideId, lat, lng }) => {
    if(socket.rider){
        rideLocations[rideId]["riderLocation"] = {
            "riderId": userId,
            "lat": lat,
            "lng": lng
        };
    }
    else if(socket.owner){
        rideLocations[rideId]["ownerLocation"] = {
            "ownerId": userId,
            "lat": lat,
            "lng": lng
        };
    }

    // Emit the location update to the specific room
    socket.to(rideId).emit('locationUpdate', rideLocations[rideId]);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    if(socket.user){
      delete onlineUsers[socket.user]; 
    }
    if(socket.rider){
      delete onlineRiders[socket.rider];
    }
    if(socket.owner){
      delete onlineOwners[socket.owner];
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});