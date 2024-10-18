import createHttpError from "http-errors";
import Owner from "../models/owner.model.js";
import { uploadFileToFirebase } from "./storage.services.js";

const ownerServices = {
    async getOwnerProfile(ownerId){
        let owner = await Owner.findById(ownerId);

        return owner;
    },

    async ownCar(ownerId, ownCar){
        let owner = await Owner.findById(ownerId);

        if(owner.accountStatus != "ownCar")
            throw new createHttpError("Account status is not at owning car");

        owner.hasCar = ownCar;

        owner.accountStatus = "personalDetails";

        await owner.save();

        return owner;
    },

    async addPersonalDetails(ownerId, name, contact, birthDate, gender){
        let personalDetails = {name, contact, birthDate, gender}
        let owner = await Owner.findById(ownerId);

        if(owner.accountStatus != "personalDetails")
            throw new createHttpError("account status is not personalDetails");

        owner.personalDetails = personalDetails;

        owner.accountStatus = "license";

        await owner.save();

        return owner;
    },

    // Add license details
    async addLicenseDetails(ownerId, issuingState, licenseNumber, issuingDate, selfie, drivingLicenseBack, drivingLicenseFront) {
        let owner = await Owner.findById(ownerId);
        if (!owner) {
            throw new createHttpError(404, "Owner not found");
        }

        if (owner.accountStatus !== "license") {
            throw new createHttpError(400, "Account status is not license");
        }

        if(!(selfie && drivingLicenseBack && drivingLicenseFront)){
            throw new createHttpError(400, "Images are missing");
        }

        // Store the promises without awaiting them yet
        let selfiePromise = uploadFileToFirebase(`owners/${owner._id}`, "selfie", selfie[0]);
        let drivingLicenseBackPromise = uploadFileToFirebase(`owners/${owner._id}`, "drivingLicenseBack", drivingLicenseBack[0]);
        let drivingLicenseFrontPromise = uploadFileToFirebase(`owners/${owner._id}`, "drivingLicenseFront", drivingLicenseFront[0]);

        // Wait for all the promises to resolve
        let [selfieUrl, drivingLicenseBackUrl, drivingLicenseFrontUrl] = await Promise.all([
        selfiePromise,
        drivingLicenseBackPromise,
        drivingLicenseFrontPromise
        ]);

        owner.license = { issuingState, licenseNumber, issuingDate, 
            selfieUrl, drivingLicenseBackUrl, drivingLicenseFrontUrl };
        
        owner.accountStatus = "vin"; // Move to the next step
        await owner.save();
        return owner;
    },

    // Add VIN details
    async addVinDetails(ownerId, vin) {
        let owner = await Owner.findById(ownerId);
        if (!owner) {
            throw new createHttpError(404, "Owner not found");
        }

        if (owner.accountStatus !== "vin") {
            throw new createHttpError(400, "Account status is not vin");
        }

        owner.vin = vin;
        owner.accountStatus = "licensePlate"; // Update account status
        await owner.save();
        return owner;
    },

    // Add license plate details
    async addLicensePlateDetails(ownerId, licensePlateNumber, issuedState) {
        let owner = await Owner.findById(ownerId);
        if (!owner) {
            throw new createHttpError(404, "Owner not found");
        }

        if (owner.accountStatus !== "licensePlate") {
            throw new createHttpError(400, "Account status is not licensePlate");
        }

        owner.licensePlate = { licensePlateNumber, issuingState: issuedState };
        owner.accountStatus = "insurance"; // Move to the insurance step
        await owner.save();
        return owner;
    },

    // Add insurance details
    async addInsuranceDetails(ownerId, individualName, address, city, state, zip, insuranceCompany, phone, agentContactNumber, policyStartDate, policyEndDate, isFullConverd, isLiabilityForDamage, converageForRental, policyNumber, expirationDate) {
        let owner = await Owner.findById(ownerId);
        if (!owner) {
            throw new createHttpError(404, "Owner not found");
        }

        if (owner.accountStatus !== "insurance") {
            throw new createHttpError(400, "Account status is not insurance");
        }

        owner.insurance = {
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

        owner.accountStatus = "car"; // Final status
        await owner.save();
        return owner;
    },

    // Add car details
    async addCarDetails(ownerId, modelYear, carMake, model, carImages) {
        let owner = await Owner.findById(ownerId);
        if (!owner) {
            throw new createHttpError(404, "Owner not found");
        }

        if (owner.accountStatus !== "car") {
            throw new createHttpError(400, "Account status is not car");
        }

        let carImagesPromises = []

        for(let i = 0; i<carImages.length; i++){
            carImagesPromises.push(uploadFileToFirebase(`owners/${owner._id}`, `carImage-${i}`, carImages[i]));
        }

        let carImagesUrls = await Promise.all(carImagesPromises);

        owner.car = { modelYear, carMake, model, carImages:carImagesUrls };
        owner.accountStatus = "pending"; // Update account status
        await owner.save();
        return owner;
    } ,

    async getPendingOwners(){
        let pendingOwners = await Owner.find({accountStatus: "pending"});

        return pendingOwners;
    },

    async approvePendingOwner(ownerId){
        let owner = await Owner.findById(ownerId);

        if(!owner)
            throw new createHttpError.NotFound("Owner not found");

        if(owner.accountStatus != "pending")
            throw new createHttpError.BadRequest("Owner account status is not pending");

        owner.accountStatus = "verified";

        await owner.save();

        return owner;
    }
};

export default ownerServices;