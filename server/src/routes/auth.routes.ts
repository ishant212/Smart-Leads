import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/auth.controller";

import {
  protect,
  authorizeRoles,
  AuthRequest,
} from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route
router.get(
  "/profile",
  protect,
  (req: AuthRequest, res) => {
    res.status(200).json({
      message: "Protected route accessed",
      user: req.user,
    });
  }
);

// Admin Route
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req: AuthRequest, res) => {
    res.status(200).json({
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

export default router;