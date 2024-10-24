import RideRequest from "../models/rideRequest.model.js";

export async function rejectOverLappingRequests(riderId, requestId, dateForBooking, hours){
    let targetStartDate = dateForBooking;
    let targetEndDate = dateForBooking + (hours*3600);
    
    let query = [
        {
            $match: {
                rider: riderId,
                _id: {$ne: requestId},
            }
        },
        //Get End Date
        {
            $addFields: {
                endDate: {
                    $dateAdd: {
                      startDate: "$dateForBooking", // Reference to the startDate field
                      unit: "hour",             // Unit to add (hours in this case)
                      amount: "$hours"          // Amount to add from the hours field
                    }
                },
                startDate: "$dateForBooking"
            }
        },

        {
            $match: {
                $or: [
                    {$and: [
                        {startDate: {$lte: targetStartDate}},
                        {endDate: {$gt: targetStartDate}}
                    ]},
                    {$and: [
                        {startDate: {$lte: targetEndDate}},
                        {endDate: {$gt: targetEndDate}}
                    ]},
                    { // Case 3: The new interval completely overlaps an existing interval
                      $and: [
                        { startDate: { $gte: targetStartDate } },
                        { endDate: { $lte: targetEndDate } }
                      ]
                    }
                ]
            }
        },

        { $project: { endDate: 0, startDate: 0} },

        {
            $set: {
            status: "rejected"  // Example of setting the status field
            }
        },

        {
            $merge: {
                into: "riderequests",
                on: "_id",
                whenMatched: "replace",
                whenNotMatched: "discard"
            }
        }
    ]

    await RideRequest.aggregate(query)
}