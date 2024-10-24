import createHttpError from "http-errors";
import Rider from "../models/rider.model.js";
import { uploadFileToFirebase } from "./storage.services.js";
import { getAvailableRiders } from "../repositories/rider.repository.js";

const riderServices = {
    async getRiderProfile(riderId){
        let rider = await Rider.findById(riderId);

        return rider;
    },

    async addDriverDetails(riderId, name, contact, birthDate, gender, bio){
        let driverDetails = {name, contact, birthDate, gender, bio}
        let rider = await Rider.findById(riderId);

        if(rider.accountStatus != "driverDetails")
            throw new createHttpError("account status is not driver details");

        rider.driverDetails = driverDetails;

        rider.accountStatus = "license";

        await rider.save();

        return rider;
    },

    // Add license details
    async addLicenseDetails(riderId, issuingState, licenseNumber, issuingDate, selfie, drivingLicenseBack, drivingLicenseFront) {
        let rider = await Rider.findById(riderId);
        if (!rider) {
            throw new createHttpError(404, "Rider not found");
        }

        if (rider.accountStatus !== "license") {
            throw new createHttpError(400, "Account status is not license");
        }

        if(!(selfie && drivingLicenseBack && drivingLicenseFront)){
            throw new createHttpError(400, "Images are missing");
        }

        // Store the promises without awaiting them yet
        let selfiePromise = uploadFileToFirebase(`riders/${rider._id}`, "selfie", selfie[0]);
        let drivingLicenseBackPromise = uploadFileToFirebase(`riders/${rider._id}`, "drivingLicenseBack", drivingLicenseBack[0]);
        let drivingLicenseFrontPromise = uploadFileToFirebase(`riders/${rider._id}`, "drivingLicenseFront", drivingLicenseFront[0]);

        // Wait for all the promises to resolve
        let [selfieUrl, drivingLicenseBackUrl, drivingLicenseFrontUrl] = await Promise.all([
        selfiePromise,
        drivingLicenseBackPromise,
        drivingLicenseFrontPromise
        ]);

        rider.license = { issuingState, licenseNumber, issuingDate, 
            selfieUrl, drivingLicenseBackUrl, drivingLicenseFrontUrl };
        
        rider.accountStatus = "insurance"; // Move to the next step
        await rider.save();
        return rider;
    },

    // Add insurance details
    async addInsuranceDetails(riderId, individualName, address, city, state, zip, insuranceCompany, phone, agentContactNumber, policyStartDate, policyEndDate, isFullConverd, isLiabilityForDamage, converageForRental, policyNumber, expirationDate) {
        let rider = await Rider.findById(riderId);
        if (!rider) {
            throw new createHttpError(404, "Rider not found");
        }

        if (rider.accountStatus !== "insurance") {
            throw new createHttpError(400, "Account status is not insurance");
        }

        rider.insurance = {
            individualName,
            address,
            city,
            state,
            zip,
            insuranceCompany,
            phone,
            agentContactNumber,
            policyStartDate,
            policyEndDate,
            isFullConverd,
            isLiabilityForDamage,
            converageForRental,
            policyNumber,
            expirationDate
        };

        rider.accountStatus = "pending"; // Final status
        await rider.save();
        return rider;
    },
    
    async getPendingRiders(){
        let pendingRiders = await Rider.find({accountStatus: "pending"});

        return pendingRiders;
    },

    async approvePendingRider(riderId, rate){
        let rider = await Rider.findById(riderId);

        if(!rider)
            throw new createHttpError.NotFound("Rider not found");

        if(rider.accountStatus != "pending")
            throw new createHttpError.BadRequest("Rider account status is not pending");

        rider.accountStatus = "verified";
        rider.rate = rate;
        
        await rider.save();

        return rider;
    },

    async getAvailableRiders(startTime, endTime){
        let startTimeDate = new Date(startTime);
        let endTimeDate = new Date(endTime);
        if(!startTimeDate || !endTimeDate)
            throw createHttpError("error in parameters")

        let availableRiders = await getAvailableRiders(startTimeDate, endTimeDate);

        return availableRiders;
    }
};

export default riderServices;