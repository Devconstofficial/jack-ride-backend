import riderServices from "../services/rider.services.js";
import { dataResponse } from "../utils/responses.js";


const riderController = {
    async getMyProfile(req, res, next){
        let riderId = req.rider;

        let rider = await riderServices.getRiderProfile(riderId);

        return res.status(200).send(dataResponse("Rider profile has been retrieved", {rider}));
    },

    async ownCar(req, res, next){
        let riderId = req.rider;

        let {ownCar} = req.body;

        let rider = await riderServices.ownCar(riderId, ownCar);

        return res.status(200).send(dataResponse("User owning car information has been added", {rider}));
    },

    async addDriverDetails(req, res, next){
        let riderId = req.rider;

        let {name, contact, birthDate, gender, bio} = req.body;

        let rider = await riderServices.addDriverDetails(riderId, name, contact, birthDate, gender, bio)

        return res.status(200).send(dataResponse("User personal details has been added", {rider}));
    },

    async addLicenseDetails(req, res, next){
        let riderId = req.rider;

        let {issuingState, licenseNumber, issuingDate} = req.body;

        let {selfie, drivingLicenseBack, drivingLicenseFront} = req.files;

        let rider = await riderServices.addLicenseDetails(riderId, issuingState, licenseNumber, issuingDate, selfie, drivingLicenseBack, drivingLicenseFront);

        return res.status(200).send(dataResponse("User license details has been added", {rider}))
    },

    async addCarDetails(req, res, next){
        let riderId = req.rider;

        let {modelYear, carMake, model} = req.body;

        let {carImages} = req.files;

        let rider = await riderServices.addCarDetails(riderId, modelYear, carMake, model, carImages);

        return res.status(200).send(dataResponse("User car details has been added", {rider}));
    },

    async addVinDetails(req, res, next){
        let riderId = req.rider;

        let {vin} = req.body;

        let rider = await riderServices.addVinDetails(riderId, vin);

        return res.status(200).send(dataResponse("User vin details has been added", {rider}));
    },

    async addInsuranceDetails(req, res, next){
        let riderId = req.rider;

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

        let rider = await riderServices.addInsuranceDetails(riderId, individualName,
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
        
        return res.status(200).send(dataResponse("User insurance details has been added", {rider}));
    },

    async addLicensePlateDetails(req, res, next){
        let riderId = req.rider;

        let {licensePlateNumber, issuedState} = req.body;

        let rider = await riderServices.addLicensePlateDetails(riderId, licensePlateNumber, issuedState);

        return res.status(200).send(dataResponse("User license plate details has been added", {rider}));
    },

    async getPendingRiders(req, res, next){
        let pendingRiders = await riderServices.getPendingRiders();

        return res.status(200).send(dataResponse("Pending Riders has been fetched", {pendingRiders}));
    },

    async approveRider(req, res, next){
        let {riderId} = req.params;

        let rider = await riderServices.approvePendingRider(riderId);

        return res.status(200).send(dataResponse("Pending Rider has been approved", {rider}));
    }
}

export default riderController;