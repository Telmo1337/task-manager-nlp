import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  profileController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

// Public routes with validation
router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/refresh", refreshController);

// Protected routes
router.post("/logout", authMiddleware, logoutController);
router.get("/profile", authMiddleware, profileController);

export default router;
