import express from "express";
import { assignHTTPError, errorResponder, invalidPathHandler } from "../middlewares/error.middlewares.js";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import ownerRouter from "./owner.routes.js";
import riderRouter from "./rider.routes.js";
import adminRouter from "./admin.routes.js";

const router = express.Router();

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/owner', ownerRouter);
router.use('/rider', riderRouter);
router.use('/admin', adminRouter);

router.use(assignHTTPError);
router.use(errorResponder);
router.use(invalidPathHandler);

export default router;