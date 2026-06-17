import express from "express";

import {
  protect,
  AuthRequest,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = express.Router();

router.get(
  "/protected",
  protect,
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      message: "Protected route accessed",
      user: req.user,
    });
  }
);
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      message: "Admin route accessed",
      user: req.user,
    });
  }
);
router.get(
  "/sales",
  protect,
  authorizeRoles("sales", "admin"),
  (req: AuthRequest, res) => {
    res.json({
      success: true,
      message: "Sales route accessed",
      user: req.user,
    });
  }
);
export default router;
