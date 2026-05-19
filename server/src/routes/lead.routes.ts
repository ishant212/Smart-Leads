import express from "express";

import {
  createLead,
  getLeads,
  deleteLead,
  updateLead
} from "../controllers/lead.controller";
import { AuthRequest } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// CREATE LEAD
router.post(
  "/",
  protect,
  createLead
);

// GET ALL LEADS
router.get(
  "/",
  protect,
  getLeads
);

// DELETE LEAD
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteLead
);

router.put(
  "/:id",
  protect,
  updateLead
);

export default router;