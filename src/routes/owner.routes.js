import express from "express";
import ownerController from "../controllers/owner.controllers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import { errorHandler } from "../handlers/error.handlers.js";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { aboutCarSchema, licenseDetailsSchema, licensePlateSchema, ownCarSchema, personalDetailsSchema, vinSchema } from "../schemas/user.schemas.js";
import { upload } from "../middlewares/upload.middlewares.js";


const ownerRouter = express.Router();

//-------------Profile--------------//
ownerRouter.get('/me',
    authGuard('owner'),
    errorHandler(ownerController.getMyProfile)
)

ownerRouter.post('/own-car',
    authGuard('owner'),
    bodyValidator(ownCarSchema),
    errorHandler(ownerController.ownCar)
)

ownerRouter.post('/personal',
    authGuard('owner'),
    bodyValidator(personalDetailsSchema),
    errorHandler(ownerController.addPersonalDetails)
)

ownerRouter.post('/license',
    upload.fields([
        { name: "drivingLicenseBack", maxCount: 1 },
        { name: "drivingLicenseFront", maxCount: 1 },
        { name: "selfie", maxCount: 1}
    ]),
    authGuard('owner'),
    bodyValidator(licenseDetailsSchema),
    errorHandler(ownerController.addLicenseDetails)
)

ownerRouter.post('/car',
    upload.fields([
        {name: 'carImages', maxCount: 4}
    ]),
    authGuard('owner'),
    bodyValidator(aboutCarSchema),
    errorHandler(ownerController.addCarDetails)
)

ownerRouter.post('/vin',
    authGuard('owner'),
    bodyValidator(vinSchema),
    errorHandler(ownerController.addVinDetails)
)

ownerRouter.post('/license-plate',
    authGuard('owner'),
    bodyValidator(licensePlateSchema),
    errorHandler(ownerController.addLicensePlateDetails)
)

ownerRouter.post('/insurance',
    authGuard('owner'),
    errorHandler(ownerController.addInsuranceDetails)
)

export default ownerRouter;