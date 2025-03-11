import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getLeases, getLeasesPayments } from "../controllers/leaseController";

const router = express.Router();

router.get("/", getLeases);

router.get("/:id/payments", getLeasesPayments);

export default router;
