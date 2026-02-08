import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  profileController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/refresh", refreshController);

// Protected routes
router.post("/logout", authMiddleware, logoutController);
router.get("/profile", authMiddleware, profileController);

export default router;
