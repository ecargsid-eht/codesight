import express from 'express';
import { protectRoute } from '../middlewares/protectRoute';

const router = express.Router();

router.get("/token",protectRoute, getStreamToken)

export default router;