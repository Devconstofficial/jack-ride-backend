import express from "express";
import { bodyValidator } from "../middlewares/bodySchema.middlewares.js";
import { loginSchema, signupSchema, googleSignupSchema } from "../schemas/authentication.schemas.js";
import { errorHandler } from "../handlers/error.handlers.js";
import userController from "../controllers/user.controllers.js";

const authRouter = express.Router();

//Authentication//
//Login//
authRouter.post('/signin',
    bodyValidator(loginSchema),
    errorHandler(userController.signInAccount)
)
//Signup
authRouter.post('/signup',
    bodyValidator(signupSchema),
    errorHandler(userController.signup)
)
//Signup With Google
authRouter.post('/signupWithGoogle',
    bodyValidator(googleSignupSchema),
    errorHandler(userController.signupWithGoogle)
)

export default authRouter;