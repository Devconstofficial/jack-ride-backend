import express from "express";
import ownerController from "../controllers/owner.controllers.js";
import { authGuard } from "../middlewares/auth.middlewares.js";


const ownerRouter = express.Router();

//-------------Profile--------------//

ownerRouter.get('/me',
    authGuard('owner'),
)

export default ownerRouter;