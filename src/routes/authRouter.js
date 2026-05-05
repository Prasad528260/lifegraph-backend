import express from "express";
import { signupController, loginController, getMe, logoutController, registerAdmin, registerSuperAdmin } from "../controllers/authController.js";
import {userAuth} from "../middlewares/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", signupController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);
authRouter.get("/me", userAuth, getMe);
authRouter.post("/admin/register", registerAdmin);
authRouter.post("/superadmin/register", registerSuperAdmin);

export default authRouter;