import mongoose from "mongoose";
import Rider from "../models/rider.model.js";

export async function getAvailableRiders(startTime, endTime){
    let targetStartTime = new Date(startTime);
    let targetEndTime = new Date(endTime);
    let availableRiders = await Rider.aggregate([
        {
          // Stage 1: Only include verified riders
          $match: {
            accountStatus: "verified"
          }
        },
        {
          // Stage 2: Lookup rides associated with the rider
          $lookup: {
            from: "rides",
            localField: "_id",
            foreignField: "rider",
            as: "rides"
          }
        },
        {
            // Stage 3: Filter out riders who have a ride during the given time period
            $addFields: {
              available: {
                $not: {
                  $size: {
                    $filter: {
                      input: "$rides",
                      as: "ride",
                      cond: {
                        $and: [
                          { $eq: ["$$ride.status", "active"] },  // Ride must be 'active'
                          {
                            // Calculate ride end time
                            $let: {
                              vars: {
                                rideEndTime: { $add: ["$$ride.dateForBooking", { $multiply: ["$$ride.hours", 3600000] }] }  // Add 'hours' to 'dateForBooking'
                              },
                              in: {
                                // Check for time overlap
                                $or: [
                                  { 
                                    // Ride starts before and ends after the requested start time
                                    $and: [
                                      { $lte: ["$$ride.dateForBooking", targetStartTime] }, 
                                      { $gte: ["$$rideEndTime", targetStartTime] }
                                    ]
                                  },  
                                  { 
                                    // Ride starts before and ends after the requested end time
                                    $and: [
                                      { $lte: ["$$ride.dateForBooking", targetEndTime] }, 
                                      { $gte: ["$$rideEndTime", targetEndTime] }
                                    ]
                                  },  
                                  { 
                                    // Ride is fully contained within the requested time
                                    $and: [
                                      { $gte: ["$$ride.dateForBooking", targetStartTime] }, 
                                      { $lte: ["$$rideEndTime", targetEndTime] }
                                    ]
                                  }
                                ]
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
        },
        {
          // Stage 4: Only keep riders who are available (i.e., no conflicting rides)
          $match: {
            available: true
          }
        }
    ]);

    return availableRiders;
}

export async function isRiderAvailable(riderId, startTime, endTime){
    let targetStartTime = new Date(startTime);
    let targetEndTime = new Date(endTime);
    console.log( new mongoose.Types.ObjectId(riderId))
    let availableRiders = await Rider.aggregate([
        {
          // Stage 1: Only include verified riders
          $match: {
            _id: new mongoose.Types.ObjectId(riderId),
            accountStatus: "verified"
          }
        },
        {
          // Stage 2: Lookup rides associated with the rider
          $lookup: {
            from: "rides",
            localField: "_id",
            foreignField: "rider",
            as: "rides"
          }
        },
        {
            // Stage 3: Filter out riders who have a ride during the given time period
            $addFields: {
              available: {
                $not: {
                  $size: {
                    $filter: {
                      input: "$rides",
                      as: "ride",
                      cond: {
                        $and: [
                          {
                            // Calculate ride end time
                            $let: {
                              vars: {
                                rideEndTime: { $add: ["$$ride.dateForBooking", { $multiply: ["$$ride.hours", 3600000] }] }  // Add 'hours' to 'dateForBooking'
                              },
                              in: {
                                // Check for time overlap
                                $or: [
                                  { 
                                    // Ride starts before and ends after the requested start time
                                    $and: [
                                      { $lte: ["$$ride.dateForBooking", targetStartTime] }, 
                                      { $gte: ["$$rideEndTime", targetStartTime] }
                                    ]
                                  },  
                                  { 
                                    // Ride starts before and ends after the requested end time
                                    $and: [
                                      { $lte: ["$$ride.dateForBooking", targetEndTime] }, 
                                      { $gte: ["$$rideEndTime", targetEndTime] }
                                    ]
                                  },  
                                  { 
                                    // Ride is fully contained within the requested time
                                    $and: [
                                      { $gte: ["$$ride.dateForBooking", targetStartTime] }, 
                                      { $lte: ["$$rideEndTime", targetEndTime] }
                                    ]
                                  }
                                ]
                              }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
        },
        {
          // Stage 4: Only keep riders who are available (i.e., no conflicting rides)
          $match: {
            available: true
          }
        }
    ]);
    
    return availableRiders.length==1;
}