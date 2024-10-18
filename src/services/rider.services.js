import createHttpError from "http-errors";
import Rider from "../models/rider.model.js";
import { uploadFileToFirebase } from "./storage.services.js";

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

    async approvePendingRider(riderId){
        let rider = await Rider.findById(riderId);

        if(!rider)
            throw new createHttpError.NotFound("Rider not found");

        if(rider.accountStatus != "pending")
            throw new createHttpError.BadRequest("Rider account status is not pending");

        rider.accountStatus = "verified";

        await rider.save();

        return rider;
    }
};

export default riderServices;