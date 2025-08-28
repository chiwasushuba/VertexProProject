// routes/requestRoutes.js
import express from "express";
import { createRequest, getRequests, updateRequestStatus } from "../controllers/letterController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRequest);         // user makes a request
router.get("/", protect, adminOnly, getRequests); // admin views requests
router.patch("/:id", protect, adminOnly, updateRequestStatus); // admin updates

export default router;
