import express from "express";

import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadsStats,
} from "../controllers/lead.controller";

import {
  protect,
  authorizeRoles,
} from "../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "sales"),
  createLead
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "sales"),
  getLeads
);

router.get(
  "/stats",
  protect,
  authorizeRoles("admin", "sales"),
  getLeadsStats
);

router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "sales"),
  getLeadById
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "sales"),
  updateLead
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteLead
);

export default router;