import express from "express";
import { authGuard } from "../middlewares/auth.middlewares.js";
import { errorHandler } from "../handlers/error.handlers.js";
import userController from "../controllers/user.controllers.js";
import notificationController from "../controllers/notification.controllers.js";

const userRouter = express.Router();

//-------------Profile--------------//

userRouter.get('/me',
    authGuard('user'),
    errorHandler(userController.getMyProfile)
)

userRouter.get('/notifications',
    authGuard('user'),
    errorHandler(notificationController.getUserNotifications)
)

userRouter.post('/notifications',
    authGuard('user'),
    errorHandler(notificationController.addNotificationToken)
)

export default userRouter;