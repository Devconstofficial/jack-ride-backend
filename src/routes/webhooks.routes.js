import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";
import stripeController from "../controllers/stripe.controllers.js";

const webhookRouter = express.Router();

//-------------Profile--------------//

webhookRouter.post('/stripe/payment',
    errorHandler(stripeController.test)
)

export default webhookRouter;