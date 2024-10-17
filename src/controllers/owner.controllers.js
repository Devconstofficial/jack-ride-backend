import ownerServices from "../services/owner.services.js";
import { dataResponse } from "../utils/responses.js";

const ownerController = {
    async getMyProfile(req, res, next){
        let ownerId = req.owner;

        let owner = await ownerServices.getOwnerProfile(ownerId);

        return res.status(200).send(dataResponse("Owner profile has been retrieved", {owner}));
    },

    async ownCar(req, res, next){
        let ownerId = req.owner;

        let {ownCar} = req.body;

        let owner = await ownerServices.ownCar(ownerId, ownCar);

        return res.status(200).send(dataResponse("User owning car information has been added", {owner}));
    },

    async addPersonalDetails(req, res, next){
        let ownerId = req.owner;

        let {name, contact, birthDate, gender} = req.body;

        let owner = await ownerServices.addPersonalDetails(ownerId, name, contact, birthDate, gender)

        return res.status(200).send(dataResponse("User personal details has been added", {owner}));
    },

    async addLicenseDetails(req, res, next){
        let ownerId = req.owner;

        let {issuingState, licenseNumber, issuingDate} = req.body;

        let {selfie, drivingLicenseBack, drivingLicenseFront} = req.files;

        let owner = await ownerServices.addLicenseDetails(ownerId, issuingState, licenseNumber, issuingDate, selfie, drivingLicenseBack, drivingLicenseFront);

        return res.status(200).send(dataResponse("User license details has been added", {owner}))
    },

    async addCarDetails(req, res, next){
        let ownerId = req.owner;

        let {modelYear, carMake, model} = req.body;

        let {carImages} = req.files;

        let owner = await ownerServices.addCarDetails(ownerId, modelYear, carMake, model, carImages);

        return res.status(200).send(dataResponse("User car details has been added", {owner}));
    },

    async addVinDetails(req, res, next){
        let ownerId = req.owner;

        let {vin} = req.body;

        let owner = await ownerServices.addVinDetails(ownerId, vin);

        return res.status(200).send(dataResponse("User vin details has been added", {owner}));
    },

    async addInsuranceDetails(req, res, next){
        let ownerId = req.owner;

        let {individualName,
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
            expirationDate} = req.body;

        let owner = await ownerServices.addInsuranceDetails(ownerId, individualName,
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
            expirationDate);
        
        return res.status(200).send(dataResponse("User insurance details has been added", {owner}));
    },

    async addLicensePlateDetails(req, res, next){
        let ownerId = req.owner;

        let {licensePlateNumber, issuedState} = req.body;

        let owner = await ownerServices.addLicensePlateDetails(ownerId, licensePlateNumber, issuedState);

        return res.status(200).send(dataResponse("User license plate details has been added", {owner}));
    }
}

export default ownerController;