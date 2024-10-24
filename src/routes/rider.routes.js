import express from "express";
import riderController from "../controllers/rider.controllers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import { errorHandler } from "../handlers/error.handlers.js";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { aboutCarSchema, driverDetailsSchema, licenseDetailsSchema, licensePlateSchema, ownCarSchema, personalDetailsSchema, vinSchema } from "../schemas/user.schemas.js";
import { upload } from "../middlewares/upload.middlewares.js";
import rideController from "../controllers/ride.controllers.js";


const riderRouter = express.Router();

//-------------Profile--------------//
riderRouter.get('/me',
    authGuard('rider'),
    errorHandler(riderController.getMyProfile)
)

riderRouter.post('/driver',
    authGuard('rider'),
    bodyValidator(driverDetailsSchema),
    errorHandler(riderController.addDriverDetails)
)

riderRouter.post('/license',
    upload.fields([
        { name: "drivingLicenseBack", maxCount: 1 },
        { name: "drivingLicenseFront", maxCount: 1 },
        { name: "selfie", maxCount: 1}
    ]),
    authGuard('rider'),
    bodyValidator(licenseDetailsSchema),
    errorHandler(riderController.addLicenseDetails)
)

riderRouter.post('/insurance',
    authGuard('rider'),
    errorHandler(riderController.addInsuranceDetails)
)

//---------Rides--------------//

riderRouter.get('/rides/requests', 
    authGuard('rider'),
    errorHandler(rideController.getRideRequests)
)

riderRouter.post('/rides/requests/accept/:requestId',
    authGuard('rider'),
    errorHandler(rideController.acceptRideRequest)
)

riderRouter.post('/rides/requests/reject/:requestId',
    authGuard('rider'),
    errorHandler(rideController.rejectRideRequest)
)

riderRouter.get('/rides',
    authGuard('rider'),
    errorHandler(rideController.getRidesByRider)
)

riderRouter.post('/rides/review/:rideId',
    authGuard('rider'),
    errorHandler(rideController.reviewRideByRider)
)

riderRouter.delete('/rides',
    authGuard('rider'),
    errorHandler(rideController.removeRideByRider)
)

riderRouter.post('/rides/cancel',
    authGuard('rider'),
    errorHandler(rideController.cancelRideByRider)
)

export default riderRouter;