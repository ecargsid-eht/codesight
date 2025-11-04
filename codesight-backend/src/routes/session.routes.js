import express from 'express'
import { protectRoute } from '../middlewares/protectRoute.js';
import { createSession, endSession, getActiveSessions, getPastSessions, getSessionById, joinSession } from '../controllers/session.controllers.js';

const router = express.Router();

router.get("/", (req, res) => {
    return res.json({msg:"PAHUCH GYA BEY"})
})
router.post("/", protectRoute,createSession);
router.get("/active", protectRoute, getActiveSessions);
router.get("/completed", protectRoute, getPastSessions);
router.get("/:id", protectRoute, getSessionById);
router.post("/:id/join", protectRoute, joinSession);
router.post("/:id/end", protectRoute, endSession);

export default router;