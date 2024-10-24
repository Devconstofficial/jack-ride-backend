import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

export async function getUserNotifications(userId){
    
    let query = [
        {
            $match: {
                recipient: new mongoose.Types.ObjectId(userId)
            }
        },
        {
          $addFields: {
            // Add the 'time' field
            time: {
                $let: {
                  vars: {
                    diffInMinutes: {
                      $divide: [{ $subtract: [new Date(), "$createdAt"] }, 1000 * 60]
                    }
                  },
                  in: {
                    $cond: {
                      if: { $lte: ["$$diffInMinutes", 1] },
                      then: "now",
                      else:{
                        $cond: {
                            if: { $lte: ["$$diffInMinutes", 60] },
                            then: { $concat: [{ $toString: { $floor: "$$diffInMinutes" } }, " min"] },
                            else:{
                                $cond: {
                                    if: { $lte: ["$$diffInMinutes", 24*60] },
                                    then: { $concat: [{ $toString: { $floor: {$divide: ["$$diffInMinutes", 60]} } }, " hr"] },
                                    else: { $concat: [{ $toString: { $floor: {$divide: ["$$diffInMinutes", 60*24]} } }, " days"] }
                                }
                            }
                        }
                      }
                    }
                  }
                }
              },
            // Add the 'section' field
            section: {
              $cond: {
                if: { $eq: [{ $dayOfYear: "$createdAt" }, { $dayOfYear: new Date() }] }, // Same day
                then: "today",
                else: "earlier"
              }
            }
          }
        },
        { $sort: { createdAt: -1 } } // Sort by createdAt in descending order
    ]

    let notifications  = await Notification.aggregate(query)

    return notifications;
}