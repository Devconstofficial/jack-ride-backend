import express from "express";
import ownerController from "../controllers/owner.controllers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";
import { errorHandler } from "../handlers/error.handlers.js";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { upload } from "../middlewares/upload.middlewares.js";
import riderController from "../controllers/rider.controllers.js";


const adminRouter = express.Router();

//-------------Profile--------------//
// adminRouter.get('/me',
//     authGuard('admin'),
//     errorHandler(adminController.getMyProfile)
// )

//--------Owner------------------//
adminRouter.get(
    '/owners/pending', 
    errorHandler(ownerController.getPendingOwners)
)

adminRouter.put(
    '/owners/approve/:ownerId',
    errorHandler(ownerController.approveOwner)
)

//----------Rider----------------//

adminRouter.get(
    '/riders/pending', 
    errorHandler(riderController .getPendingRiders)
)

adminRouter.put(
    '/riders/approve/:riderId',
    errorHandler(riderController.approveRider)
)
export default adminRouter;