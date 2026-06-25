import express from "express";
import {
  getUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/user.controller";
import { protect, authorizeRoles } from "../middleware/auth.middleware";

const router = express.Router();

// Apply protect and admin authorization to all user management routes
router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/", getUsers);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;
