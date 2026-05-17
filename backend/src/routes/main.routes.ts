import {  Router  } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import {  getHealth  } from "../controllers/health.controller";

const router = Router();

// Health Check
router.get('/health', getHealth);

// API Modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;

