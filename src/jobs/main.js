import { updateRideStatus } from "./ride.jobs.js";
import cron from "node-cron"

export const jobs = {
    activateAll(){
        updateRideStatus();
        // Schedule the job
        cron.schedule('* * * * *', updateRideStatus);

        console.log("cron jobs has been activated");
    }
}