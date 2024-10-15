import express from "express";
import riderController from "../controllers/rider.controllers.js";

const riderRouter = express.Router();

//-------------Profile--------------//

riderRouter.get('/me',
    authGuard('rider'),
)

export default riderRouter;