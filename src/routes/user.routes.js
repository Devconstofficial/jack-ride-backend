import express from "express";
import { authGuard } from "../middlewares/auth.middlewares.js";
import { errorHandler } from "../handlers/error.handlers.js";
import userController from "../controllers/user.controllers.js";

const userRouter = express.Router();

//-------------Profile--------------//

userRouter.get('/me',
    authGuard('user'),
    errorHandler(userController.getMyProfile)
)

export default userRouter;