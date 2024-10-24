import Ride from '../models/ride.model.js';

// Define the cron job function
export const updateRideStatus = async () => {
    try {
        const now = new Date();
        
        // Find rides where the booking date is reached or passed and status is still pending
        const ridesToUpdate = await Ride.updateMany(
          { 
            dateForBooking: { $lte: now }, 
            status: "pending" 
          },
          { $set: { status: "active" } }  // Update status to active
        );
        console.log(`${ridesToUpdate.modifiedCount} rides updated to active`);
      } catch (err) {
        console.error('Error updating rides:', err);
      }
};

