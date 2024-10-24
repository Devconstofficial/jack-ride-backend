import express from "express";
import { errorHandler } from "../handlers/error.handlers.js";

const webhookRouter = express.Router();

//-------------Profile--------------//

webhookRouter.post('/stripe/payment',
    errorHandler(stripeController.test)
)

export default webhookRouter;